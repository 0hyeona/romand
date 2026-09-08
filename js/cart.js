// 전체선택 체크박스
const checkAll = document.querySelector('.list-header input[type="checkbox"]');

// 개별 상품 체크박스들
const checkItems = document.querySelectorAll('.cart-list input[type="checkbox"]');

// 전체선택 클릭 시
// checkbox 상태값: checked
checkAll.addEventListener('change', () => {
    checkItems.forEach(item => {
        // checked 속성 : html 체크박스 요소가 선택됐는지 아닌지 불린값으로 나타나는 속성
        item.checked = checkAll.checked;
        // checkAll이 true면 전부 true, false면 전부 false
    });
    totalCal();
});

// 개별 체크박스 클릭 시 → 전체선택 상태 업데이트
checkItems.forEach(item => {
    // change 이벤트 : 선택/입력이 끝났을 때 변경되는 이벤트 
    item.addEventListener('change', () => {

        // 클로드가 짜준 코드
        // 모든 개별 체크박스가 체크됐는지 확인 : every 함수
        // const allChecked = [...checkItems].every(item => item.checked);
        // 하나라도 체크 해제되면 전체선택도 해제
        // checkAll.checked = allChecked;

        let allChecked = true;

        for (let i = 0; i < checkItems.length; i++) {
            // 하나라도 체크 안 됨 
            if (checkItems[i].checked === false) {
                allChecked = false;
                break;
            }
        }
        checkAll.checked = allChecked;
        totalCal();
    });
});

// close 아이콘 누르면 상품 리스트 정보 삭제 
const closeIcon = document.querySelectorAll('.close-btn');


closeIcon.forEach(btn => {
    btn.addEventListener('click', function () {
        // 버튼 기준 3단계 위의 부모 요소를 찾아 통째로 삭제
        // this.parentElement.parentElement.parentElement.remove();

        // 삭제할 왼쪽 상품
        const cartItem = this.closest('.cart-list');

        // 삭제할 상품 이름
        const productName =
            cartItem.querySelector('.product-name').textContent.trim();

        // 오른쪽 결제 상품
        const rightList =
            document.querySelectorAll('.product-info li');

        // 오른쪽 상품 중 같은 이름 찾기
        for (let i = 0; i < rightList.length; i++) {

            const rightName =
                rightList[i].querySelector('.name').textContent.trim();

            if (rightName === productName) {
                rightList[i].remove();
                break;
            }
        }

        // 왼쪽 상품 삭제
        cartItem.remove();

        // 총 금액 다시 계산
        totalCal();
    });
});


// 카운터
const minusBtn = document.querySelectorAll('.counter img[alt="minus"]');
const plusBtn = document.querySelectorAll('.counter img[alt="plus"]');
const desc = document.querySelectorAll('.counter span');

// 가격 정보 counter 반영
const pricetotal = document.querySelectorAll('.price');

// 우측 상품 정보
const rightInfo = document.querySelectorAll('.product-info li');

// 총 가격 
const totalGuide = document.querySelector('.total-price');

// 금액 계산 함수 
function updatePrice(change, btn) {
    // 함수 매개변수는 예약어를 작성할 수 없다 - this로 받는 매개변수 이름을 btn으로 설정

    // 이렇게 작성하면 상품 삭제 후 i의 상품이 현재 상품과 달라질 수 있기 때문에 수정 
    // 클릭한 버튼이 들어있는 상품 찾기
    const cartItem = btn.closest('.cart-list');

    // 현재 상품의 수량
    const currentSpanTag =
        Number(cartItem.querySelector('.counter span').textContent);

    // 현재 상품의 가격
    const priceTag =
        cartItem.querySelector('.price-sale-price');

    const rawPriceText = priceTag.textContent;

    // 숫자만 추출
    const currentTotal =
        Number(rawPriceText.replace(/[^0-9]/g, ''));

    // 1개당 가격
    const unitPrice =
        currentTotal / currentSpanTag;

    // 새로운 수량
    const newCount =
        currentSpanTag + change;


    if (newCount >= 1) {

        // 수량 변경
        cartItem.querySelector('.counter span').textContent =
            newCount;

        // 가격 변경
        totalCal();

    }

    else {
        // 삭제할 상품 이름
        const productName =
            cartItem.querySelector('.product-name').textContent.trim();

        // 오른쪽 결제 상품
        const rightList =
            document.querySelectorAll('.product-info li');

        // 오른쪽 상품 중 같은 이름 찾기
        for (let i = 0; i < rightList.length; i++) {

            const rightName =
                rightList[i].querySelector('.name').textContent.trim();

            if (rightName === productName) {
                rightList[i].remove();
                break;
            }
        }

        // 왼쪽 상품 삭제
        cartItem.remove();

        // 총 금액 다시 계산
        totalCal();
    }

    // let currentSpanTag = Number(desc[i].textContent);

    // // 1. (현재 화면 금액 / 현재 수량)으로 1개당 단가 구하기
    // // 문자열로된 금액 정보 변수로 불러오기
    // let rawPriceText = pricetotal[i].textContent;
    // // 숫자가 아닌 모든 문자 제거 (원, 쉼표, 공백 등)
    // let currentTotal = Number(rawPriceText.replace(/[^0-9]/g, ''));
    // // 1개당 가격
    // let unitPrice = currentTotal / currentSpanTag;

    // // 2. 수량 1 증가 / 감소
    // let newCount = currentSpanTag + change;
    // if (newCount >= 1) {
    //     desc[i].textContent = newCount;
    //     // 3. 단가 * 새로 바뀐 수량
    //     let totalPrice = unitPrice * newCount;
    //     pricetotal[i].textContent = totalPrice.toLocaleString() + '원';
    //     totalCal()
    // }

    // else if (newCount <= 0) {
    //     btn.closest('.cart-list').remove();

    //     // 우측 상품 정보 
    //     if (rightInfo[i]) {
    //         rightInfo[i].remove();
    //         totalCal();
    //         return;
    //     }
    // }
}

// 총 금액 계산 함수
function totalCal() {
    let total = 0;

    // 현재 존재하는 .cart-list 카드들 실시간 탐색
    const currentList = document.querySelectorAll('.cart-list');

    currentList.forEach(item => {
        // 체크박스가 있는 경우 체크된 상품만 계산하도록 세팅 (필요 시 유지)
        const checkbox = item.querySelector('input[type="checkbox"]');

        // 할인된 상품 1개의 가격
        let priceText = item.querySelector('.price-sale-price').textContent;
        let priceNum = Number(priceText.replace(/[^0-9]/g, ''));

        // 현재 상품의 수량
        let count = Number(item.querySelector('.counter span').textContent);

        // 할인 가격 × 수량
        let productTotal = priceNum * count;


        if (!checkbox || checkbox.checked) {
            total += productTotal;
        }
    });

    const rightPrices = document.querySelectorAll('.product-info li .price');

    currentList.forEach((item, idx) => {
        const checkbox = item.querySelector('input[type="checkbox"]');
        // 할인된 상품 1개의 가격
        const priceText = item.querySelector('.price-sale-price').textContent;
        const priceNum = Number(priceText.replace(/[^0-9]/g, ''));

        // 현재 상품의 수량
        const count = Number(item.querySelector('.counter span').textContent);

        // 할인 가격 × 수량
        const productTotal = priceNum * count;

        if (rightPrices[idx]) {
            if (checkbox && checkbox.checked) {
                rightPrices[idx].textContent =
                    productTotal.toLocaleString() + '원';
            } else {
                rightPrices[idx].textContent = '0원';
            }
        }
    });
    const totalGuide = document.querySelector('.total-price');

    if (totalGuide) {
        totalGuide.textContent =
            total.toLocaleString() + '원';
    }

}

// 초기 실행
totalCal();

// plus 클릭했을 때
plusBtn.forEach((count) => {
    count.addEventListener('click', function () {
        updatePrice(1, this);
    })
})

// minus 클릭했을 때
minusBtn.forEach((count) => {
    count.addEventListener('click', function () {
        // 자바 (오버로딩)이 아님
        // 자바스크립트에서는 클릭된 html 태그 가져옴
        // 자바스크립트에서는 function으로 썼을 때 html 태그를 가리킴
        // function 사용 안하고 화살표 함수 및 익명함수로 작성될 시 window 객체를 가리킴
        // 그래서 여기서 this를 사용해 함수에서 가자아 가까운 cart-list 클래스를 제거하는 로직으로 활용됨
        updatePrice(-1, this);
    })
})