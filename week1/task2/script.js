console.log('script loaded');

const createBtn = document.querySelector('#submit');
const input = document.querySelector('#input');
const thing = document.querySelector('#thing');
const binBtn = document.querySelector('#binBtn');
const bin = document.querySelector('#bin');

let count = 0;

// 渲染本地事件
document.addEventListener('DOMContentLoaded',()=>{
    for (let i=0;i<=10;i++)
    {
        // 获取本地事件并对象化
        const contentObj = JSON.parse(localStorage.getItem(i));
        if (!contentObj) return;
        const content = contentObj.title;
        const id = contentObj.id;
        // 判断待办事项
        if (content.length === 0 || contentObj.status != 'do') return;
        count = i+1;
        const newThing = document.createElement('div');
        thing.insertBefore(newThing, document.querySelector('#thing div:first-child'));
        newThing.outerHTML = `
            <div class="normal" data-id=${id}>
                <input type="checkbox" class="select">
                <p>${content}</p>
                <p class="change">修改</p>
            </div>
            `;
    }
});
// 创建事件
createBtn.addEventListener('click',(e)=>{
    input.style.border = '';
    const content = input.value;
    if (content.length === 0) {
        input.style.border = '2px solid red';
        alert('请输入待办事项！');
        return ;
    }
    if (count >= 10) return;
    input.value = '';
    // 将事件存储至本地
    localStorage.setItem(count,JSON.stringify({
        id: count,
        title: content,
        status: 'do' // 待办
    }));
    const newThing = document.createElement('div');
    thing.insertBefore(newThing, document.querySelector('#thing div:first-child'));
    // 添加自定义属性记录事件编号
    newThing.outerHTML = `
        <div class="normal" data-id=${count}>
            <input type="checkbox" class="select">
            <p>${content}</p>
            <p class="change">修改</p>
        </div>
        `;
    count++;
    // console.dir(newThing);
    // console.dir(e);
});
// 修改事件
thing.addEventListener('click',e=>{
    const target = e.target;
    // 当前的 target 为 input
    const id = Number(target.parentNode.dataset.id);
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
            localStorage.setItem(id,JSON.stringify({
                id: id,
                title: content_new,
                status: 'do'
            }));
            target.innerText = '修改';
        }
    }
});
// 删除事件
thing.addEventListener('change', e => {
    const id = Number(e.target.parentNode.dataset.id);
    if(e.target.className != 'select') return;
    if (e.target.checked)
    {
        const next_p = e.target.nextElementSibling;
        next_p.style.color = "gray";
        next_p.style.textDecoration = "line-through solid";
        next_p.nextElementSibling.outerHTML = '';
        e.target.disabled = 'true';
        localStorage.removeItem(id);
    }
});

binBtn.addEventListener('click',()=>{
    bin.style.display = 'block';
    thing.style.display = 'none';
    for (let i=0;i<=10;i++)
    {
        // 获取本地事件并对象化
        const contentObj = JSON.parse(localStorage.getItem(i));
        if (!contentObj) return;
        const content = contentObj.title;
        const id = contentObj.id;
        // 判断待办事项
        if (content.length === 0 || contentObj.status != 'did') return;
        const newThing = document.createElement('div');
        thing.insertBefore(newThing, document.querySelector('#bin div:first-child'));
        newThing.outerHTML = `
            <div class="normal" data-id=${id}>
                <input type="checkbox" class="select">
                <p>${content}</p>
                <p class="recover">恢复</p>
            </div>
            `;
    }
});