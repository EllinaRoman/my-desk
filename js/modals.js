document.addEventListener('click', async (e) => {
    const target = e.target;
    const isCloseBtn = target.closest('.close-modal');
    const isCancelBtn = target.closest('.btn_add-book_cancel');
    const isOverlayClick = target.classList.contains('modal-overlay');

    if (isCloseBtn || isCancelBtn || isOverlayClick) {
        const overlay = isOverlayClick ? target : target.closest('.modal-overlay');
        if (overlay) {
            const form = overlay.querySelector('form');
            if (form) {
                resetForm(form);
            } else {
                setModalState(overlay, false);
            }
        }
        return;
    }

    const openBtn = e.target.closest('[data-modal]');
    if (openBtn) {
        const { modal, id } = openBtn.dataset;

        if (modal === 'edit-book' && id) {
            await fillEditForm(id);
        }

        const overlay = document.querySelector(`.modal-overlay[data-modal="${modal}"]`);
        if (overlay) setModalState(overlay, true);
        return;
    }
})

const setModalState = (overlay, isOpen) => {
    overlay.classList.toggle('open', isOpen);
    document.body.classList.toggle('modal-open', isOpen);

    if (!isOpen) {
        overlay.querySelectorAll('.is-invalid').forEach(el => {
            el.classList.remove('is-invalid');
        })
    }
}


