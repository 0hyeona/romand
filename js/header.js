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

gnbTabs.forEach((tab, index) => {
  tab.addEventListener('click', function (e) {
    e.preventDefault();

    gnbTabs.forEach(item => item.classList.remove('on'));
    gnbItems.forEach(item => item.classList.remove('on'));

    tab.classList.add('on');
    gnbItems[index].classList.add('on');
  });
});

