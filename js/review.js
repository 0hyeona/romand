// 슬라이더
const reviewSliderWraps =
    document.querySelectorAll('.review-slider-wrap');

reviewSliderWraps.forEach((sliderWrap) => {
    // 현재 반복 중인 슬라이드 안에서만 요소를 찾음
    const train =
        sliderWrap.querySelector('.slider-train');

    const sliderButtonPrev =
        sliderWrap.querySelector('.slider-button.prev');

    const sliderButtonNext =
        sliderWrap.querySelector('.slider-button.next');

    const paginationDots =
        sliderWrap.querySelectorAll('.review-pagination img');

    let count = 0;

    /* 현재 count와 같은 도트만 on 이미지로 표시하고 나머지는 off 이미지로 변경 */
    function updatePagination() {
        paginationDots.forEach((dot, index) => {
            if (index === count) {
                dot.src = './img/review-dot-on.svg';
            } else {
                dot.src = './img/review-dot-off.svg';
            }
        });
    }

    function moveSlide() {
        // CSS의 2rem을 브라우저가 계산한 px 값으로 가져옴
        const gap = parseFloat(getComputedStyle(train).gap);

        // train이 300%이므로 페이지마다 gap의 1/3만큼 추가 보정
        const gapCorrection = (gap / 3) * count;

        train.style.transform =
            `translateX(calc(${-33.3333 * count}% - ${gapCorrection}px))`;

        updatePagination();
    }
    /* 다음 버튼을 누르면 다음 리뷰 두 장을 표시하고 마지막 다음에는 처음으로 돌아감 */
    sliderButtonNext.addEventListener('click', (event) => {
        event.preventDefault();

        count++;

        if (count > 2) {
            count = 0;
        }

        moveSlide();
    });

    /* 이전 버튼을 누르면 이전 리뷰 두 장을 표시하고 처음 이전에는 마지막으로 이동 */
    sliderButtonPrev.addEventListener('click', (event) => {
        event.preventDefault();

        count--;

        if (count < 0) {
            count = 2;
        }

        moveSlide();;
    });
});

// 팝업 열기,닫기
const popup = document.querySelector('.popup');
const modal = document.querySelector('.modal');
const popupOpen = document.querySelectorAll('.popup-open');
const popupClose = document.querySelector('.popup-close');
const lockBodyScroll = () => {
    document.body.style.overflow = 'hidden';
};

const unlockBodyScroll = () => {
    document.body.style.overflow = '';
};

popupOpen.forEach((openButton) => {
    openButton.addEventListener('click', () => {
        popup.classList.add('on');
        popup.scrollTop = 0;
        lockBodyScroll();
    });
});
popupClose.addEventListener('click', () => {
    popup.classList.remove('on');
    unlockBodyScroll();
});