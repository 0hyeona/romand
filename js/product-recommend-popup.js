// 수정: 스타일/크기 계산/기본 HTML 속성 설정을 제거하고 동작만 담당합니다.
(() => {
    const popup = document.querySelector('.recommend-popup');
    if (!popup) return;
    const modal = document.querySelector('.recommend-modal');
    const select = popup.querySelector('.select-option');
    const toggle = popup.querySelector('.option-toggle');
    const list = popup.querySelector('.option-list');
    const selected = popup.querySelector('.selected-option');
    const close = popup.querySelector('.popup-close');
    const cart = popup.querySelector('.incart');
    const options = [...list.querySelectorAll('li')];
    // 수정: 첫 번째 상품의 pcolors에서 옵션 순서대로 기존 span에 색상 데이터 연결
    const optionColors = typeof productArray !== 'undefined' ? productArray[0]?.pcolors ?? [] : [];
    options.forEach((option, index) => {
        const chip = option.querySelector('.option-color');
        if (chip && optionColors[index]) {
            chip.style.setProperty('--option-chip-color', optionColors[index]);
        }
    });
    let opener = null;
    // 수정: 다시 열 때 복원할 기본 안내 문구 저장
    const placeholder = selected.textContent;

    // 수정: 표시 상태만 변경합니다. 목록 공간 유지와 회전 효과는 CSS에서 처리합니다.
    function setOpen(open) {
        list.hidden = !open;
        toggle.setAttribute('aria-expanded', String(open));
    }
    // 수정: 팝업과 모달의 on 클래스를 함께 제거하여 닫습니다.
    function closePopup() {
        setOpen(false);
        popup.classList.remove('on');
        if (modal) modal.classList.remove('on');
        if (opener?.isConnected) opener.focus();
    }
    // 수정: 매번 선택 문구·색상·선택 상태·스크롤을 초기화한 뒤 on 클래스로 표시
    function openPopup(trigger) {
        opener = trigger;
        // 수정: 안내 문구로 교체하면서 선택했던 상단 컬러칩도 제거
        selected.textContent = placeholder;
        select.classList.remove('has-selection');
        options.forEach(option => option.setAttribute('aria-selected', 'false'));
        popup.classList.add('on');
        if (modal) modal.classList.add('on');
        setOpen(false);
        list.scrollTop = 0;
        toggle.focus();
    }
    // 수정: 기본 속성은 HTML에 두고 클릭/키보드 이벤트만 연결합니다.
    function bindButton(element, action) {
        element.addEventListener('click', action);
        element.addEventListener('keydown', event => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault(); action();
            }
        });
    }
    bindButton(toggle, () => setOpen(list.hidden));
    bindButton(close, closePopup);
    // 수정: 담기 버튼은 색상 변경이나 비활성화 없이 팝업을 닫습니다.
    bindButton(cart, closePopup);
    options.forEach(option => {
        bindButton(option, () => {
            selected.textContent = option.textContent.trim();
            // 수정: 선택한 li의 컬러칩을 복제하여 상단 옵션 텍스트 왼쪽에 표시
            const sourceChip = option.querySelector('.option-color');
            if (sourceChip) {
                const selectedChip = sourceChip.cloneNode(true);
                selectedChip.setAttribute('aria-hidden', 'true');
                selected.prepend(selectedChip);
            }
            // 수정: 선택한 문구의 검정색 표시는 CSS 상태 클래스로 처리
            select.classList.add('has-selection');
            options.forEach(item => item.setAttribute('aria-selected', String(item === option)));
            setOpen(false);
            toggle.focus();
        });
    });
    // 기존 추천상품 스크립트가 생성한 담기 버튼으로 다시 열기
    document.addEventListener('click', event => {
        const trigger = event.target.closest('[id="popup-open"]');
        if (trigger) {
            event.preventDefault(); openPopup(trigger);
        } else if (!select.contains(event.target)) {
            setOpen(false);
        }
    });
    // 동적으로 생성되는 카드의 속성은 해당 HTML 생성 템플릿에서 선언합니다.
    document.addEventListener('keydown', event => {
        const trigger = event.target.closest('[id="popup-open"]');
        if (trigger && (event.key === 'Enter' || event.key === ' ')) {
            event.preventDefault(); openPopup(trigger); return;
        }
        if (event.key !== 'Escape' || !popup.classList.contains('on')) return;
        if (!list.hidden) { setOpen(false); toggle.focus(); }
        else closePopup();
    });
})();
