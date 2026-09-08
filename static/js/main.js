// AI_DAIDJEST — main.js
// Три простые функции: счётчики статистики, фильтр карточек, кнопка «Скопировать».

// 1. Анимация счётчиков статистики при загрузке страницы
// 2. Фильтр: кнопки в липкой панели + кликабельные метки на карточках
// 3. Кнопка «Скопировать текст» в блоке «Приведи друга»
document.addEventListener('DOMContentLoaded', () => {
    const counters = document.querySelectorAll('.stat-value');
    const speed = 40; // чем больше число, тем плавнее (медленнее)

    counters.forEach(counter => {
        const target = +counter.dataset.count;
        const suffix = counter.dataset.suffix || '';
        let current = 0;

        const update = () => {
            current += Math.ceil(target / speed);
            if (current >= target) {
                counter.textContent = target.toLocaleString('ru-RU') + suffix;
            } else {
                counter.textContent = current.toLocaleString('ru-RU') + suffix;
                setTimeout(update, 15);
            }
        };

        update();
    });

    // 2. Фильтр карточек по категориям
    const filterButtons = document.querySelectorAll('.filter');
    const cards = document.querySelectorAll('.card');
    const countLine = document.getElementById('filter-count');

    // Главная функция: показать только карточки нужной категории
    function applyFilter(filter) {
        // подсвечиваем активную кнопку
        filterButtons.forEach(b => b.classList.toggle('active', b.dataset.filter === filter));

        // показываем / прячем карточки и считаем видимые
        let visible = 0;
        cards.forEach(card => {
            const show = filter === 'all' || card.dataset.category === filter;
            card.style.display = show ? '' : 'none';
            if (show) visible++;
        });

        // строка «Показано X из Y»
        countLine.textContent = `Показано ${visible} из ${cards.length}`;
    }

    // Клики по кнопкам липкой панели
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => applyFilter(btn.dataset.filter));
    });

    // Клики по меткам категорий на самих карточках:
    // фильтруем и плавно прокручиваем к началу раздела
    document.querySelectorAll('[data-goto-filter]').forEach(badge => {
        badge.addEventListener('click', () => {
            applyFilter(badge.dataset.gotoFilter);
            document.getElementById('cards').scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Показываем счётчик при загрузке
    applyFilter('all');

    // 3. Кнопка «Скопировать текст» в блоке «Приведи друга»
    const copyBtn = document.getElementById('copy-btn');
    const shareText = document.getElementById('share-text');

    if (copyBtn && shareText) {
        copyBtn.addEventListener('click', async () => {
            const text = shareText.textContent.trim();
            try {
                await navigator.clipboard.writeText(text);
            } catch (e) {
                // запасной способ для старых браузеров
                const tmp = document.createElement('textarea');
                tmp.value = text;
                document.body.appendChild(tmp);
                tmp.select();
                document.execCommand('copy');
                tmp.remove();
            }
            copyBtn.textContent = '✅ Скопировано!';
            setTimeout(() => { copyBtn.textContent = '📋 Скопировать текст'; }, 2000);
        });
    }
});
