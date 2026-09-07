(() => {
    "use strict";

    function initReviewSliders() {
        document.querySelectorAll(".product-review").forEach((root) => {
            const train = root.querySelector(".slider-train");
            const station = root.querySelector(".slider-station");
            const prev = root.querySelector(".prev")?.closest(".slider-button");
            const next = root.querySelector(".next")?.closest(".slider-button");
            const dots = [...root.querySelectorAll(".review-pagination img")];

            if (!train || !station || !prev || !next || train.dataset.sliderReady) return;

            // 현재 CSS에 맞춰 한 페이지에 카드 2개를 표시합니다.
            const cardsPerPage = 2;
            const originals = [...train.children];
            const pageCount = originals.length / cardsPerPage;
            if (!Number.isInteger(pageCount) || pageCount < 1 || dots.length !== pageCount) {
                console.warn("리뷰 슬라이더: 카드 수는 2의 배수, 페이지 표시 수는 카드 수 / 2여야 합니다.");
                return;
            }
            train.dataset.sliderReady = "true";

            const duration = 400;
            const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
            let currentPage = 0;
            let physicalPage = pageCount > 1 ? 1 : 0;
            let moving = false;
            let timer;

            // [마지막 페이지 복제] [원본 페이지들] [첫 페이지 복제]
            // 경계에서 복제 페이지까지 이동한 뒤 같은 모양의 원본으로 즉시 돌아갑니다.
            function cloneCard(card) {
                const clone = card.cloneNode(true);
                clone.setAttribute("aria-hidden", "true");
                clone.setAttribute("inert", "");
                clone.removeAttribute("id");
                clone.querySelectorAll("[id]").forEach((node) => node.removeAttribute("id"));
                return clone;
            }

            if (pageCount > 1) {
                train.prepend(...originals.slice(-cardsPerPage).map(cloneCard));
                train.append(...originals.slice(0, cardsPerPage).map(cloneCard));
            }
            const allCards = [...train.children];

            function updatePagination() {
                dots.forEach((dot, index) => {
                    const active = index === currentPage;
                    dot.src = active ? "./img/review-dot-on.svg" : "./img/review-dot-off.svg";
                    dot.alt = `${index + 1}페이지${active ? " (현재 페이지)" : ""}`;
                    if (active) dot.setAttribute("aria-current", "page");
                    else dot.removeAttribute("aria-current");
                });
            }

            function position(animate) {
                if (station.getBoundingClientRect().width === 0) return false;
                // 카드 사이 간격까지 실제 위치로 계산합니다.
                const first = allCards[0].getBoundingClientRect();
                const target = allCards[physicalPage * cardsPerPage].getBoundingClientRect();
                const offset = target.left - first.left;
                train.style.transition = animate ? `transform ${duration}ms ease` : "none";
                train.style.transform = `translateX(${-offset}px)`;
                return true;
            }

            function finish() {
                clearTimeout(timer);
                physicalPage = pageCount > 1 ? currentPage + 1 : 0;
                position(false);
                moving = false;
            }

            function move(direction) {
                if (moving || pageCount <= 1 || station.getBoundingClientRect().width === 0) return;
                // 복제 페이지에서 돌아온 위치를 먼저 확정합니다.
                position(false);
                void train.offsetWidth;
                currentPage = (currentPage + direction + pageCount) % pageCount;
                physicalPage += direction;
                updatePagination();

                if (reducedMotion.matches) {
                    finish();
                    return;
                }
                moving = true;
                position(true);
                // 탭 전환 등으로 transitionend가 누락되어도 버튼 잠금을 해제합니다.
                timer = window.setTimeout(finish, duration + 100);
            }

            train.addEventListener("transitionend", (event) => {
                if (event.target === train && event.propertyName === "transform" && moving) finish();
            });

            function bindButton(button, direction, label) {
                // 기존 div 구조에서도 클릭과 키보드 조작을 지원합니다.
                button.setAttribute("role", "button");
                button.setAttribute("tabindex", pageCount > 1 ? "0" : "-1");
                button.setAttribute("aria-label", label);
                button.setAttribute("aria-disabled", String(pageCount <= 1));
                button.style.cursor = pageCount > 1 ? "pointer" : "default";
                button.querySelectorAll("a").forEach((link) => link.setAttribute("tabindex", "-1"));
                button.addEventListener("click", (event) => {
                    event.preventDefault(); // 기존 href="#"의 페이지 위쪽 이동 방지
                    move(direction);
                });
                button.addEventListener("keydown", (event) => {
                    if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        move(direction);
                    }
                });
            }

            bindButton(prev, -1, "이전 리뷰 페이지");
            bindButton(next, 1, "다음 리뷰 페이지");
            updatePagination();
            position(false);

            // 숨겨져 있던 모바일/PC 영역이 나타나거나 너비가 바뀌면 위치를 재계산합니다.
            let lastWidth = -1;
            const observer = new ResizeObserver(() => {
                const width = station.getBoundingClientRect().width;
                if (width !== lastWidth) {
                    lastWidth = width;
                    finish();
                }
            });
            observer.observe(station);
            window.addEventListener("resize", finish);
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initReviewSliders, { once: true });
    } else {
        initReviewSliders();
    }
})();
