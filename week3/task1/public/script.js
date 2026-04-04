console.log("script loaded");

const libraryShow = document.querySelector('#library_show');
const libraryAdd = document.querySelector('#library_add');
const listAdd = document.querySelector('#list_add');
const listShow = document.querySelector('#list_show');
const listDelete = document.querySelector('#list_delete');
const editorMain = document.querySelector('#editor_main');
const editorShow = document.querySelector('#editor_show');
const editorSave = document.querySelector('#editor_save');
const editorTitleSpan = document.querySelector('#editor_title span');
const editorRemove = document.querySelector('#editor_remove');

let listCount = 0;
let listRTC;
let editorCount = 0;
let editorId;
let editorEmpty = true;
let canEditor = false;
let canDelete = false;
let canAdd = true;
let craftGlobal = [];
let craftWaiting = [];
let isLibrary = false;
let dragElement = null;

function renderList(data,index)
{
    const newThing = document.createElement('div');
    editorShow.appendChild(newThing);
    newThing.outerHTML = `
        <div class="editorNormal" data-value=${index-1} draggable="true">
            <span style="margin-left: 10px;">${index}.${data}</span>
            <div class="editor_delete">删除</div>
        </div>
    `;
}

// 拖拽功能

// 拖拽元素
libraryShow.addEventListener('dragstart',(e)=>{
    e.dataTransfer.setData('text/plain',e.target.innerText);
    e.dataTransfer.effectAllowed = 'copy';
    e.target.classList.add('libraryDraging');
    isLibrary = true;
});
libraryShow.addEventListener('dragend',(e)=>{
    e.target.classList.remove('libraryDraging');
});

editorMain.addEventListener('dragover',(e)=>{
    if (!isLibrary) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
});
// 进入区域高亮显示
editorShow.addEventListener('dragenter',(e)=>{
    if (!isLibrary) return;
    e.preventDefault();
    e.target.classList.add('drop');
});
editorShow.addEventListener('dragleave',(e)=>{
    if (!isLibrary) return;
    e.target.classList.remove('drop');
});

//editor_show拖拽
editorShow.addEventListener('mouseenter',()=>{
    if (isLibrary) return;
    const items = document.querySelectorAll('.editorNormal');
    items.forEach((item)=>{
        item.addEventListener('dragstart',(e)=>{
            dragElement = item;
            e.dataTransfer.setData('text/plain',item.querySelector('span').innerText);
        });
        item.addEventListener('dragend',()=>{
            dragElement = null;
        });
        item.addEventListener('dragover',(e)=>{
            e.preventDefault();
            if (!dragElement || dragElement === item) return;

            const children = Array.from(editorShow.children);
            const oldIndex = children.indexOf(dragElement);
            const newIndex = children.indexOf(item);

            if (oldIndex < newIndex)
                editorShow.insertBefore(dragElement,item.nextSibling);
            else editorShow.insertBefore(dragElement,item);

            let mid = null;
            mid = craftWaiting[oldIndex];
            craftWaiting[oldIndex] = craftWaiting[newIndex];
            craftWaiting[newIndex] = mid;
        });
    });
});

// 接收拖拽数据
editorMain.addEventListener('drop',(e)=>{
    if (!isLibrary) return;
    e.preventDefault();
    e.target.classList.remove('drop');
    if (canEditor) 
    {
        if (editorEmpty) editorShow.innerHTML = '';
        editorEmpty = false;
        const data = e.dataTransfer.getData('text/plain');
        editorCount++;
        renderList(data,editorCount);
        craftWaiting.push(data);
    }
    isLibrary = false;
});

// 新增工序
libraryAdd.addEventListener('click',(e)=>{
    if (e.target.id === '_add' || canAdd)
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
        canAdd = false;
    }
    else if (e.target.id === '_tick' || !canAdd)
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
        canAdd = true;
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
            <div class="listNormal" data-id=${listCount++}>
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
        canEditor = true;
        canDelete = true;
        editorId = e.target.dataset.id;
        listRTC = e.target;
        e.target.style.border = '1px solid #2563eb';
        e.target.style.backgroundColor = '#006eff18';
        editorTitleSpan.innerText = `工艺：${e.target.childNodes[1].innerText}`;
        if (craftGlobal[editorId] == undefined || craftGlobal[editorId].length === 0) 
        {
            editorCount = 0;
            editorEmpty = true;
            return;
        }
        if (craftGlobal[editorId].length > 0)
        {
            editorCount = craftGlobal[editorId].length;
            craftWaiting = craftGlobal[editorId].slice();
            editorShow.innerHTML = '';
            craftWaiting.forEach((e,index)=>{
                renderList(e,index+1);
            });
        }
        editorEmpty = false;
    }
    else if (e.target.className === 'spanNormal')
    {
        if (listRTC)
        {
            listRTC.style.backgroundColor = 'rgba(184, 216, 216, 0.096)';
            listRTC.style.border = '1px solid rgba(128, 128, 128, 0.212)';
        }
        canEditor = true;
        canDelete = true;
        editorId = e.target.parentNode.dataset.id;
        listRTC = e.target.parentNode;
        e.target.parentNode.style.border = '1px solid #2563eb';
        e.target.parentNode.style.backgroundColor = '#006eff18';
        editorTitleSpan.innerText = `工艺：${e.target.innerText}`;
        if (craftGlobal[editorId] == undefined || craftGlobal[editorId].length === 0) 
        {
            editorCount = 0;
            editorEmpty = true;
            return;
        }
        if (craftGlobal[editorId].length > 0)
        {
            editorCount = craftGlobal[editorId].length;
            craftWaiting = craftGlobal[editorId].slice();
            editorShow.innerHTML = '';
            craftWaiting.forEach((e,index)=>{
                renderList(e,index+1);
            });
        }
        editorEmpty = false;
    }
    else
    {
        if (listRTC)
        {
            listRTC.style.backgroundColor = 'rgba(184, 216, 216, 0.096)';
            listRTC.style.border = '1px solid rgba(128, 128, 128, 0.212)';
            editorId = null;
            editorTitleSpan.innerText = `工艺：`;
            if (!editorEmpty) 
            {
                editorShow.innerHTML = `
                    <div style="margin: auto;">将左侧工序拖放到此处</div>
                `;
                editorEmpty = true;
            }
            craftWaiting = [];
        }
    }
});
// 工艺保存
editorSave.addEventListener('click',()=>{
    if (editorId != null)
    {
        craftGlobal[editorId] = craftWaiting;
        craftWaiting = [];
        canEditor = false;
        editorShow.innerHTML = `
            <div style="margin: auto;">将左侧工序拖放到此处</div>
        `;
        editorEmpty = true;
        if (listRTC)
        {
            listRTC.style.backgroundColor = 'rgba(184, 216, 216, 0.096)';
            listRTC.style.border = '1px solid rgba(128, 128, 128, 0.212)';
            editorId = null;
            editorTitleSpan.innerText = `工艺：`;
        }
    }
});
// 删除工艺
listDelete.addEventListener('click',()=>{
    if (canDelete)
    {
        listRTC.outerHTML = '';
        craftGlobal[editorId] = [];
        if (!editorEmpty) 
        {
            editorShow.innerHTML = `
                <div style="margin: auto;">将左侧工序拖放到此处</div>
            `;
            editorEmpty = true;
        }
        canDelete = false;
        editorTitleSpan.innerText = `工艺：`;
        if (listRTC)
        {
            editorId = null;
            listRTC = null;
        }
    }
});
// 清空工序
editorRemove.addEventListener('click',()=>{
    if (canEditor)
    {
        craftGlobal[editorId] = [];
        craftWaiting = [];
        editorShow.innerHTML = `
            <div style="margin: auto;">已清空当前工艺的所有工序</div>
        `;
        editorEmpty = true;
        canEditor = false;
        editorCount = 0;
        if (listRTC)
        {
            listRTC.style.backgroundColor = 'rgba(184, 216, 216, 0.096)';
            listRTC.style.border = '1px solid rgba(128, 128, 128, 0.212)';
            editorId = null;
            editorTitleSpan.innerText = `工艺：`;
        }
    }
});
// 单条删除
editorShow.addEventListener('click',(e)=>{
    if (e.target.className === 'editor_delete')
    {
        const deleteId = e.target.parentNode.dataset.value;
        craftWaiting.splice(deleteId,1);
        editorShow.innerHTML = '';
        craftWaiting.forEach((e,index)=>{
            renderList(e,index+1);
            editorCount = index+1;
        });
    }
});