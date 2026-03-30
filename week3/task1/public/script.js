console.log("script loaded");

const libraryShow = document.querySelector('#library_show');
const editorMain = document.querySelector('#editor_main');
const editorShow = document.querySelector('#editor_show');
const libraryAdd = document.querySelector('#library_add');
const listAdd = document.querySelector('#list_add');
const listShow = document.querySelector('#list_show');

let editorCount = 0;
let listRTC;

// 拖拽功能

// 拖拽元素
libraryShow.addEventListener('dragstart',(e)=>{
    e.dataTransfer.setData('text/plain',e.target.innerText);
    e.dataTransfer.effectAllowed = 'copy';
    e.target.classList.add('libraryDraging');
});
libraryShow.addEventListener('dragend',(e)=>{
    e.target.classList.remove('libraryDraging');
});

editorMain.addEventListener('dragover',(e)=>{
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
});
// 进入区域高亮显示
editorMain.addEventListener('dragenter',(e)=>{
    e.preventDefault();
    e.target.classList.add('drop');
});
editorMain.addEventListener('dragleave',(e)=>{
    e.target.classList.remove('drop');
});
// 接收拖拽数据
editorMain.addEventListener('drop',(e)=>{
    e.preventDefault();
    e.target.classList.remove('drop');
    const data = e.dataTransfer.getData('text/plain');
    const newThing = document.createElement('div');
    editorShow.appendChild(newThing);
    editorCount++;
    newThing.innerHTML = `
        <div class="editorNormal">
            <span style="margin-left: 10px;">${editorCount}.${data}</span>
            <div class="editor_delete">删除</div>
        </div>
    `;
});

// 新增工序
libraryAdd.addEventListener('click',(e)=>{
    if (e.target.id === '_add')
    {
        const newThing = document.createElement('div');
        libraryShow.appendChild(newThing);
        newThing.outerHTML = `
            <div class="libraryNormal">
                <input type="text" class="input" placeholder="请输入工序">
            </div>
        `;
        libraryAdd.innerHTML = `                   
            <svg id="_tick" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2508" width="1.5em" height="1.5em"><path d="M892.064 261.888a31.936 31.936 0 0 0-45.216 1.472L421.664 717.248l-220.448-185.216a32 32 0 1 0-41.152 48.992l243.648 204.704a31.872 31.872 0 0 0 20.576 7.488 31.808 31.808 0 0 0 23.36-10.112L893.536 307.136a32 32 0 0 0-1.472-45.248z" p-id="2509" fill="#707070"></path></svg>
        `;
        libraryAdd.style.border = '1px solid #2563eb';
    }
    else if (e.target.id === '_tick')
    {
        const confirm = document.querySelector('#library_show input');
        const content = confirm.value.trim() || '未命名';
        confirm.parentNode.outerHTML = `
            <div class="libraryNormal" draggable="true">
                <span class="spanNormal">${content}</span>
            </div>
        `;
        libraryAdd.innerHTML = `                   
            <svg id="_add" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2575" width="1.5em" height="1.5em"><path d="M533.333333 490.666667V128h-42.666666v362.666667H128v42.666666h362.666667v362.666667h42.666666V533.333333h362.666667v-42.666666z" fill="#3D3D3D" p-id="2576"></path></svg>
        `;
        libraryAdd.style.border = '1px dashed gray';
    }
});

// 新增工艺
listAdd.addEventListener('click',(e)=>{
    if (e.target.innerText === '新建工艺')
    {
        const newThing = document.createElement('div');
        listShow.appendChild(newThing);
        newThing.outerHTML = `
            <div class="listNormal">
                <input type="text" class="input" placeholder="请输入工艺名称">
            </div>
        `;
        listAdd.innerText = `确认`;
    }
    else if (e.target.innerText === '确认')
    {
        const confirm = document.querySelector('#list_show input');
        const content = confirm.value.trim() || '未命名';
        confirm.parentNode.outerHTML = `
            <div class="listNormal">
                <span class="spanNormal">${content}</span>
            </div>
        `;
        listAdd.innerHTML = `新建工艺`;
    }
});

// 工艺编辑
listShow.addEventListener('click',(e)=>{
    if (e.target.className === 'listNormal')
    {
        // 只能选择一个工艺
        if (listRTC)
        {
            listRTC.style.backgroundColor = 'rgba(184, 216, 216, 0.096)';
            listRTC.style.border = '1px solid rgba(128, 128, 128, 0.212)';
        }
        listRTC = e.target;
        e.target.style.border = '1px solid #2563eb';
        e.target.style.backgroundColor = '#006eff18';

    }
    else if (e.target.className === 'spanNormal')
    {
        if (listRTC)
        {
            listRTC.style.backgroundColor = 'rgba(184, 216, 216, 0.096)';
            listRTC.style.border = '1px solid rgba(128, 128, 128, 0.212)';
        }
        listRTC = e.target.parentNode;
        e.target.parentNode.style.border = '1px solid #2563eb';
        e.target.parentNode.style.backgroundColor = '#006eff18';
    }
    else
    {
        if (listRTC)
        {
            listRTC.style.backgroundColor = 'rgba(184, 216, 216, 0.096)';
            listRTC.style.border = '1px solid rgba(128, 128, 128, 0.212)';
        }
    }
});