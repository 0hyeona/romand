const btnMenu = document.querySelector('.btn-menu');
const smartOverlayMenu = document.querySelector('.smart-overlay-menu');
const btnClose = document.querySelector('.btn-close');

// 오버레이 열고 닫는 기능 
if (btnMenu) { // btnMenu에 .btn-menu 클래스가 저장됐을 때 
    // 열기
    // 버튼을 눌렀을 때 오버레이가 나와야함 
    btnMenu.addEventListener('click', function() {
        smartOverlayMenu.classList.add('on');
    });   
}    
else { 
    alert('btn-menu 클래스가 없어요.')
}


if (btnClose) {
    // 닫기 
    // 버튼을 닫았을 때 오버레이가 닫혀야 함
    btnClose.addEventListener('click', function() {
        smartOverlayMenu.classList.remove('on');
    });
}
else { 
    alert('btn-close 클래스가 없어요.')
}

// 뎁스 영역
const gnbTabs = document.querySelectorAll('.gnb-smart > li');
const gnbItems = document.querySelectorAll('.gnb-smart-list > li');

// 처음 로딩 시 기본 선택 상태를 NEW로 맞춤
if (gnbTabs.length && gnbItems.length) {
  gnbTabs.forEach(item => item.classList.remove('on'));
  gnbItems.forEach(item => item.classList.remove('on'));

  gnbTabs[0].classList.add('on');
  gnbItems[0].classList.add('on');
}

gnbTabs.forEach((tab, index) => {
  tab.addEventListener('click', function (e) {
    e.preventDefault();

    gnbTabs.forEach(item => item.classList.remove('on'));
    gnbItems.forEach(item => item.classList.remove('on'));

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