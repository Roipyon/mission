console.log('script loaded');

const createBtn = document.querySelector('#submit');
const input = document.querySelector('#input');
const thing = document.querySelector('#thing');

let count = 0;

// 渲染本地事件
document.addEventListener('DOMContentLoaded',()=>{
    for (let i=0;i<=10;i++)
    {
        const content = localStorage.getItem(i);
        if (content.length === 0) return;
        count = i+1;
        const newThing = document.createElement('div');
        newThing.innerHTML = `<input type="checkbox" class="select">
            <p>${content}</p>
            <p class="change">修改</p>
            `;
        newThing.classList.add('normal');
        thing.insertBefore(newThing, document.querySelector('#thing div:first-child'));
    }
});
// 创建事件
createBtn.addEventListener('click',(e)=>{
    const content = input.value;
    if (content.length === 0) {
        input.style.border = '2px solid red';
        alert('请输入待办事项！');
        return ;
    }
    if (count >= 10) return;
    // 将事件存储至本地
    localStorage.setItem(count,content);
    const newThing = document.createElement('div');
    newThing.innerHTML = `<input type="checkbox" class="select">
        <p>${content}</p>
        <p class="change">修改</p>
        `;
    newThing.classList.add('normal');
    thing.insertBefore(newThing, document.querySelector('#thing div:first-child'));
    count++;
    // console.dir(newThing);
    // console.dir(e);
});
thing.addEventListener('click',e=>{
    const target = e.target;
    if (e.target.className != 'change') return;
    //console.log(e.target.previousElementSibling);
    if (target.innerText === '修改')
    {
        const change_p = target.previousElementSibling;
        const content_p = change_p.innerText;
        change_p.outerHTML = `<input class="changing" name="input" value=${content_p}>`;
        target.innerText = '确认';
    }
    else if (target.innerText === '确认')
    {
        const changing = target.previousElementSibling;
        if (changing && changing.tagName == 'INPUT') {
            const content_new = changing.value.trim() || '未命名';
            changing.outerHTML = `<p>${content_new}</p>`;
            target.innerText = '修改';
        }
    }
});
thing.addEventListener('change', e => {
    if(e.target.className != 'select') return;
    if (e.target.checked)
    {
        const next_p = e.target.nextElementSibling;
        next_p.style.color = "gray";
        next_p.style.textDecoration = "line-through solid";
        next_p.nextElementSibling.outerHTML = '';
        e.target.disabled = 'true';
    }
});

