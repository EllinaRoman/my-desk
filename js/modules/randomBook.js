import { getAllBooks } from './storage.js';

const toggleBlock = (el, show) => {
    el.classList.toggle('hidden', !show);
};

const setTextBlock = (el, value) => {
    const hasValue = !!value;
    el.classList.toggle('hidden', !hasValue);
    el.textContent = hasValue ? value : '';
};

const getTagsToDisplay = (main, all) => {
    if (main && main.length > 0) return main;
    return all ? all.slice(0, 2) : [];
};


export const getRandomBook = async () => {
    const allBooks = await getAllBooks();
    const noBook = document.querySelector('.modal_random-book_none');
    const content = document.querySelector('.modal_random-book_all');

    const books = allBooks.filter(book =>
        book.status !== 'completed' && book.status !== 'reading' && book.status !== 'not-reading'
    );

    const hasBooks = books.length > 0;
    toggleBlock(content, hasBooks);
    toggleBlock(noBook, !hasBooks);

    if (!hasBooks) return;

    let randomBook = books[Math.floor(Math.random() * books.length)];
    const seriesListAll = content.querySelector('.random-book_series-group');
    toggleBlock(seriesListAll, !!randomBook.series);
    if (randomBook.series) {
        const allSeries = allBooks.filter(el =>
            el.series?.toLowerCase() === randomBook.series.toLowerCase()
        );

        const sortSeries = allSeries.sort((a, b) => a.seriesNum - b.seriesNum);
        randomBook = sortSeries.find(el => el.status !== 'completed' && el.status !== 'reading');

        if (!randomBook) {
            return getRandomBook();
        }


        const seriesList = content.querySelector('.random-book_all-series');
        const seriesTitle = content.querySelector('.random-book_series-title');
        seriesTitle.textContent = `Это ${randomBook.seriesNum} игра серии "${randomBook.series}"`;
        seriesList.innerHTML = sortSeries.map((el) => {
            const isActive = el.id === randomBook.id;
            const isCompleted = el.status === 'completed' ? '(✓)' : '';
            const numClass = isActive ? 'random-book_main-number' : '';
            const titleClass = isActive ? 'random-book_main-book' : '';

            return `<li class="random-book_series-quantity">
                    <p
                      class="random-book_series-number ${numClass}"
                    >${el.seriesNum}</p>
                    <p
                      class="random-book_series-title-book ${titleClass}"
                    >${el.title} ${isCompleted}</p>
                  </li> `;
        }).join('');

    }

    const title = content.querySelector('.random-book_book-title');
    const cover = content.querySelector('.random-book_cover');
    const noCover = content.querySelector('.random-book_no-cover');
    const tags = content.querySelector('.random-book_tags');

    title.textContent = randomBook.title;

    const finalGenres = getTagsToDisplay(randomBook.mainGenres, randomBook.allGenres);

    tags.innerHTML = [
        ...finalGenres.map(g => `<div class="tag-genre">${g}</div>`)
    ].join('');


    const hasCover = !!randomBook.cover;
    toggleBlock(cover, hasCover);
    toggleBlock(noCover, !hasCover);

    if (hasCover) {
        cover.src = randomBook.cover;
    } else {
        noCover.style.setProperty('--book-hue', randomBook.accentHue);
        noCover.querySelector('.no-cover_title').textContent = randomBook.title;
    }

    const randomButtons = content.querySelectorAll('.random-book_buttons .btn');

    randomButtons.forEach(btn => {
        btn.dataset.id = randomBook.id;
    });
};
