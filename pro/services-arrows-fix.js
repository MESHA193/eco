// ===== ИСПРАВЛЕНИЕ СТРЕЛОК КАРУСЕЛИ УСЛУГ ===== 

// Улучшенная функция для обновления видимости стрелок услуг
function updateServicesArrowsFixed() {
    const carousel = document.getElementById('services-grid');
    const prevArrow = document.querySelector('.services-nav-arrow.prev');
    const nextArrow = document.querySelector('.services-nav-arrow.next');

    if (!carousel || !prevArrow || !nextArrow) {
        console.log('Элементы карусели услуг не найдены');
        return;
    }

    const scrollLeft = carousel.scrollLeft;
    const cardWidth = 280;
    const gap = 24;
    const cardWithGap = cardWidth + gap;
    const totalCards = carousel.children.length;

    // Вычисляем текущую позицию карточки с учетом центрирования
    // Учитываем начальный padding для центрирования первой карточки
    const initialPadding = window.innerWidth <= 768 ? (window.innerWidth / 2 - 140) : 0;
    const adjustedScrollLeft = scrollLeft + initialPadding;
    const currentCardIndex = Math.round(adjustedScrollLeft / cardWithGap);

    console.log('Услуги - scrollLeft:', scrollLeft, 'adjustedScrollLeft:', adjustedScrollLeft, 'currentCardIndex:', currentCardIndex, 'totalCards:', totalCards);

    // Скрываем левую стрелку если на первой карточке (индекс 0)
    if (currentCardIndex <= 0) {
        prevArrow.classList.add('hidden');
        console.log('Скрываем левую стрелку услуг - первая карточка');
    } else {
        prevArrow.classList.remove('hidden');
        console.log('Показываем левую стрелку услуг');
    }

    // Скрываем правую стрелку если на последней карточке
    if (currentCardIndex >= totalCards - 1) {
        nextArrow.classList.add('hidden');
        console.log('Скрываем правую стрелку услуг - последняя карточка');
    } else {
        nextArrow.classList.remove('hidden');
        console.log('Показываем правую стрелку услуг');
    }
}

// Улучшенная функция прокрутки карусели услуг
function scrollServicesCarouselFixed(direction) {
    const carousel = document.getElementById('services-grid');
    if (!carousel) {
        console.log('Карусель услуг не найдена');
        return;
    }

    const cardWidth = 280;
    const gap = 24;
    const scrollDistance = cardWidth + gap;

    if (direction === 'next') {
        carousel.scrollBy({
            left: scrollDistance,
            behavior: 'smooth'
        });
    } else if (direction === 'prev') {
        carousel.scrollBy({
            left: -scrollDistance,
            behavior: 'smooth'
        });
    }

    // Обновляем стрелки после прокрутки с увеличенной задержкой
    setTimeout(() => updateServicesArrowsFixed(), 500);
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function () {
    setTimeout(() => {
        console.log('Инициализация исправленной карусели услуг...');

        // Заменяем функции onclick на кнопках
        const prevBtn = document.querySelector('.services-nav-arrow.prev');
        const nextBtn = document.querySelector('.services-nav-arrow.next');

        if (prevBtn) {
            prevBtn.onclick = () => scrollServicesCarouselFixed('prev');
            console.log('Левая стрелка услуг переназначена');
        }
        if (nextBtn) {
            nextBtn.onclick = () => scrollServicesCarouselFixed('next');
            console.log('Правая стрелка услуг переназначена');
        }

        // Обновляем стрелки при загрузке
        updateServicesArrowsFixed();

        // Добавляем слушатель прокрутки с улучшенной логикой
        const carousel = document.getElementById('services-grid');
        if (carousel) {
            carousel.addEventListener('scroll', () => {
                // Добавляем небольшую задержку для стабилизации scroll-snap
                clearTimeout(window.servicesScrollTimeout);
                window.servicesScrollTimeout = setTimeout(updateServicesArrowsFixed, 100);
            });
            console.log('Слушатель прокрутки услуг добавлен с улучшенной логикой');
        }

    }, 2000); // Увеличиваем задержку для надежности
});