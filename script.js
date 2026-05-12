const totalPages = 17;
let currentPage = 1;
const img = document.getElementById('pageImage');
const num = document.getElementById('pageNumber');
const book = document.getElementById('book');
const dots = document.getElementById('dots');
function src(n){return `assets/story/page-${String(n).padStart(2,'0')}.webp`}
function render(){book.classList.remove('turn');void book.offsetWidth;book.classList.add('turn');img.src=src(currentPage);num.textContent=`${currentPage} / ${totalPages}`;[...dots.children].forEach((d,i)=>d.classList.toggle('active',i+1===currentPage));}
for(let i=1;i<=totalPages;i++){const b=document.createElement('button');b.ariaLabel=`გვერდი ${i}`;b.onclick=()=>{currentPage=i;render()};dots.appendChild(b)}
document.getElementById('prev').onclick=()=>{currentPage=currentPage===1?totalPages:currentPage-1;render()};
document.getElementById('next').onclick=()=>{currentPage=currentPage===totalPages?1:currentPage+1;render()};
document.addEventListener('keydown',e=>{if(e.key==='ArrowLeft')document.getElementById('prev').click();if(e.key==='ArrowRight')document.getElementById('next').click();});
let sx=0;book.addEventListener('touchstart',e=>sx=e.touches[0].clientX,{passive:true});book.addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-sx;if(Math.abs(dx)>45)(dx<0?document.getElementById('next'):document.getElementById('prev')).click();});
render();
