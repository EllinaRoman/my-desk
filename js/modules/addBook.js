import { getBookDesign, compressImage } from './ui-helpers.js';
import { selectedGenres, selectedTropes, listGenre, listTrope } from './tags.js';
import { getAllBooks, saveToDB, updateFullBook } from './storage.js';
import { gliderReset } from './status-glider.js';
import { renderBooks } from './library.js';
import { setModalState } from './modals.js';

const formAddBook = document.querySelector('#modal_add-book');

const toggleError = (input, isValid, message = '') => {
    const parent = input.closest('.add-book_title-book, .add-book_author-list, .add-book_series-num-list');
    if (!parent) return;
    parent.classList.toggle('is-invalid', !isValid);
    const errorEl = parent.querySelector('.error-message');
    if (errorEl && message) errorEl.textContent = message;

    return isValid;
};

['title', 'author', 'series-num'].forEach(name => {
    const input = formAddBook.querySelector(`[name="${name}"]`);
    input?.addEventListener('input', () => toggleError(input, true));
});

formAddBook.addEventListener('submit', async (e) => {
    e.preventDefault();
    const { title, author, cover, series, 'series-num': num } = e.target.elements;
    const starRating = formAddBook.querySelector('.star-rating');
    const ratingValue = +starRating.dataset.value || 0;
    const status = new FormData(formAddBook).get('add-status');

    let isValid = true;

    if (!title.value.trim()) isValid = toggleError(title, false);
    if (!author.value.trim()) isValid = toggleError(author, false);


    const seriesValue = series.value.trim();
    const numValue = num.value.trim();
    let newAnnotation = null;

    const editId = formAddBook.closest('.modal-overlay').dataset.editId;
    const overlay = formAddBook.closest('.modal-overlay');

    if (seriesValue) {
        if (!numValue || +numValue <= 0) {
            isValid = toggleError(num, false, !numValue ? 'Введите номер серии' : 'Номер должен быть > 0');
        } else {
            const allBooks = await getAllBooks();
            const isDuplicate = allBooks.some(book => book.series?.toLowerCase() === seriesValue.toLowerCase() && book.seriesNum === +numValue && String(book.id) !== String(editId));
            if (isDuplicate) {
                toggleError(num, false, 'Номер уже занят');
                return;
            }
            if (numValue > 1) {
                const firstBook = allBooks.find(book => book.series?.toLowerCase() === seriesValue.toLowerCase() && book.seriesNum === 1);
                if (firstBook) {
                    newAnnotation = firstBook.annotation;
                }
            }
        }
    } else {
         toggleError(num, true);
    }

    if (status === 'completed' && ratingValue === 0) {
        starRating.closest('.add-book_rating').classList.add('is-invalid');
        isValid = false;
    }


    if (isValid) {
        const formData = new FormData(formAddBook);

        let annotationValue = formData.get('annotation').trim() || null;

        if (!annotationValue && newAnnotation) {
            annotationValue = newAnnotation;
        }

        const saveBook = async (coverData) => {
            const normalizedSeries = formData.get('series').trim() || null;
            const normalizedSeriesNum = normalizedSeries ? +formData.get('series-num') : null;

            const newBook = {
                id: editId ? +editId : Date.now(),
                title: title.value.trim(),
                author: author.value.trim(),
                series: normalizedSeries,
                seriesNum: normalizedSeriesNum,
                age: formData.get('age').trim() || "0+",
                annotation: annotationValue || null,
                status,
                statusText: document.querySelector(`label[for="${formAddBook.querySelector('input[name="add-status"]:checked').id}"]`).textContent.trim(),
                cover: coverData,
                accentHue: coverData ? null : (editId ? (overlay.dataset.originalHue || getBookDesign()) : getBookDesign()),
                allGenres: [...selectedGenres],
                allTropes: [...selectedTropes],
                mainGenres: Array.from(listGenre.querySelectorAll('.active-genre'))
                    .map(el => el.querySelector('.text-genre').textContent),
                mainTropes: Array.from(listTrope.querySelectorAll('.active-trope'))
                    .map(el => el.querySelector('.text-trope').textContent),
                rating: ratingValue,
                opinion: formData.get('add-opinion').trim() || null,
                notes: formData.get('add-notes').trim() || null,
            };

            try {
                if (editId) {
                    await updateFullBook(newBook);
                } else {
                    await saveToDB(newBook);
                }
                renderBooks();
            } catch (err) {
                console.error('Ошибка при сохранении в базу:', err);
            }
            resetForm(formAddBook);
        };

        const file = cover.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = async () => {
                const rawBase64 = reader.result;
                const compressedBase64 = await compressImage(rawBase64);
                saveBook(compressedBase64);
            };
            reader.readAsDataURL(file);
        } else {
            const existingCover = editId ? (overlay.dataset.originalCover || null) : null;
            saveBook(existingCover);
        }
    }
});


export const resetForm = (form) => {
    if (!form) return;

    form.reset();

    const overlay = form.closest('.modal-overlay');
    const label = overlay?.querySelector('.add-book_label-cover');

    const modalTitle = overlay?.querySelector('.add-book_title');
    const modalAddBtn = overlay?.querySelector('.btn_add-book_add');
    if (modalTitle) modalTitle.textContent = 'Новая книга';
    if (modalAddBtn) modalAddBtn.textContent = 'Добавить на полку';


    if (overlay) {
        const imgPreview = overlay?.querySelector('.cover-preview');
        overlay.dataset.editId = '';
        overlay.dataset.mode = '';

        if (imgPreview) {
            imgPreview.src = '';
            imgPreview.classList.add('hidden');
        }

        const coverText = label?.querySelector('.cover-text');
        if (coverText) {
            coverText.classList.remove('hidden');
        }

        if (typeof setModalState === 'function') {
            setModalState(overlay, false);
        }
    }

    selectedGenres.length = 0;
    selectedTropes.length = 0;

    const lists = [
        { el: typeof listGenre !== 'undefined' ? listGenre : null },
        { el: typeof listTrope !== 'undefined' ? listTrope : null }
    ];

    lists.forEach(item => {
        if (item.el) {
            item.el.innerHTML = '';
            item.el.parentElement?.classList.add('hidden');
        }
    });

    if (typeof gliderReset === 'function') {
        gliderReset(form);
    }
};
