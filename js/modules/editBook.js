import { updateGliderPosition, setStarRating } from './status-glider.js';
import { getAllBooks } from './storage.js';

const toggleBlock = (el, show) => {
    el.classList.toggle('hidden', !show);
}

const setTextBlock = (el, value) => {
    const hasValue = !!value;
    el.classList.toggle('hidden', !hasValue);
    el.textContent = hasValue ? value : '';
}

export const setupEditModal = async (book) => {
    const modal = document.querySelector('.modal-overlay[data-modal="edit-book"]');
    if (!modal) return;

    const title = modal.querySelector('.edit-book_title');
    const author = modal.querySelector('.edit-book_author');
    const cover = modal.querySelector('.edit-book_cover');
    const noCover = modal.querySelector('.edit-book_no-cover');
    const tags = modal.querySelector('.edit-book_tags');
    const annotation = modal.querySelector('.edit-book_book-annotation');

    title.textContent = book.title;
    author.textContent = book.author;

    tags.innerHTML = [
        `<div class="tag-age">${book.age}</div>`,
        book.series ? `<div class="tag-series">${book.series} ${book.seriesNum}</div>` : '',
        ...book.allGenres.map(g => `<div class="tag-genre">${g}</div>`),
        ...book.allTropes.map(t => `<div class="tag-trope">${t}</div>`)
    ].join('');


    const hasCover = !!book.cover;
    toggleBlock(cover, hasCover);
    toggleBlock(noCover, !hasCover);

    if (hasCover) {
        cover.src = book.cover;
    } else {
        noCover.style.setProperty('--book-hue', book.accentHue);
        noCover.querySelector('.no-cover_author').textContent = book.author;
        noCover.querySelector('.no-cover_title').textContent = book.title;
    }

    setTextBlock(annotation, book.annotation);

    const status = modal.querySelector(`input[name="edit-status"][value="${book.status}"]`);
    if (status) {
        status.checked = true;
        const toggle = modal.querySelector('.status-toggle');
        const label = modal.querySelector(`label[for="${status.id}"]`);

        updateGliderPosition(toggle, label);
        toggle.querySelectorAll('label').forEach(l => l.classList.remove('status-active'));
        label.classList.add('status-active');

        const ratingBlock = modal.querySelector('.book-rating_group');
        if (ratingBlock) {
            ratingBlock.classList.toggle('hidden', book.status !== 'completed');
        }

        if (book.status === 'completed') {
            setStarRating(modal, book.rating);
        }
    }


    const editButtons = modal.querySelectorAll('.edit-book_controls .btn');

    editButtons.forEach(btn => {
        btn.dataset.id = book.id;
    })
}
