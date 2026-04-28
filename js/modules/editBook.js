import { updateGliderPosition, setStarRating } from './status-glider.js';
import { selectedGenres, selectedTropes, listGenre, listTrope } from './tags.js';

const toggleBlock = (el, show) => {
    el.classList.toggle('hidden', !show);
};

const setTextBlock = (el, value) => {
    const hasValue = !!value;
    el.classList.toggle('hidden', !hasValue);
    el.textContent = hasValue ? value : '';
};

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
        book.series ? `<div class="tag-series">${book.series} #${book.seriesNum}</div>` : '',
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
        noCover.querySelector('.edit_no-author').textContent = book.author;
        noCover.querySelector('.edit_no-title').textContent = book.title;
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
            setStarRating(modal, book.rating || 0);
        }
    }

    const opinion = modal.querySelector('#edit-opinion');
    const notes = modal.querySelector('#edit-notes');
    if (opinion) opinion.value = book.opinion || '';
    if (notes) notes.value = book.notes || '';


    const editButtons = modal.querySelectorAll('.edit-book_controls .btn');

    editButtons.forEach(btn => {
        btn.dataset.id = book.id;
    });
};

export const setupEditForm = async (book) => {
    const modal = document.querySelector('.modal-overlay[data-modal="add-book"]');
    if (!modal) return;

    const modalTitle = modal.querySelector('.add-book_title');
    const modalAddBtn = modal.querySelector('.btn_add-book_add');
    modalTitle.textContent = 'Редактировать книгу';
    modalAddBtn.textContent = 'Сохранить изменения'


    const title = modal.querySelector('[name="title"]');
    const author = modal.querySelector('[name="author"]');
    const series = modal.querySelector('[name="series"]');
    const seriesNum = modal.querySelector('[name="series-num"]');
    const age = modal.querySelector('[name="age"]');
    const annotation = modal.querySelector('[name="annotation"]');
    const imgPreview = modal.querySelector('.cover-preview');
    const coverText = modal.querySelector('.cover-text');


    title.value = book.title;
    author.value = book.author;
    series.value = book.series;
    seriesNum.value = book.seriesNum;
    age.value = book.age;
    annotation.value = book.annotation;

    if (book.cover) {
        imgPreview.src = book.cover;
        imgPreview.classList.remove('hidden');
        coverText.classList.add('hidden');
    }

    modal.dataset.originalCover = book.cover || '';
    modal.dataset.originalHue = book.accentHue || '';


    selectedGenres.length = 0;
    selectedTropes.length = 0;
    listGenre.innerHTML = '';
    listTrope.innerHTML = '';
    listGenre.parentElement.classList.add('hidden');
    listTrope.parentElement.classList.add('hidden');

    book.allGenres.forEach(g => {
        selectedGenres.push(g);
        listGenre.parentElement.classList.remove('hidden');
        const newBtn = document.createElement("button");
        newBtn.type = "button";
        newBtn.className = ('btn genre-btn tag-genre');

        if (book.mainGenres.includes(g)) {
            newBtn.classList.add('active-genre');
        };

        newBtn.innerHTML = `<span class="text-genre">${g}</span>
                        <span class="delete-genre">&times;</span>`;
        listGenre.append(newBtn)
    });

    book.allTropes.forEach(g => {
        selectedTropes.push(g);
        listTrope.parentElement.classList.remove('hidden');
        const newBtn = document.createElement("button");
        newBtn.type = "button";
        newBtn.className = ('btn trope-btn tag-trope');

        if (book.mainTropes.includes(g)) {
            newBtn.classList.add('active-trope');
        };

        newBtn.innerHTML = `<span class="text-trope">${g}</span>
                        <span class="delete-trope">&times;</span>`;
        listTrope.append(newBtn)
    });


    const status = modal.querySelector(`input[name="add-status"][value="${book.status}"]`);
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
            setStarRating(modal, book.rating || 0);
            const opinion = modal.querySelector('#add-opinion');
            const notes = modal.querySelector('#add-notes');
            if (opinion) opinion.value = book.opinion || '';
            if (notes) notes.value = book.notes || '';
        }
    }
};