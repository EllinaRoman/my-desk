import { getAllBooks } from './storage.js';
import { displayBooks } from './library.js';

const searchInput = document.querySelector('#search');

const activeFilters = {
    status: 'all',
    author: 'all',
    age: 'all',
    series: 'all',
    title: ''
};

const fieldMap = {
    'status_filter': 'status',
    'author_filter': 'author',
    'age_filter': 'age',
    'series_filter': 'series',
};

const applyFilters = (allBooks) => {
    let result = allBooks;


    Object.entries(fieldMap).forEach(([, bookField]) => {
        if (activeFilters[bookField] !== 'all') {
            result = result.filter(book => book[bookField]?.toLowerCase() === activeFilters[bookField].toLowerCase())
        }
    })

    if (activeFilters.title) {
        result = result.filter(book => book.title?.toLowerCase().includes(activeFilters.title));
    }

    displayBooks(result);
}

document.addEventListener('change', async (e) => {
    const allBooks = await getAllBooks();
    const filterKey = fieldMap[e.target.id];

    if (filterKey) {
        activeFilters[filterKey] = e.target.value;
        applyFilters(allBooks);
    }
});

searchInput.addEventListener('input', async (e) => {
    const allBooks = await getAllBooks();
    
    activeFilters.title = e.target.value.toLowerCase().trim();
    applyFilters(allBooks);
});