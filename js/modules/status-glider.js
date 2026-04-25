export const updateGliderPosition = (toggle, label) => {
    const glider = toggle.querySelector('.status-glider');
    const isLoginToggle = !!toggle.closest('.login-register_group');
    const isVertical = !isLoginToggle && window.getComputedStyle(toggle).flexDirection === 'column';

    if (isVertical) {
        glider.style.top = (label.offsetTop + 4) + 'px';
        glider.style.left = '4px';
        glider.style.height = (label.offsetHeight - 8) + 'px';
        glider.style.width = '';
    } else {
        glider.style.left = label.offsetLeft + 'px';
        glider.style.width = label.offsetWidth + 'px';
        glider.style.top = '4px';
        glider.style.height = '';
    }
};

document.addEventListener('change', (e) => {
    const toggle = e.target.closest('.status-toggle');
    const modal = e.target.closest('.modal-overlay');
    if (toggle) {
        const label = toggle.querySelector(`label[for='${e.target.id}']`);
        updateGliderPosition(toggle, label);

        const display = modal.querySelector('.add-book_rating, .book-rating_group');
        display?.classList.toggle('hidden', e.target.value !== 'completed');
        const statusActive = toggle.querySelector('.status-active');
        if (statusActive) {
            statusActive.classList.remove('status-active');
            label.classList.add('status-active');
        }
    }
});

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
        });
        stars.dataset.value = index + 1;
        stars.closest('.add-book_rating')?.classList.remove('is-invalid');
    }
});

export const gliderReset = (form) => {
    const overlay = form.closest('.modal-overlay');
    const firstLabel = overlay.querySelector('label[for="add-future"]');
    if (!firstLabel) return;

    const toggle = firstLabel.closest('.status-toggle');

    updateGliderPosition(toggle, firstLabel);

    toggle.querySelectorAll('label').forEach(l => l.classList.remove('status-active'));
    firstLabel.classList.add('status-active');

    const ratingBlock = overlay.querySelector('.add-book_rating');
    if (ratingBlock) ratingBlock.classList.add('hidden');

    const starRating = overlay.querySelector('.star-rating');
    if (starRating) {
        starRating.querySelectorAll('.star-btn').forEach(btn => btn.classList.remove('star-active'));
        starRating.dataset.value = 0;
    }
};

export const setStarRating = (container, value) => {
    const starRating = container.querySelector('.star-rating');
    if (!starRating) return;
    starRating.querySelectorAll('.star-btn').forEach((star, i) => {
        star.classList.toggle('star-active', i < value);
    });
    starRating.dataset.value = value;
};