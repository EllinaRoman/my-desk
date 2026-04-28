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

const editStatusAndRating = (modal, book, statusInputName) => {
    const status = modal.querySelector(`input[name="${statusInputName}-status"][value="${book.status}"]`);
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
            const opinion = modal.querySelector(`#${statusInputName}-opinion`);
            const notes = modal.querySelector(`#${statusInputName}-notes`);
            if (opinion) opinion.value = book.opinion || '';
            if (notes) notes.value = book.notes || '';
        }
    }
};

const addTagToList = (values, storage, list, itemClass, textClass, deleteClass, activeClass, mainTags) => {
    values.forEach(el => {
        storage.push(el);
        list.parentElement.classList.remove('hidden');
        const newBtn = document.createElement("button");
        newBtn.type = "button";
        newBtn.className = (`btn ${itemClass}`);

        if (mainTags?.includes(el)) {
            newBtn.classList.add(`${activeClass}`);
        };

        newBtn.innerHTML = `<span class="${textClass}">${el}</span>
                        <span class="${deleteClass}">&times;</span>`;
        list.append(newBtn);
    });
};

export const setupEditModal = (book) => {
    const modal = document.querySelector('.modal-overlay[data-modal="edit-book"]');
    if (!modal) return;

    const elements = {
        title: modal.querySelector('.edit-book_title'),
        author: modal.querySelector('.edit-book_author'),
        cover: modal.querySelector('.edit-book_cover'),
        noCover: modal.querySelector('.edit-book_no-cover'),
        tags: modal.querySelector('.edit-book_tags'),
        annotation: modal.querySelector('.edit-book_book-annotation')
    };

    elements.title.textContent = book.title;
    elements.author.textContent = book.author;

    elements.tags.innerHTML = [
        `<div class="tag-age">${book.age}</div>`,
        book.series ? `<div class="tag-series">${book.series} #${book.seriesNum}</div>` : '',
        ...book.allGenres.map(g => `<div class="tag-genre">${g}</div>`),
        ...book.allTropes.map(t => `<div class="tag-trope">${t}</div>`)
    ].join('');

    const hasCover = !!book.cover;
    toggleBlock(elements.cover, hasCover);
    toggleBlock(elements.noCover, !hasCover);

    if (hasCover) {
        elements.cover.src = book.cover;
    } else {
        elements.noCover.style.setProperty('--book-hue', book.accentHue);
        elements.noCover.querySelector('.edit_no-author').textContent = book.author;
        elements.noCover.querySelector('.edit_no-title').textContent = book.title;
    }

    setTextBlock(elements.annotation, book.annotation);
    editStatusAndRating(modal, book, 'edit');

    const editButtons = modal.querySelectorAll('.edit-book_controls .btn');

    editButtons.forEach(btn => {
        btn.dataset.id = book.id;
    });
};

export const setupEditForm = (book) => {
    const modal = document.querySelector('.modal-overlay[data-modal="add-book"]');
    if (!modal) return;

    const modalTitle = modal.querySelector('.add-book_title');
    const modalAddBtn = modal.querySelector('.btn_add-book_add');
    modalTitle.textContent = 'Редактировать книгу';
    modalAddBtn.textContent = 'Сохранить изменения';

    const imgPreview = modal.querySelector('.cover-preview');
    const coverText = modal.querySelector('.cover-text');


    const fields = {
        'title': 'title',
        'author': 'author',
        'series': 'series',
        'series-num': 'seriesNum',
        'age': 'age',
        'annotation': 'annotation'
    };

    Object.entries(fields).forEach(([name, key]) => {
        const input = modal.querySelector(`[name="${name}"]`);
        if (input) {
            input.value = book[key] ?? '';
        }
    });

    const hasCover = !!book.cover;
    imgPreview.src = book.cover || '';
    imgPreview.classList.toggle('hidden', !hasCover);
    coverText.classList.toggle('hidden', hasCover);

    modal.dataset.originalCover = book.cover || '';
    modal.dataset.originalHue = book.accentHue || '';


    selectedGenres.length = 0;
    selectedTropes.length = 0;
    listGenre.innerHTML = '';
    listTrope.innerHTML = '';
    listGenre.parentElement.classList.add('hidden');
    listTrope.parentElement.classList.add('hidden');

    addTagToList(book.allGenres, selectedGenres, listGenre, 'genre-btn tag-genre', 'text-genre', 'delete-genre', 'active-genre', book.mainGenres);
    addTagToList(book.allTropes, selectedTropes, listTrope, 'trope-btn tag-trope', 'text-trope', 'delete-trope', 'active-trope', book.mainTropes);

    editStatusAndRating(modal, book, 'add');
};