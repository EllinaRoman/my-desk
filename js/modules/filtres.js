import { getAllBooks } from './storage.js';
import { displayBooks } from './library.js';

const searchInput = document.querySelector('#search');

const activeFilters = {
    status: 'all',
    series: 'all',
    genre: 'all',
    title: ''
};

const fieldMap = {
    'status_filter': 'status',
    'series_filter': 'series',
    'genres_filter': 'genre',
};

const normalizeFilterValue = (value) => String(value ?? '').trim();

const applyFilters = (allBooks) => {
    let result = allBooks;

    Object.values(fieldMap).forEach((filterKey) => {
        const filterValue = normalizeFilterValue(activeFilters[filterKey]).toLowerCase();
        if (filterValue && filterValue !== 'all') {
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
        const value = normalizeFilterValue(e.target.value).toLowerCase();
        activeFilters[filterKey] = value === 'all' || !value ? 'all' : value;
        applyFilters(allBooks);
    }
});

searchInput.addEventListener('input', async (e) => {
    const allBooks = await getAllBooks();

    activeFilters.title = e.target.value.toLowerCase().trim();
    applyFilters(allBooks);
});