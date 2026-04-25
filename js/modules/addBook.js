import { getBookDesign } from './ui-helpers.js';
import { selectedGenres, selectedTropes } from './tags-trops.js';
import { listGenre, listTrope } from './tags-trops.js';
import { getAllBooks, saveToDB } from './storage.js';
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
    const starRating = document.querySelector('.star-rating');
    const ratingValue = +starRating.dataset.value || 0;
    const status = new FormData(formAddBook).get('add-status');

    let isValid = true;

    if (!title.value.trim()) isValid = toggleError(title, false);
    if (!author.value.trim()) isValid = toggleError(author, false);


    const seriesValue = series.value.trim();
    const numValue = num.value.trim();


    if (seriesValue) {
        if (!numValue || +numValue <= 0) {
            isValid = toggleError(num, false, !numValue ? 'Введите номер серии' : 'Номер должен быть > 0');
        } else {
            const allBooks = await getAllBooks();
            const isDuplicate = allBooks.some(book => book.series?.toLowerCase() === seriesValue.toLowerCase() && book.seriesNum === +numValue);
            if (isDuplicate) {
                isValid = toggleError(num, false, 'Номер уже занят');
            }
        }
    }

    if (status === 'completed' && ratingValue === 0) {
        starRating.closest('.add-book_rating').classList.add('is-invalid');
        isValid = false;
    }


    if (isValid) {
        const formData = new FormData(formAddBook);
        const saveBook = async (coverData) => {
            const newBook = {
                id: Date.now(),
                title: title.value.trim(),
                author: author.value.trim(),
                series: formData.get('series'),
                seriesNum: +formData.get('series-num'),
                age: formData.get('age').trim() || "0+",
                annotation: formData.get('annotation').trim() || null,
                status,
                statusText: document.querySelector(`label[for="${formAddBook.querySelector('input[name="add-status"]:checked').id}"]`).textContent.trim(),
                cover: coverData,
                accentHue: coverData ? null : getBookDesign(),
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
                await saveToDB(newBook);
                renderBooks();
            } catch (err) {
                console.error('Ошибка при сохранении в базу:', err);
            }
            resetForm(formAddBook);
        };

        const file = cover.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                saveBook(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            saveBook(null);
        }
    }
});


export const resetForm = (form) => {
    form.reset();
    const overlay = form.closest('.modal-overlay');
    const imgPreview = overlay.querySelector('.cover-preview');
    const label = overlay.querySelector('.add-book_label-cover');
    const coverText = label.querySelector('.cover-text');

    imgPreview.src = '';
    imgPreview.classList.add('hidden');
    if (coverText) {
        coverText.classList.remove('hidden');
    }

    selectedGenres.length = 0;
    selectedTropes.length = 0;
    listGenre.innerHTML = '';
    listTrope.innerHTML = '';
    listGenre.parentElement.classList.add('hidden');
    listTrope.parentElement.classList.add('hidden');
    gliderReset(form);
    setModalState(overlay, false);
};
