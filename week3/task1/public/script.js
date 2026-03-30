console.log("script loaded");

const libraryShow = document.querySelector('#library_show');
const editorMain = document.querySelector('#editor_main');
const editorShow = document.querySelector('#editor_show');
const libraryAdd = document.querySelector('#library_add');

let editorCount = 0;

// 拖拽功能

// 拖拽元素
libraryShow.addEventListener('dragstart',(e)=>{
    console.log(e)
    console.log(e.target)
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
libraryAdd.addEventListener('click',()=>{
    
});
