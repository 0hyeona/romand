const saleUlTag = document.querySelector('.sale');
let result = productArray.map(product => {
    return `<li>
                <a href="#">
                <figure><img src="./img/${product.pthumbFileName}" alt="${product.pname}"></figure>
                <div class="sale-txt">
                    <h4 class="title-1">${product.pname}</h4>
                    <p class="desc-1">${product.pdesc}</p>
                    <div class="pay-frame">
                        <div class="pay-original">
                            <span>${formatNumberWithCommas(product.price)}</span>원
                        </div>
                        <div class="pay-discount">
                            <div class="discount">${Math.round(product.pdiscount * 100)}%</div>
                            <div class="pay"><b>${formatNumberWithCommas(product.priceDiscount)}</b>원</div>
                        </div>
                    </div>
                    <span class="like-badge noab">
                        <img src="./img/heart-2.svg" alt="좋아요하트">
                        <p>${product.plike}</p>
                    </span>
                </div>
                </a>
            </li>`
}).join('')

saleUlTag.innerHTML = result

// 숫자 세 자리마다 콤마를 찍어주는 헬퍼 함수
function formatNumberWithCommas(value, locale = 'ko-KR') {
    if (value === null || value === undefined) return '';
    const num = Number(value);
    if (Number.isNaN(num)) return String(value);
    return num.toLocaleString(locale);
}

// 전역에서 사용할 수 있도록 노출 (비모듈 환경용)
if (typeof window !== 'undefined') window.formatNumberWithCommas = formatNumberWithCommas;