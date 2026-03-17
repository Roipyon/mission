const createIp = document.querySelector('#createInput');
const createBtn = document.querySelector('#createBtn');
const things = document.querySelector('#things');

createBtn.addEventListener('click',()=>{
    const newThing = document.createElement('div');
    newThing.innerHTML = `<p>${createIp.value}</p>`;
    // 插入到头部
    things.insertBefore(newThing,document.querySelector('#things div:first-child'));
});
