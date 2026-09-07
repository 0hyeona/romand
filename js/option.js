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
// 1. 중복으로 선택한다면 여러 개 배열로 저장해서 담는 변수를 하나 만들 것