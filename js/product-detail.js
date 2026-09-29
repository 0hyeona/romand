// 목록에서 전달한 pid로 상품을 찾아 상세 페이지의 고정 내용을 교체한다.
(function () {
    const products = window.productArray ?? [];
    const params = new URLSearchParams(window.location.search);
    const requestedPid = Number(params.get('pid'));
    const product = products.find((item) => item.pid === requestedPid) ?? products[0];

    if (!product) return;

    window.currentProduct = product;

    const formatPrice = (value) => Number(value).toLocaleString('ko-KR');
    const setText = (selector, value) => {
        const element = document.querySelector(selector);
        if (element) element.textContent = value;
    };

    document.title = `${product.pname} | rom&nd`;
    setText('.product-header .product-title-wrap > p', product.pname);
    setText('.product-header .original-price', `${formatPrice(product.price)}원`);
    setText('.product-header .discount-rate', `${Math.round(product.pdiscount * 100)}%`);
    setText('.product-header .final-price', `${formatPrice(product.priceDiscount)}원`);
    setText('.option-summary .money', formatPrice(product.priceDiscount));

    const galleryImages = [product.plipImgName, product.plipModelName].filter(Boolean);
    const mainImage = document.querySelector('.product-gallery .big-img img');
    const thumbnailList = document.querySelector('.product-gallery .small-img-list');

    if (mainImage && galleryImages.length) {
        mainImage.src = `./img/${galleryImages[0]}`;
        mainImage.alt = `${product.pname} 메인 이미지`;
    }

    if (thumbnailList) {
        thumbnailList.innerHTML = galleryImages.map((imageName, index) => `
            <li>
                <button type="button" class="detail-thumbnail" aria-label="${index + 1}번 상품 이미지 보기">
                    <img src="./img/${imageName}" alt="${product.pname} 썸네일 ${index + 1}">
                </button>
            </li>
        `).join('');

        thumbnailList.addEventListener('click', (event) => {
            const thumbnail = event.target.closest('.detail-thumbnail img');
            if (!thumbnail || !mainImage) return;
            mainImage.src = thumbnail.src;
            mainImage.alt = thumbnail.alt.replace('썸네일', '상품 이미지');
        });
    }

    const optionList = document.querySelector('.option-box .option-list');
    const colors = product.pcolors?.length ? product.pcolors : ['#dddddd'];

    if (optionList) {
        optionList.innerHTML = colors.map((color, index) => {
            const optionName = colors.length === 1 && !product.pcolors?.length
                ? '단일 상품'
                : `${String(index + 1).padStart(2, '0')} 컬러`;

            return `
                <button type="button" class="option-item" data-name="${optionName}">
                    <span class="option-color" style="background-color: ${color}"></span>
                    ${optionName}
                </button>
            `;
        }).join('');
    }
})();
