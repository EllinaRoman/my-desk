import { getAllBooks } from './storage.js';

const updateMyLists = (allBooks) => {
  const setSeries = new Set();
  const setGenres = new Set();

  allBooks.forEach((book) => {
    if (book.series) setSeries.add(book.series.trim());

    if (book.allGenres) {
      book.allGenres.forEach(g => setGenres.add(g.trim()));
    }
  });

  const listToUpdate = [
    { element: document.querySelector('#series-list'), data: setSeries },
    { element: document.querySelector('#genres-list'), data: setGenres },
    { element: document.querySelector('#series_filter'), data: setSeries, isSelect: true },
    { element: document.querySelector('#genres_filter'), data: setGenres, isSelect: true },
  ];

  listToUpdate.forEach(({ element, data, isSelect }) => {
    if (element) {
      const firstOption = isSelect ? '<option value="all">Все</option>' : '';
      element.innerHTML = firstOption + Array.from(data).map(val =>
        isSelect ? `<option value="${val}">${val}</option>` : `<option value="${val}">`
      ).join('');
    }
  });

};


export const displayBooks = (books) => {
  const container = document.querySelector('.book-grid');

  if (books.length === 0) {
    container.innerHTML = `<div class="no-book">
            <span class="icon">📭</span>Игры не найдены. Добавьте первую!
        </div>`;
    document.getElementById('app-loader')?.style.setProperty('display', 'none');
    return;
  }

  let htmlContent = '';
  books.forEach((el) => {
    const displayGenres = (el.mainGenres && el.mainGenres.length > 0) ? el.mainGenres : (el.allGenres && el.allGenres.length > 0) ? el.allGenres.slice(0, 2) : [];

    let coverContent;
    if (el.cover) {
      coverContent = `<img src="${el.cover}" alt="Обложка" class="new-book_cover" />`;
    } else {
      const hueValue = typeof el.accentHue === 'string'
        ? (el.accentHue.match(/\d+/) ? el.accentHue.match(/\d+/)[0] : 280)
        : (el.accentHue || 280);

      coverContent = `
        <div class="new-book_no-cover" style="--book-hue: ${hueValue}">
            <p class="no-cover_title">${el.title}</p>
        </div>
    `;
    }
    htmlContent += `<div class="new-book" data-status="${el.status}" data-id="${el.id}" data-modal="edit-book">
          <div class="new-book_bar"></div>
          <div class="new-book_main">
            ${coverContent}
            <div class="new-book_main-info">
              <div class="new-book_info">
                <div class="new-book_text">
                  <p class="new-book_title">${el.title}</p>
                </div>
                <div class="new-book_tags">
                  ${el.series ? "<p class='tag-series new-book_series'>Серия</p>" : ''}
                  ${displayGenres.map(g => `<p class="tag-genre new-book_genre">${g}</p>`).join('')}
                  <p class="new-book_status" data-status="${el.status}">${el.statusText}</p>
                </div>
                ${el.status === 'completed' && el.rating > 0 ? `
                <div class="new-book_stars">${'★'.repeat(el.rating)}${'☆'.repeat(5 - el.rating)}</div>` : ''}
            </div>
          </div>
          </div>
        </div>`;
  });
  container.innerHTML = htmlContent;

  document.getElementById('app-loader')?.style.setProperty('display', 'none');
};

export const renderBooks = async () => {
  const books = await getAllBooks();
  updateMyLists(books);
  displayBooks(books);
};