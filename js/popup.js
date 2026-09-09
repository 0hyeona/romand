const popup = document.querySelector('.popup');
const modal = document.querySelector('.modal');

const popupClose = document.querySelector('.popup-close');
const popupTodayClose = document.querySelector('.popup-today-close');

// 팝업 뒤쪽 스크롤 막기 - 팝업 생성 시
const lockBodyScroll = () => {
  document.body.style.overflow = 'hidden';
};

// 팝업 뒤쪽 스크롤 해제 - 팝업 없어졌을 시 
const unlockBodyScroll = () => {
  document.body.style.overflow = '';
};

// 오늘 날짜
const today = new Date();
const todayDate = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;

// 저장된 날짜
const hideDate = localStorage.getItem('hideDate');


// 오늘 하루 보지않기를 누른 적이 없을 때만 팝업 보여주기
if (
  popup &&
  modal &&
  hideDate !== todayDate &&
  !popup.classList.contains('off') &&
  !modal.classList.contains('off')
) {
  lockBodyScroll();
}


// 그냥 닫기
if (popupClose) {
  popupClose.addEventListener('click', () => {
    popup.classList.add('off');
    modal.classList.add('off');

    unlockBodyScroll();
  });
}


// 오늘 하루 보지않기
if (popupTodayClose) {
  popupTodayClose.addEventListener('click', () => {

    // 오늘 하루 보지않기를 클릭했을 때 오늘 날짜를 브라우저 hideDate에 저장
    localStorage.setItem('hideDate', todayDate);

    popup.classList.add('off');
    modal.classList.add('off');

    unlockBodyScroll();
  });
}


// 이미 오늘 하루 보지않기를 눌렀다면
if (hideDate === todayDate) {
  popup.classList.add('off');
  modal.classList.add('off');
}