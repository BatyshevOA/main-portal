document.addEventListener('DOMContentLoaded', function() {
    // Находим элементы нового меню
    const toggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.main-menu'); // Изменено с 'nav' на '.main-menu' для точного соответствия CSS
    const menuGroups = document.querySelectorAll('.menu-group');

    // 1. Открытие и закрытие основного меню на мобильных устройствах
    if (toggle && nav) {
        toggle.addEventListener('click', function() {
            nav.classList.toggle('active');
            toggle.classList.toggle('active'); // Добавляет класс для анимации превращения "гамбургера" в крестик
            
            // Обновляем атрибут для доступности (помогает людям с нарушениями зрения, использующим читалки экрана)
            const isExpanded = nav.classList.contains('active');
            toggle.setAttribute('aria-expanded', isExpanded);
        });
    }

    // 2. Закрытие меню при клике в любую свободную область экрана (значительно улучшает UX на телефоне)
    document.addEventListener('click', function(event) {
        if (nav && nav.classList.contains('active') && 
            !nav.contains(event.target) && 
            !toggle.contains(event.target)) {
            nav.classList.remove('active');
            toggle.classList.remove('active');
            toggle.setAttribute('aria-expanded', 'false');
        }
    });

    // 3. Превращение групп меню в "аккордеон" на мобильных устройствах
    // На сенсорных экранах нет мыши, чтобы сделать "hover" (наведение), поэтому подменю должны открываться по клику
    menuGroups.forEach(group => {
        const title = group.querySelector('.group-title');
        if (title) {
            title.addEventListener('click', function(e) {
                // Эта логика срабатывает только на мобильных устройствах (ширина экрана 900px и меньше)
                if (window.innerWidth <= 900) {
                    e.preventDefault(); 
                    group.classList.toggle('open');
                }
            });
        }
    });
});
