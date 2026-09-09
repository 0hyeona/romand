const popup = document.querySelector('.popup');
const modal = document.querySelector('.modal');
const popupClose = document.querySelector('.popup-close');

const lockBodyScroll = () => {
  document.body.style.overflow = 'hidden';
};

const unlockBodyScroll = () => {
  document.body.style.overflow = '';
};

if (popup && modal && !popup.classList.contains('off') && !modal.classList.contains('off')) {
  lockBodyScroll();
}

if (popupClose) {
  popupClose.addEventListener('click', () => {
    popup.classList.add('off');
    modal.classList.add('off');
    unlockBodyScroll();
  });
}