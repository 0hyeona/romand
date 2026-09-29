const loginTabs = document.querySelectorAll('.login-tab');
const loginPanels = document.querySelectorAll('.login-panel');

function activateLoginPanel(tab) {
    const targetId = tab.dataset.panel;

    loginTabs.forEach((item) => {
        const isActive = item === tab;
        item.classList.toggle('is-active', isActive);
        item.setAttribute('aria-selected', String(isActive));
        item.tabIndex = isActive ? 0 : -1;
    });

    loginPanels.forEach((panel) => {
        const isActive = panel.id === targetId;
        panel.classList.toggle('is-active', isActive);
        panel.hidden = !isActive;
    });
}

loginTabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activateLoginPanel(tab));

    tab.addEventListener('keydown', (event) => {
        if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;

        event.preventDefault();
        const direction = event.key === 'ArrowRight' ? 1 : -1;
        const nextIndex = (index + direction + loginTabs.length) % loginTabs.length;
        loginTabs[nextIndex].focus();
        activateLoginPanel(loginTabs[nextIndex]);
    });
});

document.querySelectorAll('.login-form').forEach((form) => {
    form.addEventListener('submit', (event) => event.preventDefault());
});
