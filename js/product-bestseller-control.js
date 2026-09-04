// 전역에서 사용할 수 있도록 노출 (비모듈 환경용)
if (typeof window !== 'undefined') window.formatNumberWithCommas = formatNumberWithCommas;

const productCardUlTag = document.querySelector('.product-card');

if (productCardUlTag) {
    const result = productArray.map((product, index) => `
        <li class="product-card-list">
            <a href="#" class="product-visual">
                <span class="rank">${index + 1}</span>
                <div>
                    <img class="product-img" src="./img/${product.plipImgName}" alt="제품 이미지">
                    <img class="product-img-model" src="./img/${product.plipModelName}" alt="제품 모델 이미지">
                </div>
            </a>
            <div class="product-txt">
                <h2 class="product-name">${product.pname}</h2>
                <p class="price-original"><span>${formatNumberWithCommas(product.price)}</span>원</p>
                <div class="discount-txt">
                    <p class="discount">${Math.round(product.pdiscount * 100)}%</p>
                    <p class="price-discount"><span>${formatNumberWithCommas(product.priceDiscount)}</span>원</p>
                </div>
            </div>
            <div class="color-chip">
                <div class="color-scroll" aria-label="${product.pname} 전체 컬러">
                    ${(product.pcolors ?? []).map((color, colorIndex) => `
                        <button
                            type="button"
                            class="color-dot ${colorIndex >= 5 ? 'extra-color' : ''}"
                            style="--chip-color: ${color};"
                            aria-label="${colorIndex + 1}번 컬러"
                        ></button>
                    `).join('')}

                    ${(product.pcolors ?? []).length > 5 ? `
                        <button
                            type="button"
                            class="color-more"
                            aria-expanded="false"
                        >+${product.pcolors.length - 5}Color</button>
                                                                                                            
                        <button
                            type="button"
                            class="color-close"
                            aria-label="전체 컬러 접기"
                        >−</button>
                    ` : ''}
                </div>
            </div>
            <div class="badges">
                <span class="badge best ${product.badgeBest}">BEST</span>
                <span class="badge new ${product.badgeNew}">NEW</span>
            </div>
        </li>
    `).join('');
    productCardUlTag.innerHTML = result;

    // 각 상품의 +Color/− 버튼을 감지해 컬러칩을 펼치거나 초기 상태로 되돌림
    productCardUlTag.addEventListener('click', (event) => {
        const moreButton = event.target.closest('.color-more');
        const closeButton = event.target.closest('.color-close');

        if (!moreButton && !closeButton) return;

        const colorChip = event.target.closest('.color-chip');
        const colorScroll = colorChip.querySelector('.color-scroll');

        if (moreButton) {
            colorChip.classList.add('is-open');
            moreButton.setAttribute('aria-expanded', 'true');
        }

        if (closeButton) {
            colorChip.classList.remove('is-open');

            const openButton = colorChip.querySelector('.color-more');

            if (openButton) {
                openButton.setAttribute('aria-expanded', 'false');
            }

            // 접을 때 가로 스크롤 위치도 첫 번째 컬러로 복구
            colorScroll.scrollTo({
                left: 0,
                behavior: 'smooth',
            });
        }
    });

    // 펼친 164px 컬러칩 영역을 마우스 또는 터치로 좌우 드래그하면 가로 스크롤
    productCardUlTag.querySelectorAll('.color-scroll').forEach((colorScroll) => {
        let isDragging = false;
        let activePointerId = null;
        let dragStartX = 0;
        let scrollStartLeft = 0;

        colorScroll.addEventListener('pointerdown', (event) => {
            const colorChip = colorScroll.closest('.color-chip');
            const controlButton = event.target.closest('.color-more, .color-close');

            // 펼친 상태에서만 드래그하고 +Color/− 버튼 클릭은 그대로 동작시킴
            if (!colorChip.classList.contains('is-open') || controlButton) return;
            if (event.pointerType === 'mouse' && event.button !== 0) return;

            isDragging = true;
            activePointerId = event.pointerId;
            dragStartX = event.clientX;
            scrollStartLeft = colorScroll.scrollLeft;

            colorScroll.classList.add('is-dragging');
            colorScroll.setPointerCapture(activePointerId);

            // 드래그할 때 버튼이나 텍스트가 선택되어 딸려오는 브라우저 기본 동작 방지
            event.preventDefault();
        });

        colorScroll.addEventListener('pointermove', (event) => {
            if (!isDragging || event.pointerId !== activePointerId) return;

            const movedDistance = event.clientX - dragStartX;
            colorScroll.scrollLeft = scrollStartLeft - movedDistance;
            event.preventDefault();
        });

        const stopDragging = (event) => {
            if (!isDragging || event.pointerId !== activePointerId) return;

            isDragging = false;
            colorScroll.classList.remove('is-dragging');

            if (colorScroll.hasPointerCapture(activePointerId)) {
                colorScroll.releasePointerCapture(activePointerId);
            }

            activePointerId = null;
        };

        colorScroll.addEventListener('pointerup', stopDragging);
        colorScroll.addEventListener('pointercancel', stopDragging);

        colorScroll.addEventListener('lostpointercapture', () => {
            isDragging = false;
            activePointerId = null;
            colorScroll.classList.remove('is-dragging');
        });

        //  컬러칩 요소 자체가 반투명 이미지처럼 끌려오는 native drag 동작 방지
        colorScroll.addEventListener('dragstart', (event) => {
            event.preventDefault();
        });
    });
}

// 숫자 세 자리마다 콤마를 찍어주는 헬퍼 함수
function formatNumberWithCommas(value, locale = 'ko-KR') {
    if (value === null || value === undefined) return '';
    const num = Number(value);
    if (Number.isNaN(num)) return String(value);
    return num.toLocaleString(locale);
}

if (typeof window !== 'undefined') {
    window.formatNumberWithCommas = formatNumberWithCommas;
}
