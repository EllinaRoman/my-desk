const renderBooks = async () => {
    const books = await getAllBooks();
    const container = document.querySelector('.book-grid');

    if (books.length === 0) {
        container.innerHTML = `<div class="no-book">
          <span class="icon">📭</span>Книги не найдены. Добавьте первую!
      </div>`;
      return;
    }

    let htmlContent = '';
    books.forEach((el) => {
        let coverContent;
        if (el.cover) {
            coverContent = `<img src="${el.cover}" alt="Обложка" class="new-book_cover" />`
        } else {
            coverContent = `
            <div class="new-book_no-cover" style="background-color: ${el.accentHue}">
                <p class="no-cover_author">${el.author}</p>
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
                  <p class="new-book_author">${el.author}</p>
                </div>
                <div class="new-book_tags">
                  <p class="tag-age new-book_age">${el.age}</p>
                  ${el.series ? "<p class='tag-series new-book_series'>Серия</p>" : ''}
                  ${el.mainGenres ? el.mainGenres.map(g => `<p class="tag-genre new-book_genre">${g}</p>`).join('') : ''}
                  ${el.mainTropes ? el.mainTropes.map(t => `<p class="tag-trope new-book_trope">${t}</p>`).join('') : ''}
                  <p class="new-book_status" data-status="${el.status}">${el.statusText}</p>
                </div>
                <div class="new-book_stars">${'★'.repeat(el.rating)}${'☆'.repeat(5 - el.rating)}</div>
              </div>
            </div>
          </div>
        </div>`
    })
    container.innerHTML = htmlContent;
}
renderBooks();