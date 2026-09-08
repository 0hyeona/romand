// 전체선택 체크박스
const checkAll = document.querySelector('.list-header input[type="checkbox"]');

// 개별 상품 체크박스들
const checkItems = document.querySelectorAll('.cart-list input[type="checkbox"]');

// 전체선택 클릭 시
checkAll.addEventListener('change', () => {
    checkItems.forEach(item => {
        // checked 속성 : html 체크박스 요소가 선택됐는지 아닌지 불린값으로 나타나는 속성
        item.checked = checkAll.checked;
        // checkAll이 true면 전부 true, false면 전부 false
    });
});

// 개별 체크박스 클릭 시 → 전체선택 상태 업데이트
checkItems.forEach(item => {
    item.addEventListener('change', () => {
        
        // 모든 개별 체크박스가 체크됐는지 확인
        const allChecked = [...checkItems].every(item => item.checked);
        
        // 하나라도 체크 해제되면 전체선택도 해제
        checkAll.checked = allChecked;
    });
});