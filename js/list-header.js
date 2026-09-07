const alignListBox = document.querySelector('.align-list-box');
const align = document.querySelector('.align');
const alignLists = document.querySelectorAll('.align-list-box>li');

align.addEventListener('click',()=>{
    alignListBox.classList.toggle('on');
})

alignLists.forEach((li)=>{
    li.addEventListener('click',(event)=>{
        event.preventDefault();
        const selectedText = li.textContent.trim();
        const alignTextNode = align.firstChild;

        if (alignTextNode && alignTextNode.nodeType === Node.TEXT_NODE) {
            alignTextNode.textContent = selectedText;
        } else {
            align.insertBefore(document.createTextNode(selectedText), align.firstChild);
        }

        alignLists.forEach(li=>li.classList.remove('on'));
        li.classList.add('on');
    })
})