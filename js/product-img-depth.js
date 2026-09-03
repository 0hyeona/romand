const imgDepth = document.querySelector('.img-depth');
let isDragging = false; //드래그 시작안함
let startX = 0; //시작 마우스 위치
let startScrollLeft = 0; //드래그 전 가로 스크롤 위치
let hasMoved = false; //움직임 표시

imgDepth.addEventListener('dragstart', (event) => {
    event.preventDefault();
});

imgDepth.addEventListener('pointerdown', (event) => {
    isDragging = true;
    hasMoved = false;
    startX = event.clientX;
    startScrollLeft = imgDepth.scrollLeft;
    imgDepth.classList.add('dragging');
    imgDepth.setPointerCapture(event.pointerId);
});

imgDepth.addEventListener('pointermove', (event) => {
    if (!isDragging) return;

    const moveDistance = event.clientX - startX;
    if (Math.abs(moveDistance) > 5) hasMoved = true;
    imgDepth.scrollLeft = startScrollLeft - moveDistance;
});

function stopDragging(event) {
    if (!isDragging) return;

    isDragging = false;
    imgDepth.classList.remove('dragging');
    imgDepth.releasePointerCapture(event.pointerId);
}

imgDepth.addEventListener('pointerup', stopDragging);
imgDepth.addEventListener('pointercancel', stopDragging);

imgDepth.addEventListener('click', (event) => {
    if (!hasMoved) return;

    event.preventDefault();
    event.stopPropagation();
    hasMoved = false;
}, true);
