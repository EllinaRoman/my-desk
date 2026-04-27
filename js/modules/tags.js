export const selectedGenres = [];
export const selectedTropes = [];
const btnAddGenres = document.querySelector('#add_genre');
export const listGenre = document.querySelector('.genre');
const btnAddTropes = document.querySelector('#add_trope');
export const listTrope = document.querySelector('.trope');

export const addTag = (input, storage, list, itemClass, textClass, deleteClass) => {
    const value = input.value;
    if (value.trim()) {
        storage.push(value);
        list.classList.remove('hidden');
        const newBtn = document.createElement("button");
        newBtn.type = "button";
        newBtn.className = (itemClass);
        newBtn.innerHTML = `<span class="${textClass}">${value}</span>
                        <span class="${deleteClass}">&times;</span>`;
        const innerList = list.querySelector('.genre, .trope');
        innerList.append(newBtn);
        input.value = '';
    }
};

export const clickTag = (e, storage, list, activeClass, itemSelector, textSelector, deleteSelector) => {
    const deleteBtn = e.target.closest(deleteSelector);
    if (deleteBtn) {
        const btn = deleteBtn.closest(itemSelector);
        const text = btn.querySelector(textSelector).textContent;
        const index = storage.indexOf(text);
        if (index !== -1) {
            storage.splice(index, 1);
        }
        btn.remove();
        if (storage.length === 0) {
            list.parentElement.classList.add('hidden');
        }
    } else {
        const mainBtn = e.target.closest(itemSelector);
        if (mainBtn) {
            if (mainBtn.classList.contains(activeClass)) {
                mainBtn.classList.toggle(activeClass);
            } else {
                if (list.querySelectorAll(`.${activeClass}`).length < 2) {
                    mainBtn.classList.toggle(activeClass);
                }
            }
        }
    }
};


btnAddGenres.addEventListener('click', () => {
    const input = document.querySelector('.add-book_new-genre');
    const container = document.querySelector('.add-genre');
    addTag(input, selectedGenres, container, 'btn genre-btn tag-genre', 'text-genre', 'delete-genre');
});

listGenre.addEventListener('click', (e) => {
    clickTag(e, selectedGenres, listGenre, 'active-genre', '.genre-btn', '.text-genre', '.delete-genre');
});


btnAddTropes.addEventListener('click', () => {
    const input = document.querySelector('.add-book_new-trope');
    const container = document.querySelector('.add-trope');
    addTag(input, selectedTropes, container, 'btn trope-btn tag-trope', 'text-trope', 'delete-trope');
});

listTrope.addEventListener('click', (e) => {
    clickTag(e, selectedTropes, listTrope, 'active-trope', '.trope-btn', '.text-trope', '.delete-trope');
});