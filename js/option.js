const optionBox = document.querySelector('.option-box');

if (optionBox) {
    const trigger = optionBox.querySelector('.option-trigger');
    const optionItems = optionBox.querySelectorAll('.option-item');
    const optionValue = optionBox.querySelector('.option-value');
    const triggerColor = optionBox.querySelector('.option-trigger .option-color');
    const productName = optionBox.querySelector('.pro-name p');
    const productDesc = optionBox.querySelector('.pro-desc p');
    const minusBtn = optionBox.querySelector('.counter img[alt="minus"]');
    const plusBtn = optionBox.querySelector('.counter img[alt="plus"]');
    const countText = optionBox.querySelector('.counter span');
    const counterBox = optionBox.querySelector('.option-summary');
    const money = optionBox.querySelector('.money');
    const totalAmount = document.querySelector('.purchase-summary p:last-child');
    const unitPrice = Number(window.currentProduct?.priceDiscount ?? 9400);
    let count = 1;

    function updateCount() {
        count = Math.max(0, count);
        countText.textContent = count;
        counterBox.style.display = count === 0 ? 'none' : 'flex';

        const totalPrice = unitPrice * count;
        money.textContent = totalPrice.toLocaleString('ko-KR');
        totalAmount.textContent = `${totalPrice.toLocaleString('ko-KR')}원`;
    }

    trigger.addEventListener('click', function () {
        optionBox.classList.toggle('is-open');
        optionBox.classList.remove('stage-3');
        optionBox.classList.add('stage-2');
    });

    optionItems.forEach(function (item) {
        item.addEventListener('click', function () {
            optionItems.forEach((element) => element.classList.remove('is-selected'));
            item.classList.add('is-selected');

            const selectedText = item.dataset.name || item.textContent.trim();
            const selectedColor = item.querySelector('.option-color');
            optionValue.textContent = selectedText;

            if (selectedColor && triggerColor) {
                triggerColor.className = selectedColor.className;
                triggerColor.style.backgroundColor = selectedColor.style.backgroundColor;
            }

            count = 1;
            updateCount();
            optionBox.classList.remove('is-open', 'stage-2');
            optionBox.classList.add('stage-3');

            if (productName) productName.textContent = window.currentProduct?.pname ?? selectedText;
            if (productDesc) productDesc.textContent = selectedText;
        });
    });

    minusBtn.addEventListener('click', function () {
        count -= 1;
        updateCount();
    });

    plusBtn.addEventListener('click', function () {
        count += 1;
        updateCount();
    });

    document.addEventListener('click', function (event) {
        if (optionBox.contains(event.target)) return;
        optionBox.classList.remove('is-open', 'stage-2');
    });
}
