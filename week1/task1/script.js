console.log('script loaded');

let count = 0;

const swiperArr = [{ url: './img/01.jpg'}, 
    { url: './img/02.webp'}, { url: './img/03.webp'}, 
    { url: './img/04.webp'}, { url: './img/05.webp'}, 
    { url: './img/06.webp'} ];
const swiper = document.querySelector('#swiper');
const firstSwiper = document.querySelector('.point:first-child');
const prevBtn = document.querySelector('#prev');
const nextBtn = document.querySelector('#next');
const topNav = document.querySelectorAll('#top_nav a');
const drop = document.querySelector('#d');
const show = document.querySelectorAll('.show');
const showBar = document.querySelector('.showBar');
const cart = document.querySelector('#header_cart');
const shopCart = document.querySelector('#shopCart');

cart.addEventListener('mouseenter',()=>{
    shopCart.style.maxHeight = '100px';
    shopCart.style.visibility = 'visible';
});
cart.addEventListener('mouseleave',()=>{
    shopCart.style.maxHeight = '0';
    shopCart.style.visibility = 'hidden';
});
show.forEach((e)=>{
    e.addEventListener('mouseenter',()=>{
        showBar.style.display = 'block';
    });
    e.addEventListener('mouseleave',()=>{
        showBar.style.display = 'none';
    });
});
showBar.addEventListener('mouseenter',()=>{
    showBar.style.display = 'block';
});
showBar.addEventListener('mouseleave',()=>{
    showBar.style.display = 'none';
});
topNav.forEach((e)=>{
    e.addEventListener('mouseenter',()=>{
    drop.style.maxHeight = '200px';
    drop.style.visibility = "visible";
    });
    e.addEventListener('mouseleave',()=>{
        drop.style.maxHeight = '0';
        drop.style.visibility = "none";
    });
});
drop.addEventListener('mouseenter',()=>{
    drop.style.maxHeight = '200px';
    drop.style.visibility = "visible";
});
drop.addEventListener('mouseleave',()=>{
    drop.style.maxHeight = '0';
    drop.style.visibility = "none";
});
swiperArr.forEach(item => {
    const img = new Image();
    img.src = item.url;
});
function swiperAdd(){
    const prev = document.querySelector(`.point:nth-child(${count+1})`);
    prev.classList.remove('active');
    count = ++count==6? 0:count;
    const current = document.querySelector(`.point:nth-child(${count+1})`);
    current.classList.add('active');
    swiper.style.backgroundImage = `url(${swiperArr[count].url})`;
};
function swiperRemove(){
    const prev = document.querySelector(`.point:nth-child(${count+1})`);
    prev.classList.remove('active');
    count = --count==-1? 5:count;
    const current = document.querySelector(`.point:nth-child(${count+1})`);
    current.classList.add('active');
    swiper.style.backgroundImage = `url(${swiperArr[count].url})`;
};

firstSwiper.classList.add('active');
let timer = setInterval(()=>{
    swiperAdd();
}, 5000)

nextBtn.addEventListener('click',()=>{
    swiperAdd();
});
prevBtn.addEventListener('click',()=>{
    swiperRemove();
});

swiper.addEventListener('mouseenter',()=>{
    clearInterval(timer);
});
swiper.addEventListener('mouseleave',()=>{
    timer = setInterval(()=>{
        swiperAdd();
    }, 5000)
});