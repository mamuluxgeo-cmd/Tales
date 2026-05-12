const totalPages = 17;
let currentPage = 1;
let isAnimating = false;

const leftImage = document.getElementById('leftPageImage');
const rightImage = document.getElementById('rightPageImage');
const flipFront = document.getElementById('flipFrontImage');
const flipBack = document.getElementById('flipBackImage');
const flippingPage = document.getElementById('flippingPage');
const spreadCount = document.getElementById('spreadCount');
const book = document.getElementById('book');

function src(n) {
  const page = Math.max(1, Math.min(totalPages, n));
  return `assets/story/page-${String(page).padStart(2, '0')}.webp`;
}

function updateStaticPages() {
  const leftPage = currentPage;
  const rightPage = Math.min(currentPage + 1, totalPages);

  if (window.innerWidth <= 800) {
    rightImage.src = src(currentPage);
    spreadCount.textContent = `გვერდი ${currentPage} / ${totalPages}`;
  } else {
    leftImage.src = src(leftPage);
    rightImage.src = src(rightPage);
    spreadCount.textContent = `${leftPage}–${rightPage} / ${totalPages}`;
  }
}

function animate(direction) {
  if (isAnimating) return;
  isAnimating = true;

  if (window.innerWidth <= 800) {
    currentPage = direction === 'next'
      ? (currentPage >= totalPages ? 1 : currentPage + 1)
      : (currentPage <= 1 ? totalPages : currentPage - 1);
    updateStaticPages();
    isAnimating = false;
    return;
  }

  const currentRight = Math.min(currentPage + 1, totalPages);
  const nextLeft = direction === 'next'
    ? (currentPage + 2 > totalPages ? 1 : currentPage + 2)
    : (currentPage - 2 < 1 ? Math.max(1, totalPages - 1) : currentPage - 2);

  flipFront.src = src(currentRight);
  flipBack.src = src(nextLeft);

  flippingPage.classList.remove('turn-next', 'turn-prev', 'active');
  void flippingPage.offsetWidth;
  flippingPage.classList.add('active', direction === 'next' ? 'turn-next' : 'turn-prev');

  setTimeout(() => {
    if (direction === 'next') {
      currentPage += 2;
      if (currentPage > totalPages) currentPage = 1;
    } else {
      currentPage -= 2;
      if (currentPage < 1) currentPage = Math.max(1, totalPages - 1);
    }

    updateStaticPages();
    flippingPage.classList.remove('turn-next', 'turn-prev', 'active');
    isAnimating = false;
  }, 950);
}

function next() { animate('next'); }
function prev() { animate('prev'); }

const bind = (id, fn) => document.getElementById(id).addEventListener('click', fn);

bind('next', next);
bind('prev', prev);
bind('nextBottom', next);
bind('prevBottom', prev);
document.getElementById('firstPage').addEventListener('click', () => {
  if (isAnimating) return;
  currentPage = 1;
  updateStaticPages();
});
document.getElementById('lastPage').addEventListener('click', () => {
  if (isAnimating) return;
  currentPage = Math.max(1, totalPages - 1);
  updateStaticPages();
});

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight') next();
  if (e.key === 'ArrowLeft') prev();
});

let startX = 0;
book.addEventListener('touchstart', e => {
  startX = e.touches[0].clientX;
}, { passive: true });
book.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - startX;
  if (Math.abs(dx) > 50) {
    if (dx < 0) next();
    else prev();
  }
});

window.addEventListener('resize', updateStaticPages);
updateStaticPages();
