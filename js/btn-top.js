const btnTop = document.querySelector('.btn-top');

if (btnTop) {
    btnTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    window.addEventListener('scroll', () => {
        if (window.scrollY > 200) {
            btnTop.classList.add('on');
        } else {
            btnTop.classList.remove('on');
        }
    });
}