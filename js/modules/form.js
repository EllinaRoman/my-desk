import { getBookDesign } from './ui-helpers.js';
import { selectedGenres, selectedTropes } from './tags-trops.js';
import { listGenre, listTrope } from './tags-trops.js';
import { saveToDB } from './storage.js';
import { gliderReset } from './status-glider.js';
import { renderBooks } from './library.js';
import { setModalState } from './modals.js';

const formAddBook = document.querySelector('#modal_add-book');

formAddBook.addEventListener('submit', (e) => {
    e.preventDefault();
    const { title, author, cover } = e.target.elements;
    const starRating = document.querySelector('.star-rating');
    const ratingValue = +starRating.dataset.value || 0;
    let isValid = true;
    [title, author].forEach(input => {
        input.parentElement.classList.remove('is-invalid');
    });
    if (!title.value.trim()) {
        const parent = title.closest('.add-book_title-book');
        parent.classList.add('is-invalid');
        isValid = false;
    }
    if (!author.value.trim()) {
        const parent = author.closest('.add-book_author-list');
        parent.classList.add('is-invalid');
        isValid = false;
    }
    const status = new FormData(formAddBook).get('add-status');
    if (status === 'completed' && ratingValue === 0) {
        starRating.closest('.add-book_rating').classList.add('is-invalid');
        isValid = false;
    }


    if (isValid) {
        const formData = new FormData(formAddBook);
        const ageValue = formData.get('age').trim();
        const saveBook = async (coverData) => {
            const newBook = {
                id: Date.now(),
                title: formData.get('title'),
                author: formData.get('author'),
                series: formData.get('series'),
                seriesNum: formData.get('series-num'),
                age: ageValue === "" ? "0+" : ageValue,
                annotation: formData.get('annotation'),
                status: formData.get('add-status'),
                statusText: document.querySelector(`label[for="${formAddBook.querySelector('input[name="add-status"]:checked').id}"]`).textContent.trim(),
                cover: coverData,
                accentHue: coverData ? null : getBookDesign(),
                allGenres: [...selectedGenres],
                allTropes: [...selectedTropes],
                mainGenres: Array.from(listGenre.querySelectorAll('.active-genre'))
                    .map(el => el.querySelector('.text-genre').textContent),
                mainTropes: Array.from(listTrope.querySelectorAll('.active-trope'))
                    .map(el => el.querySelector('.text-trope').textContent),
                rating: +document.querySelector('.star-rating').dataset.value || 0,
                opinion: formData.get('add-opinion'),
                notes: formData.get('add-notes'),
            };
            console.log('Объект книги готов:', newBook);

            try {
                await saveToDB(newBook);
                console.log('Книга успешно сохранена в IndexedDB!');
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
})

export const resetForm = (form) => {
    form.reset();
    const overlay = form.closest('.modal-overlay');
    const imgPreview = overlay.querySelector('.cover-preview');
    const label = overlay.querySelector('.add-book_label-cover');

    imgPreview.src = '';
    imgPreview.style.display = "none";
    label.style.fontSize = '0.8rem';

    selectedGenres.length = 0;
    selectedTropes.length = 0;
    listGenre.innerHTML = '';
    listTrope.innerHTML = '';
    listGenre.parentElement.style.display = 'none';
    listTrope.parentElement.style.display = 'none';
    gliderReset(form);
    setModalState(overlay, false);
}
