document.addEventListener("DOMContentLoaded", () => {
    const orderParams = new URLSearchParams(window.location.search);
    const orderProducts = window.productArray ?? [];
    const productList = document.querySelector(".product-section .product-list");
    const summaryValues = document.querySelectorAll(".summary-card dd strong");
    const checkoutButton = document.querySelector(".checkout-button");
    const formatPrice = (value) => Number(value).toLocaleString("ko-KR");
    let requestedItems = [];

    if (orderParams.get("source") === "cart") {
        try {
            const storedOrderItems = JSON.parse(localStorage.getItem("romandOrderItems") ?? "[]");
            if (Array.isArray(storedOrderItems)) requestedItems = storedOrderItems;
        } catch (error) {
            requestedItems = [];
        }
    } else if (orderParams.has("pid")) {
        requestedItems = [{
            pid: Number(orderParams.get("pid")),
            option: Math.max(0, Number(orderParams.get("option")) || 0),
            quantity: Math.max(1, Number(orderParams.get("qty")) || 1),
        }];
    }

    const orderItems = requestedItems.map((item) => {
        const product = orderProducts.find((candidate) => candidate.pid === Number(item.pid));
        if (!product) return null;

        const colors = product.pcolors?.length ? product.pcolors : ["#dddddd"];
        const optionIndex = Math.min(Math.max(0, Number(item.option) || 0), colors.length - 1);
        const quantity = Math.max(1, Number(item.quantity) || 1);

        return {
            product,
            optionIndex,
            quantity,
            color: colors[optionIndex],
            optionName: product.pcolors?.length
                ? `${String(optionIndex + 1).padStart(2, "0")} 컬러`
                : "단일 상품",
        };
    }).filter(Boolean);

    if (orderItems.length && productList) {
        const originalTotal = orderItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
        const saleTotal = orderItems.reduce((sum, item) => sum + item.product.priceDiscount * item.quantity, 0);
        const discountTotal = originalTotal - saleTotal;

        productList.innerHTML = orderItems.map(({ product, optionIndex, quantity, color, optionName }) => `
            <li class="product-item" data-pid="${product.pid}" data-option="${optionIndex}">
                <figure class="product-image">
                    <img src="./img/${product.plipImgName}" alt="${product.pname}">
                </figure>
                <div class="product-copy">
                    <strong>${product.pname}</strong>
                    <span><i class="order-color-chip" style="background-color:${color}"></i>${optionName}</span>
                </div>
                <span class="product-quantity">${quantity}개</span>
                <strong class="product-price">${formatPrice(product.priceDiscount * quantity)}원</strong>
            </li>
        `).join("");

        if (summaryValues[0]) summaryValues[0].textContent = formatPrice(originalTotal);
        if (summaryValues[1]) summaryValues[1].textContent = "0";
        if (summaryValues[2]) summaryValues[2].textContent = `-${formatPrice(discountTotal)}`;
        if (checkoutButton) checkoutButton.textContent = `${formatPrice(saleTotal)}원 결제하기`;
    } else if (productList) {
        productList.innerHTML = '<li class="product-item">선택된 상품이 없습니다.</li>';
        if (summaryValues[0]) summaryValues[0].textContent = "0";
        if (summaryValues[1]) summaryValues[1].textContent = "0";
        if (summaryValues[2]) summaryValues[2].textContent = "0";
        if (checkoutButton) checkoutButton.textContent = "0원 결제하기";
    }

    const paymentButtons = document.querySelectorAll("[data-payment]");
    const cardPanel = document.querySelector('[data-panel="card"]');
    const otherPanel = document.querySelector('[data-panel="other"]');
    const form = document.querySelector("#order-form");
    const formMessage = document.querySelector(".form-message");
    const addressSearchButton = document.querySelector("#address-search");
    const postcodeInput = document.querySelector("#postcode");
    const addressInput = document.querySelector("#address");
    const addressDetailInput = document.querySelector("#address-detail");
    const phoneInput = document.querySelector("#phone");
    const postcodeModal = document.querySelector("#postcode-modal");
    const postcodeEmbed = document.querySelector("#postcode-embed");
    const postcodeCloseButtons = document.querySelectorAll("[data-postcode-close]");
    const postcodeScriptUrl = "https://t1.kakaocdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    let postcodeScriptPromise;

    const getPostcodeConstructor = () => window.kakao?.Postcode || window.daum?.Postcode;

    const renderPostcodeStatus = (message) => {
        const status = document.createElement("p");
        status.className = "postcode-loading";
        status.textContent = message;
        postcodeEmbed.replaceChildren(status);
    };

    const loadPostcodeApi = () => {
        const Postcode = getPostcodeConstructor();

        if (Postcode) {
            return Promise.resolve(Postcode);
        }

        if (postcodeScriptPromise) {
            return postcodeScriptPromise;
        }

        postcodeScriptPromise = new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.id = "kakao-postcode-script";
            script.src = postcodeScriptUrl;
            script.async = true;
            script.addEventListener("load", () => {
                const LoadedPostcode = getPostcodeConstructor();

                if (LoadedPostcode) {
                    resolve(LoadedPostcode);
                    return;
                }

                script.remove();
                postcodeScriptPromise = undefined;
                reject(new Error("Kakao Postcode API was not initialized."));
            }, { once: true });
            script.addEventListener("error", () => {
                script.remove();
                postcodeScriptPromise = undefined;
                reject(new Error("Kakao Postcode API failed to load."));
            }, { once: true });
            document.head.append(script);
        });

        return postcodeScriptPromise;
    };

    const closePostcodeModal = () => {
        postcodeModal.hidden = true;
        document.body.classList.remove("is-postcode-open");
        addressSearchButton.setAttribute("aria-expanded", "false");
        addressSearchButton.focus();
    };

    const updateInputValue = (input, value) => {
        input.value = value;
        input.dispatchEvent(new Event("input", { bubbles: true }));
        input.dispatchEvent(new Event("change", { bubbles: true }));
    };

    const applySelectedAddress = (data) => {
        const selectedAddress = data.userSelectedType === "R"
            ? data.roadAddress || data.address
            : data.jibunAddress || data.address;
        const extraAddressParts = [];

        if (data.userSelectedType === "R") {
            if (data.bname && /[동로가]$/.test(data.bname)) {
                extraAddressParts.push(data.bname);
            }

            if (data.buildingName && data.apartment === "Y") {
                extraAddressParts.push(data.buildingName);
            }
        }

        const extraAddress = extraAddressParts.length > 0
            ? ` (${extraAddressParts.join(", ")})`
            : "";

        updateInputValue(postcodeInput, data.zonecode || "");
        updateInputValue(addressInput, `${selectedAddress || ""}${extraAddress}`);
        formMessage.textContent = "";
        closePostcodeModal();
        requestAnimationFrame(() => addressDetailInput.focus());
    };

    addressSearchButton.addEventListener("click", async () => {
        postcodeModal.hidden = false;
        document.body.classList.add("is-postcode-open");
        addressSearchButton.setAttribute("aria-expanded", "true");
        renderPostcodeStatus("주소 검색 서비스를 불러오는 중입니다.");

        try {
            const Postcode = await loadPostcodeApi();
            postcodeEmbed.replaceChildren();
            new Postcode({
                oncomplete: applySelectedAddress,
                autoClose: false,
                width: "100%",
                height: "100%",
            }).embed(postcodeEmbed);
        } catch (error) {
            renderPostcodeStatus("주소 검색 서비스를 불러오지 못했습니다. 인터넷 연결을 확인해 주세요.");
            formMessage.textContent = "주소 검색 서비스를 불러오지 못했습니다.";
        }
    });

    postcodeCloseButtons.forEach((button) => {
        button.addEventListener("click", closePostcodeModal);
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && !postcodeModal.hidden) {
            closePostcodeModal();
        }
    });

    paymentButtons.forEach((button) => {
        button.addEventListener("click", () => {
            paymentButtons.forEach((item) => {
                const isSelected = item === button;
                item.classList.toggle("is-active", isSelected);
                item.setAttribute("aria-pressed", String(isSelected));
            });

            const isCard = button.dataset.payment === "card";
            cardPanel.hidden = !isCard;
            otherPanel.hidden = isCard;
        });
    });

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        if (!form.checkValidity()) {
            form.reportValidity();
            formMessage.textContent = "필수 정보를 확인해 주세요.";
            return;
        }

        const password = form.elements.orderPassword.value;
        const passwordConfirm = form.elements.orderPasswordConfirm.value;

        if (password !== passwordConfirm) {
            formMessage.textContent = "주문조회 비밀번호가 일치하지 않습니다.";
            form.elements.orderPasswordConfirm.focus();
            return;
        }

        formMessage.textContent = "주문 정보가 확인되었습니다.";
    });
    phoneInput.addEventListener("input", (event) => {
    let value = event.target.value.replace(/[^0-9]/g, "");

    // 숫자는 최대 11자리까지만
    value = value.slice(0, 11);

    if (value.length <= 3) {
        event.target.value = value;
    } else if (value.length <= 7) {
        event.target.value =
            `${value.slice(0, 3)}-${value.slice(3)}`;
    } else {
        event.target.value =
            `${value.slice(0, 3)}-${value.slice(3, 7)}-${value.slice(7)}`;
    }
});
});

