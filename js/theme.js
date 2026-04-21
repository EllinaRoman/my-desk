const btnTheme = document.querySelector('.btn_change-theme');
const html = document.documentElement;

const applyTheme = (theme) => {
    html.dataset.theme = theme;
    btnTheme.textContent = theme === "dark" ? '🌙' : '🌸';
}

const savedTheme = localStorage.getItem('theme') || 'light';
applyTheme(savedTheme);

btnTheme.addEventListener('click', () => {
    const newTheme = html.dataset.theme === "dark" ? 'light' : "dark";
    applyTheme(newTheme);
    localStorage.setItem('theme', newTheme);
})
