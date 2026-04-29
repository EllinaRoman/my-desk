const btn = document.getElementById('scrollTopBtn');

window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
        btn.classList.remove('btn-hidden');
    } else {
        btn.classList.add('btn-hidden');
    }
}, { passive: true });

btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});