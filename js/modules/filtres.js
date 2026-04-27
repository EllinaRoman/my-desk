import { getAllBooks } from './storage.js';
import { displayBooks } from './library.js';

const searchInput = document.querySelector('#search');

const activeFilters = {
    status: 'all',
    author: 'all',
    age: 'all',
    series: 'all',
    genres: 'all',
    tropes: 'all',
    title: ''
};

const fieldMap = {
    'status_filter': 'status',
    'author_filter': 'author',
    'age_filter': 'age',
    'series_filter': 'series',
    'genres_filter': 'genre',
    'tropes_filter': 'trope'
};

const applyFilters = (allBooks) => {
    let result = allBooks;

    Object.entries(fieldMap).forEach(([_, filterKey]) => {
        const filterValue = activeFilters[filterKey];
        if (filterValue !== 'all') {
            if (filterKey === 'genre' || filterKey === 'trope') {
                const bookField = filterKey === 'genre' ? 'allGenres' : 'allTropes';
                result = result.filter(book => book[bookField]?.some(item => item.toLowerCase() === filterValue.toLowerCase()));
            } else {
                result = result.filter(book => book[filterKey]?.toLowerCase() === filterValue.toLowerCase());
            }
        }
    });

    if (activeFilters.title) {
        result = result.filter(book => book.title?.toLowerCase().includes(activeFilters.title));
    }

    displayBooks(result);
};

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