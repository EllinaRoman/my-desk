document.addEventListener('change', (e) => {
    const toggle = e.target.closest('.status-toggle');
    const modal = e.target.closest('.modal-overlay');
    if (toggle) {
        const glider = toggle.querySelector('.status-glider');
        const label = toggle.querySelector(`label[for='${e.target.id}']`);
        glider.style.left = label.offsetLeft + 'px';
        glider.style.width = label.offsetWidth + 'px';

        const display = modal.querySelector('.add-book_rating');
        display.style.display = (e.target.value === "completed") ? 'flex' : 'none';
        const statusActive = toggle.querySelector('.status-active');
        if (statusActive) {
            statusActive.classList.remove('status-active');
            label.classList.add('status-active');
        }
    }
})

document.addEventListener('click', (e) => {
    const star = e.target.closest('.star-btn');

    if (star) {
        const stars = star.closest('.star-rating');
        const starsArr = Array.from(stars.querySelectorAll('.star-btn'));
        const index = starsArr.indexOf(star);
        starsArr.forEach((item, i) => {
            if (i <= index) {
                item.classList.add('star-active');
            } else {
                item.classList.remove('star-active');
            }
        })
        stars.dataset.value = index + 1;
    }
})

const gliderReset = (form) => {
    const overlay = form.closest('.modal-overlay');
    const firstLabel = overlay.querySelector('label[for="add-reading"]');
    if (!firstLabel) return;

    const toggle = firstLabel.closest('.status-toggle');
    const glider = toggle.querySelector('.status-glider');

    glider.style.left = firstLabel.offsetLeft + 'px';
    glider.style.width = firstLabel.offsetWidth + 'px';
    toggle.querySelectorAll('label').forEach(l => l.classList.remove('status-active'));
    firstLabel.classList.add('status-active');

    const ratingBlock = overlay.querySelector('.add-book_rating');
    if (ratingBlock) ratingBlock.style.display = 'none';

    const starRating = overlay.querySelector('.star-rating');
    if (starRating) {
        starRating.querySelectorAll('.star-btn').forEach(btn => btn.classList.remove('star-active'));
        starRating.dataset.value = 0;
    }
}