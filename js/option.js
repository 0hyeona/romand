// 옵션 선택 영역 전체
const optionBox = document.querySelector('.option-box');
// 옵션 목록을 열고 닫는 버튼
const trigger = optionBox.querySelector('.option-trigger');

// 선택 가능한 모든 옵션
const optionItems = optionBox.querySelectorAll('.option-item');

// 선택된 옵션 이름 보여주는 영역 가져옴
const optionValue = optionBox.querySelector('.option-value');

// 선택 색상을 보여주는 요소를 가져옴
const triggerColor = optionBox.querySelector('.option-trigger .option-color');

// 상품명 정보들
const productName = optionBox.querySelector('.pro-name p');
const productDesc = optionBox.querySelector('.pro-desc p');

// 옵션 버튼 클릭했을 때
trigger.addEventListener('click', function () {
    optionBox.classList.toggle('is-open');
    // 3단계 필요 없어서 제거
    optionBox.classList.remove('stage-3');
    // 2단계 필요해서 추가
    optionBox.classList.add('stage-2');
});


// 모든 옵션 항목에 클릭 이벤트 등록 - 2단계 진행
optionItems.forEach(function (item) {
    item.addEventListener('click', function () {
        // 1. 모든 옵션에서 선택 표시 제거
        optionItems.forEach(function (el) {
            el.classList.remove('is-selected');
        });

        // 2. 클릭한 옵션에만 선택 표시
        item.classList.add('is-selected');

        // html 버튼 태그 안에 data-name이 있거나 없으면 텍스트 가져와 공백을 제거
        const selectedText = item.dataset.name || item.textContent.trim();
        // 클릭한 색상 정보를 저장함
        const selectedColor = item.querySelector('.option-color');

        // 선택된 옵션 이름을 버튼/표시 영역에 표시함
        optionValue.textContent = selectedText;

        if (selectedColor && triggerColor) {
            triggerColor.className = selectedColor.className;
        }

        // 옵션 선택 시 요약 영역을 다시 보이게 처리
        cnt = 1;
        updateCnt();
        counterBox.style.display = 'flex';

        optionBox.classList.remove('is-open');
        optionBox.classList.remove('stage-2');
        optionBox.classList.add('stage-3');

        if (productName) {
            productName.textContent = selectedText;
        }

        if (productDesc) {
            productDesc.textContent = selectedText;
        }
    });
});

// 마이너스 / 플러스 눌렀을 때 동작 기능 구현
const minusBtn = document.querySelector('.counter img[alt="minus"]');
const plusBtn = document.querySelector('.counter img[alt="plus"]');
const desc = document.querySelector('.counter span');
const counterBox = document.querySelector('.option-summary');
const money = document.querySelector('.money');
const totalAmount = document.querySelector('.purchase-summary p:last-child');

const unitPrice = 9400;
let cnt = 1;

function updateCnt() {
    desc.textContent = cnt;

    if (cnt <= 0) {
        cnt = 0;
        desc.textContent = 0;
        counterBox.style.display = 'none';
    } else {
        counterBox.style.display = 'flex';
    }

    const totalPrice = unitPrice * cnt;
    money.textContent = totalPrice.toLocaleString();
    totalAmount.textContent = totalPrice.toLocaleString() + '원';
}

minusBtn.addEventListener('click', function () {
    if (cnt > 0) {
        cnt -= 1;
    }
    updateCnt();
});

plusBtn.addEventListener('click', function () {
    cnt += 1;
    updateCnt();
});

// 옵션 선택 후 리스트 닫기 보장
optionItems.forEach(function (item) {
    item.addEventListener('click', function () {
        optionBox.classList.remove('is-open');
        optionBox.classList.remove('stage-2');
        optionBox.classList.add('stage-3');
    });
});


//  기능 추가해야될 것
// 2번에서 밖에 누르거나 아이콘을 눌렀을 시 1번으로 변경되도록
// 외부 클릭 시 선택 초기화
// 외부 클릭 시 옵션창 닫기 (선택된 상태는 유지)
document.addEventListener('click', function (e) {

    // 클릭한 곳이 옵션박스 안이면 아무것도 안 함
    if (optionBox.contains(e.target)) return;

    // 옵션이 열려있을 때만 닫기
    if (optionBox.classList.contains('is-open')) {
        optionBox.classList.remove('is-open');
        optionBox.classList.remove('stage-2');
    }

});