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

// 渲染事件
async function renderDoThing(){
    const _response = await fetch('/get/things',{
        method: 'get',
        headers: {'Content-Type': 'application/json'}
    });
    const thingJSON = await _response.json();
    thingJSON.forEach((e)=>{
        if (e.status === 'do')
        {   
            const content = e.title;
            const newThing = document.createElement('div');
            thing.insertBefore(newThing, document.querySelector('#thing div:first-child'));
            // 添加自定义属性记录事件编号
            newThing.outerHTML = `
                <div class="normal" data-id=${e.id}>
                    <input type="checkbox" class="select">
                    <p>${content}</p>
                    <p class="change">修改</p>
                </div>
                `;
        }
    });
};
async function renderDidThing(){
    const _response = await fetch('/get/things',{
        method: 'get',
        headers: {'Content-Type': 'application/json'}
    });
    const thingJSON = await _response.json();
    thingJSON.forEach((e)=>{
        if (e.status === 'did')
        {   
            const content = e.title;
            const newThing = document.createElement('div');
            bin.insertBefore(newThing, document.querySelector('#bin div:first-child'));
            // 添加自定义属性记录事件编号
            newThing.outerHTML = `
                <div class="normal" data-id=${e.id}>
                    <input type="checkbox" checked disabled>
                    <p style="color: gray;text-decoration: line-through solid">${content}</p>
                    <p style="font-size: 13px;cursor: pointer">恢复</p>
                </div>
                `;
        }
    });
};
// 渲染本地事件
document.addEventListener('DOMContentLoaded',async ()=>{
    renderDoThing();
});
// 创建事件
createBtn.addEventListener('click',async(e)=>{
    input.style.border = '';
    const content = input.value;
    if (content.length === 0) {
        input.style.border = '2px solid red';
        alert('请输入待办事项！');
        return ;
    }
    input.value = '';
    // 将事件存储至数据库
    const response = await fetch('/',{
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            title: content,
            status: 'do',
            event: 'create'
        })
    });
    const resJson = await response.json();
    if (resJson.success)
    {
        thing.innerHTML = '';
        renderDoThing();
    }
    else 
    {
        alert(resJson.message);
    }
});
// 修改事件
thing.addEventListener('click',async e=>{
    const id = Number(e.target.parentNode.dataset.id);
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
            const response = await fetch('/',{
                method: 'post',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    id: id,
                    title: content_new,
                    event: 'modify'
                })
            })
            const resJson = await response.json();
            if (resJson.success) target.innerText = '修改';
            else alert('修改失败！');
        }
    }
});
// 完成事件
thing.addEventListener('change', async e => {
    const id = Number(e.target.parentNode.dataset.id);
    if(e.target.className != 'select') return;
    if (e.target.checked)
    {
        const next_p = e.target.nextElementSibling;
        next_p.style.color = "gray";
        next_p.style.textDecoration = "line-through solid";
        next_p.nextElementSibling.outerHTML = '';
        e.target.disabled = 'true';
        const response = await fetch('/',{
            method: 'post',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                id: id,
                event: 'delete'
            })
        });
        const resJson = await response.json();
        if (!resJson.success) alert(resJson.message);
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
        renderDidThing();
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
        thing.innerHTML = '';
        renderDoThing();
    }
});

// 恢复事件
bin.addEventListener('click',async (e)=>{
    if (e.target.innerText === '恢复')
    {
        const id = Number(e.target.parentNode.dataset.id);
        const response = await fetch('/',{
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                id: id,
                event: 'recover'
            })
        });
        const resJson = await response.json();
        if(resJson.success) e.target.parentNode.outerHTML = '';
        else alert(resJson.message);
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
allBtn[1].addEventListener('click',async ()=>{
    const response = await fetch('/',{
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            event: 'remove'
        })
    });
    const resJson = await response.json();
    if (!resJson.success) alert(resJson.message);
    else {
        thing.innerHTML = '';
        renderDoThing();
    }
});
