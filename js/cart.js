const cartParams = new URLSearchParams(window.location.search);
const cartProducts = window.productArray ?? [];
const requestedCartPid = cartParams.has('pid') ? Number(cartParams.get('pid')) : Number.NaN;
const cartProduct = cartProducts.find((product) => product.pid === requestedCartPid);
const requestedQuantity = Math.max(1, Number(cartParams.get('qty')) || 1);
const requestedOptionIndex = Math.max(0, Number(cartParams.get('option')) || 0);
const cartItemsContainer = document.querySelector('.content-left > ul');
const paymentItemsContainer = document.querySelector('.content-right .product-info');
const orderLink = document.querySelector('.cart-order-link');

function formatCartPrice(value) {
    return Number(value).toLocaleString('ko-KR');
}

function getProductOption(product, optionIndex) {
    const colors = product.pcolors?.length ? product.pcolors : ['#dddddd'];
    const safeIndex = Math.min(optionIndex, colors.length - 1);

    return {
        index: safeIndex,
        color: colors[safeIndex],
        name: product.pcolors?.length
            ? `${String(safeIndex + 1).padStart(2, '0')} 컬러`
            : '단일 상품',
    };
}

function addCartProduct(product, optionIndex = 0, quantity = 1) {
    if (!product || !cartItemsContainer || !paymentItemsContainer) return;

    const option = getProductOption(product, optionIndex);
    const key = `${product.pid}-${option.index}`;
    const existingItem = cartItemsContainer.querySelector(`[data-cart-key="${key}"]`);

    if (existingItem) {
        const countElement = existingItem.querySelector('.counter span');
        countElement.textContent = Number(countElement.textContent) + quantity;
        existingItem.querySelector('input[type="checkbox"]').checked = true;
        return;
    }

    cartItemsContainer.querySelector('.empty-cart')?.remove();
    cartItemsContainer.insertAdjacentHTML('beforeend', `
        <li class="cart-list" data-cart-key="${key}" data-pid="${product.pid}" data-option="${option.index}">
            <input type="checkbox" checked aria-label="${product.pname} 선택">
            <figure>
                <img src="./img/${product.plipImgName}" alt="${product.pname}">
            </figure>
            <div class="cart-info">
                <div class="product-desc">
                    <div class="product-name">${product.pname}</div>
                    <button type="button" class="close-btn" aria-label="${product.pname} 삭제">
                        <img src="./img/close.svg" alt="">
                    </button>
                </div>
                <div class="product-option">
                    <p><span class="cart-color-chip" style="background-color:${option.color}"></span>${option.name}</p>
                    <div class="btn-bg"><p>옵션 선택</p></div>
                </div>
                <div class="product-sub">
                    <div class="product-price">
                        <div class="price-original"><span>${formatCartPrice(product.price)}</span><span>원</span></div>
                        <div class="price-re">
                            <div class="price-sale-per">${Math.round(product.pdiscount * 100)}%</div>
                            <div class="price-sale-price" data-unit-price="${product.priceDiscount}">${formatCartPrice(product.priceDiscount)}원</div>
                        </div>
                    </div>
                    <div class="counter">
                        <figure><img src="./img/minus.svg" alt="minus"></figure>
                        <span>${quantity}</span>
                        <figure><img src="./img/plus.svg" alt="plus"></figure>
                    </div>
                </div>
            </div>
        </li>
    `);

    paymentItemsContainer.insertAdjacentHTML('beforeend', `
        <li data-cart-key="${key}">
            <div class="name">${product.pname}</div>
            <div class="price">${formatCartPrice(product.priceDiscount * quantity)}원</div>
        </li>
    `);
}

function renderRequestedCartProduct() {
    if (!cartItemsContainer || !paymentItemsContainer) return;

    cartItemsContainer.innerHTML = '';
    paymentItemsContainer.innerHTML = '';

    if (!cartProduct) {
        cartItemsContainer.innerHTML = '<li class="empty-cart">장바구니에 담긴 상품이 없습니다.</li>';
        return;
    }

    addCartProduct(cartProduct, requestedOptionIndex, requestedQuantity);
}

renderRequestedCartProduct();

const checkAll = document.querySelector('.list-header input[type="checkbox"]');

function currentCartItems() {
    return [...document.querySelectorAll('.cart-list')];
}

function updateOrderLink() {
    if (!orderLink) return;

    const item = currentCartItems().find((cartItem) => cartItem.querySelector('input[type="checkbox"]')?.checked);
    if (!item) {
        orderLink.href = '#';
        return;
    }

    const params = new URLSearchParams({
        pid: item.dataset.pid,
        option: item.dataset.option,
        qty: item.querySelector('.counter span').textContent,
    });
    orderLink.href = `./process-final.html?${params.toString()}`;
}

function totalCal() {
    let total = 0;

    currentCartItems().forEach((item) => {
        const checkbox = item.querySelector('input[type="checkbox"]');
        const unitPrice = Number(item.querySelector('.price-sale-price').dataset.unitPrice);
        const count = Number(item.querySelector('.counter span').textContent);
        const productTotal = unitPrice * count;
        const summaryPrice = document.querySelector(`.product-info li[data-cart-key="${item.dataset.cartKey}"] .price`);

        if (!checkbox || checkbox.checked) {
            total += productTotal;
            if (summaryPrice) summaryPrice.textContent = `${formatCartPrice(productTotal)}원`;
        } else if (summaryPrice) {
            summaryPrice.textContent = '0원';
        }
    });

    const totalGuide = document.querySelector('.total-price');
    if (totalGuide) totalGuide.textContent = `${formatCartPrice(total)}원`;
    updateOrderLink();
}

if (checkAll) {
    checkAll.addEventListener('change', () => {
        currentCartItems().forEach((item) => {
            item.querySelector('input[type="checkbox"]').checked = checkAll.checked;
        });
        totalCal();
    });
}

document.addEventListener('change', (event) => {
    if (!event.target.matches('.cart-list input[type="checkbox"]')) return;
    const items = currentCartItems();
    if (checkAll) checkAll.checked = items.length > 0 && items.every((item) => item.querySelector('input').checked);
    totalCal();
});

document.addEventListener('romand:add-to-cart', (event) => {
    const product = cartProducts.find((item) => item.pid === Number(event.detail?.pid));
    if (!product) return;

    addCartProduct(product, Number(event.detail?.option) || 0, Number(event.detail?.quantity) || 1);
    if (checkAll) {
        const items = currentCartItems();
        checkAll.checked = items.length > 0 && items.every((item) => item.querySelector('input').checked);
    }
    totalCal();
});

document.addEventListener('click', (event) => {
    const closeButton = event.target.closest('.close-btn');
    const plusButton = event.target.closest('.counter img[alt="plus"]');
    const minusButton = event.target.closest('.counter img[alt="minus"]');

    if (closeButton) {
        const cartItem = closeButton.closest('.cart-list');
        document.querySelector(`.product-info li[data-cart-key="${cartItem.dataset.cartKey}"]`)?.remove();
        cartItem.remove();
        totalCal();
        return;
    }

    const control = plusButton || minusButton;
    if (!control) return;

    const cartItem = control.closest('.cart-list');
    const countElement = cartItem.querySelector('.counter span');
    const nextCount = Number(countElement.textContent) + (plusButton ? 1 : -1);

    if (nextCount < 1) {
        document.querySelector(`.product-info li[data-cart-key="${cartItem.dataset.cartKey}"]`)?.remove();
        cartItem.remove();
    } else {
        countElement.textContent = nextCount;
    }

    totalCal();
});

totalCal();
