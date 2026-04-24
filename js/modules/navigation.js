const navigation = document.querySelector('.navigation');
const allTitles = navigation.querySelectorAll('.navigation_title');
 const allContainers = document.querySelectorAll('.tab-content');

navigation.addEventListener('click', (e) => {

    const tab = e.target.closest('.navigation_title');
        if (!tab) return;
    if (tab.classList.contains('active_title')) return;


    allTitles.forEach(el => el.classList.remove('active_title'));
    tab.classList.add('active_title');

    allContainers.forEach(container => container.classList.add('hidden'));
    const targetId = tab.dataset.target;
    const targetContainer = document.querySelector(`#${targetId}-content`);

    if (targetContainer) {
        targetContainer.classList.remove('hidden');
    }

})