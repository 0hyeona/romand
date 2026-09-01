// 슬라이드 영역 
const station = new Swiper('.hero-slider', {
    // 반복
    loop: true,

    pagination: {
        el: '.swiper-pagination',
        clickable: true,
        type: 'bullets',
    },

    autoplay: {
        delay: 5000,
    },

    speed: 1000
});
