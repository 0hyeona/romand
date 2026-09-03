const btnMenu = document.querySelector('.btn-menu');
const smartOverlayMenu = document.querySelector('.smart-overlay-menu');
const btnClose = document.querySelector('.btn-close');

// 오버레이 열고 닫는 기능
if (btnMenu) { // btnMenu에 .btn-menu 클래스가 저장됐을 때
  // 열기
  // 버튼을 눌렀을 때 오버레이가 나와야함
  btnMenu.addEventListener('click', function() {
    smartOverlayMenu.classList.add('on');
    // 메뉴 오버레이의 페이지 스크롤 숨김
    document.body.style.overflow = 'hidden';
  });
}
else {
  alert('btn-menu 클래스가 없어요.');
}

if (btnClose) {
  // 닫기
  // 버튼을 닫았을 때 오버레이가 닫혀야 함
  btnClose.addEventListener('click', function() {
    smartOverlayMenu.classList.remove('on');
    // 메뉴 오버레이의 페이지 스크롤 생성
    document.body.style.overflow = '';
  });
}
else {
  alert('btn-close 클래스가 없어요.');
}

// 뎁스 영역
const gnbTabs = document.querySelectorAll('.gnb-smart > li');
const gnbItems = document.querySelectorAll('.gnb-smart-list > li');

// 처음 로딩 시 기본 선택 상태를 NEW로 맞춤
if (gnbTabs.length && gnbItems.length) {
  gnbTabs.forEach((item) => item.classList.remove('on'));
  gnbItems.forEach((item) => item.classList.remove('on'));

  gnbTabs[0].classList.add('on');
  gnbItems[0].classList.add('on');
}

gnbTabs.forEach((tab, index) => {
  tab.addEventListener('click', function (e) {
    e.preventDefault();

    gnbTabs.forEach((item) => item.classList.remove('on'));
    gnbItems.forEach((item) => item.classList.remove('on'));

    tab.classList.add('on');
    gnbItems[index].classList.add('on');
  });
});

// 검색 버튼을 클릭했을 경우 아이콘 옆에 검색창이 나타나도록 처리
const searchBoxes = document.querySelectorAll('.search-box');

searchBoxes.forEach((searchBox) => {
  const searchToggle = searchBox.querySelector('.search-toggle');
  const searchInput = searchBox.querySelector('.search-field input');

  if (searchToggle) {
    searchToggle.addEventListener('click', function () {
      searchBox.classList.toggle('is-open');

      if (searchBox.classList.contains('is-open') && searchInput) {
        setTimeout(() => searchInput.focus(), 120);
      }
    });
  }
});

// 마우스 스크롤을 내리면 뎁스 메뉴를 숨김
const headerBottom = document.querySelector('.header-bottom');
let lastScrollTop = 0; // 이전 스크롤

if (headerBottom && window.innerWidth > 1024) {
  window.addEventListener('scroll', function () {
    // 현재 스크롤 변수
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > lastScrollTop) {
      // 현재 스크롤 Y좌표가 이전 스크롤 Y좌표보다 Y좌표가 클 때
      headerBottom.classList.add('on');
    } else if (scrollTop < lastScrollTop) {
      headerBottom.classList.remove('on');
    }

    // 일반적인 pc 환경에서는 이 코드를 작성 안해도 되지만 모바일 바운스 효과까지
    // 고려한다면 음수를 방지하는 Math 객체 mmax 메소드를 사용할 수 있음
    lastScrollTop = Math.max(scrollTop, 0);
  });
}