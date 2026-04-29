import { resetForm } from './addBook.js';
import { getRandomBook } from './randomBook.js';
import { updateBookStatus, deleteBook, updateFullBook, getAllBooks } from './storage.js';
import { renderBooks } from './library.js';
import { updateGliderPosition } from './status-glider.js';
import { setupEditModal, setupEditForm } from './editBook.js';

document.addEventListener('click', async (e) => {
    const target = e.target;
    const isCloseBtn = target.closest('.close-modal');
    const isCancelBtn = target.closest('.btn_add-book_cancel');
    const isOverlayClick = target.classList.contains('modal-overlay');

    if (isCloseBtn || isCancelBtn || isOverlayClick) {
        const overlay = isOverlayClick ? target : target.closest('.modal-overlay');
        if (overlay) {
            const form = overlay.querySelectorAll('form');
            if (form.length > 0) {
                const isEditMode = overlay.dataset.mode === 'edit';

                if (overlay.dataset.mode === 'edit') {
                    overlay.dataset.mode = '';
                    delete overlay.dataset.editId;
                }

                form.forEach(f => resetForm(f));
                setModalState(overlay, false, { keepBodyLocked: isEditMode });

                if (isEditMode) {
                    const editOverlay = document.querySelector('.modal-overlay[data-modal="edit-book"]');
                    setModalState(editOverlay, true);
                }
            } else {
                setModalState(overlay, false);
            }
        }
        return;
    }

    const openBtn = e.target.closest('.btn[data-modal]');
    if (openBtn) {
        const { modal } = openBtn.dataset;

        if (modal === 'random-book') {
            getRandomBook();
        }
        const overlay = document.querySelector(`.modal-overlay[data-modal="${modal}"]`);
        if (overlay) setModalState(overlay, true);
        return;
    }

    const randomBtn = e.target.closest('.random-book_buttons .btn');
    if (randomBtn) {
        randomAction(randomBtn);
        return;
    }

    const confirmDeleteBtn = e.target.closest('.btn-confirm-delete');
    if (confirmDeleteBtn) {
        const confirmOverlay = confirmDeleteBtn.closest('.modal-overlay');
        const bookId = +confirmOverlay.dataset.bookId;
        await deleteBook(bookId);
        await renderBooks();
        setModalState(confirmOverlay, false);

        const editOverlay = document.querySelector('.modal-overlay[data-modal="edit-book"]');
        setModalState(editOverlay, false);
        return;
    }

    const confirmCancelBtn = e.target.closest('.btn-confirm-cancel');
    if (confirmCancelBtn) {
        const confirmOverlay = confirmCancelBtn.closest('.modal-overlay');
        setModalState(confirmOverlay, false);
        return;
    }

    const pencilBtn = e.target.closest('.bi-pencil');
    if (pencilBtn) {
        pencilAction(pencilBtn);
        return;
    }

    const editBtn = e.target.closest('.edit-book_controls .btn');
    if (editBtn) {
        editAction(editBtn);
        return;
    }

    const card = e.target.closest('.new-book[data-modal="edit-book"]');
    if (card) {
        const bookId = +card.dataset.id;
        const allBooks = await getAllBooks();
        const foundBook = allBooks.find(b => b.id === bookId);

        if (foundBook) {
            await setupEditModal(foundBook);
            const overlay = document.querySelector('.modal-overlay[data-modal="edit-book"]');
            if (overlay) setModalState(overlay, true);
        }
    }
});

let savedScrollY = 0;

export const setModalState = (overlay, isOpen, options = {}) => {
    if (!overlay) return;
    const { keepBodyLocked = false } = options;

    const hasOpenedModal = document.querySelector('.modal-overlay.open');

    if (isOpen) {
        if (!hasOpenedModal) {
            savedScrollY = window.scrollY;

            document.body.style.top = `-${savedScrollY}px`;
            document.body.classList.add('modal-open');
        }

        overlay.classList.add('open');

        const toggle = overlay.querySelector('.status-toggle');

        if (toggle) {
            const activeInput = toggle.querySelector('input:checked');

            if (activeInput) {
                const activeLabel = toggle.querySelector(
                    `label[for="${activeInput.id}"]`
                );

                if (activeLabel) {
                    updateGliderPosition(toggle, activeLabel);
                }
            }
        }

        return;
    }

    overlay.classList.remove('open');

    overlay.querySelectorAll('.is-invalid').forEach(el => {
        el.classList.remove('is-invalid');
    });

    const starRating = overlay.querySelector('.star-rating');

    if (starRating) {
        starRating.querySelectorAll('.star-btn').forEach(btn => {
            btn.classList.remove('star-active');
        });

        starRating.dataset.value = 0;
    }

    const stillOpenedModal = document.querySelector('.modal-overlay.open');

    if (!stillOpenedModal && !keepBodyLocked) {
        document.body.classList.remove('modal-open');
        document.body.style.top = '';

        window.scrollTo({
            top: savedScrollY,
            behavior: 'instant'
        });
    }
};

const randomAction = async (btn) => {
    const { action, id } = btn.dataset;
    const overlay = btn.closest('.modal-overlay');
    const bookId = Number(id);
    if (!bookId) return;

    if (action === 'want') {
        await updateBookStatus(bookId, 'want');
    } else if (action === 'future') {
        await updateBookStatus(bookId, 'future');
    } else {
        await updateBookStatus(bookId, 'not-reading');
    }
    await renderBooks();
    setModalState(overlay, false);
};

const editAction = async (btn) => {
    const { action, id } = btn.dataset;
    const overlay = btn.closest('.modal-overlay');
    const bookId = Number(id);
    if (!bookId) return;

    if (action === 'delete') {
        const confirmOverlay = document.querySelector('.modal-overlay[data-modal="confirm-delete"]');
        confirmOverlay.dataset.bookId = bookId;
        setModalState(confirmOverlay, true);
        return;
    } else {
        const allBooks = await getAllBooks();
        const book = allBooks.find(b => b.id === bookId);

        if (book) {
            const newStatus = overlay.querySelector('input[name="edit-status"]:checked').value;
            const newOpinion = overlay.querySelector('#edit-opinion')?.value || '';
            const newNotes = overlay.querySelector('#edit-notes')?.value || '';
            const newRating = Number(overlay.querySelector('.star-rating')?.dataset.value) || 0;

            const ratingBlock = overlay.querySelector('.book-rating_group');

            if (newStatus === 'completed' && newRating === 0) {
                ratingBlock?.classList.add('is-invalid');
                return;
            }

            const statusTextMap = {
                'want': 'Хочу', 'future': 'Потом', 'not-reading': 'Брошено',
                'reading': 'Читаю', 'completed': 'Прочитано'
            };

            const updatedBook = {
                ...book,
                status: newStatus,
                statusText: statusTextMap[newStatus] || newStatus,
                opinion: newOpinion,
                notes: newNotes,
                rating: newStatus === 'completed' ? newRating : 0
            };

            await updateFullBook(updatedBook);
        }
    }

    await renderBooks();
    setModalState(overlay, false);
};

const pencilAction = async (btn) => {
    const editOverlay = btn.closest('.modal-overlay');
    const bookId = +editOverlay.querySelector('.btn-save').dataset.id;
    const allBooks = await getAllBooks();
    const book = allBooks.find(b => b.id === bookId);

    if (book) {
        await setupEditForm(book);
        setModalState(editOverlay, false, { keepBodyLocked: true });
        const addOverlay = document.querySelector('.modal-overlay[data-modal="add-book"]');
        addOverlay.dataset.mode = 'edit';
        addOverlay.dataset.editId = bookId;
        setModalState(addOverlay, true, { keepBodyLocked: true });
    }
};