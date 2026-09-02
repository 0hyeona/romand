let lastScrollTop = 0;

window.addEventListener('scroll', () => {
    let ScrollTop = window.pageYOffset;
    if (ScrollTop < lastScrollTop) {
        btnTop.classList.add('on');
    } else {
        btnTop.classList.remove('on');
    }
    lastScrollTop = ScrollTop;
});


const btnTop = document.querySelector('.btn-top');
btnTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}) 