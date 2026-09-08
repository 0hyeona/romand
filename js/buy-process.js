document.addEventListener('DOMContentLoaded', () => {

    const wrap = document.querySelector('.small-img-wrap');
    if (!wrap) return;

    let isDown = false;   // 마우스 누르고 있는지
    let startX;           // 클릭 시작 X 좌표
    let scrollLeft;       // 클릭 시작 시 스크롤 위치

    // 마우스 누를 때
    wrap.addEventListener('mousedown', (e) => {
        isDown = true;
        wrap.style.cursor = 'grabbing';
        startX = e.pageX - wrap.offsetLeft;
        scrollLeft = wrap.scrollLeft;
    });

    // 마우스 뗄 때
    wrap.addEventListener('mouseup', () => {
        isDown = false;
        wrap.style.cursor = 'grab';
    });

    // 마우스가 영역 벗어날 때
    wrap.addEventListener('mouseleave', () => {
        isDown = false;
        wrap.style.cursor = 'grab';
    });

    // 마우스 이동할 때
    wrap.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault(); // 이미지 드래그 방지
        const x = e.pageX - wrap.offsetLeft;
        const walk = (x - startX) * 1.5; // 1.5 = 스크롤 속도
        wrap.scrollLeft = scrollLeft - walk;
    });

});