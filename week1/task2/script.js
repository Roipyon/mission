console.log('script loaded');

const createBtn = document.querySelector('#submit');
const input = document.querySelector('#input');
const thing = document.querySelector('#thing');
const binBtn = document.querySelector('#binBtn');
const bin = document.querySelector('#bin');
const closeBtn = document.querySelector('.close');
const allBtn = document.querySelectorAll('.allBtn');
const all = document.querySelector('#all');
const mark = document.querySelector('#mark');

let count = 0;

// 渲染本地事件
document.addEventListener('DOMContentLoaded',()=>{
    for (let i=0;i<=10;i++)
    {
        // 获取本地事件并对象化
        const contentObj = JSON.parse(localStorage.getItem(i));
        if (!contentObj) continue;
        const content = contentObj.title;
        const id = contentObj.id;
        // 判断待办事项
        if (content.length === 0 || contentObj.status != 'do') continue;
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
        console.dir(next_p);
        next_p.style.color = "gray";
        next_p.style.textDecoration = "line-through solid";
        next_p.nextElementSibling.outerHTML = '';
        e.target.disabled = 'true';
        // localStorage.removeItem(id); 可选择直接删除事件
        localStorage.setItem(id,JSON.stringify({
            id: id,
            title: next_p.innerText,
            status: 'did'
        }));
    }
});

// 回收站
binBtn.addEventListener('click',(e)=>{
    console.log(e);
    if (e.target.tagName === 'svg')
    {
        e.target.parentNode.innerHTML = '<span style="cursor: pointer">确定</span>';
        bin.style.display = 'block';
        thing.style.display = 'none';
        for (let i=0;i<=10;i++)
        {
            // 获取本地事件并对象化
            const contentObj = JSON.parse(localStorage.getItem(i));
            if (!contentObj) continue;
            const content = contentObj.title;
            const id = contentObj.id;
            // 判断待办事项
            if (content.length === 0 || contentObj.status != 'did') continue;
            const newThing = document.createElement('div');
            bin.insertBefore(newThing, document.querySelector('#bin div:first-child'));
            newThing.outerHTML = `
                <div class="normal" data-id=${id}>
                    <input type="checkbox" checked disabled>
                    <p style="color: gray;text-decoration: line-through solid">${content}</p>
                    <p style="font-size: 13px;cursor: pointer">恢复</p>
                </div>
                `;
        }
    }
    else if (e.target.tagName === 'SPAN')
    {
        e.target.parentNode.innerHTML = `
        <svg class="icon" style="cursor: pointer;width: 2em;height: 2em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="11862">
                <path d="M842.666667 981.333333H181.333333a53.393333 53.393333 0 0 1-53.333333-53.333333V277.333333a21.333333 21.333333 0 0 1 42.666667 0v650.666667a10.666667 10.666667 0 0 0 10.666666 10.666667h661.333334a10.666667 10.666667 0 0 0 10.666666-10.666667V277.333333a21.333333 21.333333 0 0 1 42.666667 0v650.666667a53.393333 53.393333 0 0 1-53.333333 53.333333z m-181.333334-128a21.333333 21.333333 0 0 1-21.333333-21.333333V362.666667a21.333333 21.333333 0 0 1 42.666667 0v469.333333a21.333333 21.333333 0 0 1-21.333334 21.333333z m-298.666666 0a21.333333 21.333333 0 0 1-21.333334-21.333333V362.666667a21.333333 21.333333 0 0 1 42.666667 0v469.333333a21.333333 21.333333 0 0 1-21.333333 21.333333z m554.666666-682.666666H106.666667a21.333333 21.333333 0 0 1 0-42.666667h192v-32a53.393333 53.393333 0 0 1 53.333333-53.333333h320a53.393333 53.393333 0 0 1 53.333333 53.333333v32h192a21.333333 21.333333 0 0 1 0 42.666667z m-576-42.666667h341.333334v-32a10.666667 10.666667 0 0 0-10.666667-10.666667H352a10.666667 10.666667 0 0 0-10.666667 10.666667z" fill="#333333" p-id="11863">
                </path>
        </svg>`;
        bin.style.display = 'none';
        thing.style.display = 'flex';
        bin.innerHTML = `
            <div id="head1">
            </div>`;
        location.reload();
    }
});

// 恢复事件
bin.addEventListener('click',(e)=>{
    if (e.target.innerText === '恢复')
    {
        const id = e.target.parentNode.dataset.id;
        const thing = JSON.parse(localStorage.getItem(id));
        localStorage.setItem(id,JSON.stringify({
            id: id,
            title: thing.title,
            status: 'do'
        }));
        e.target.parentNode.outerHTML = '';
    }
});

// 打开全选界面
all.addEventListener('click',()=>{
    mark.style.display = 'block';
});

// 关闭全选界面
closeBtn.addEventListener('click',()=>{
    mark.style.display = 'none';
});

// 全部完成
allBtn[0].addEventListener('click',()=>{
    const normal = document.querySelectorAll('.normal');
    normal.forEach((e)=>{
        e.children[0].click(); // 模拟点击
    });
});

// 全部清除
// 不过多干涉全部完成的功能，仅删除已被完成的事件
allBtn[1].addEventListener('click',()=>{
    for (let i=0;i<=10;i++)
    {
        if (!localStorage.getItem(i)) continue;
        if (JSON.parse(localStorage.getItem(i)).status === 'did')
            localStorage.removeItem(i);
    }
});
