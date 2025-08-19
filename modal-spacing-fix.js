function fixModalSpacing() {
    const allDescriptions = document.querySelectorAll('.modal-description, [class*="description"], .service-modal-body > div:first-child');
    allDescriptions.forEach(desc => {
        desc.style.setProperty('display', 'none', 'important');
    });

    const allGrids = document.querySelectorAll('.subservices-grid, [class*="subservices"], [class*="grid"], .service-modal-body > div:nth-child(2)');
    allGrids.forEach(grid => {
        grid.style.setProperty('margin', '0', 'important');
        grid.style.setProperty('margin-top', '0', 'important');
        grid.style.setProperty('padding-top', '0', 'important');
    });

    const modalBodies = document.querySelectorAll('.service-modal-body');
    modalBodies.forEach(body => {
        body.style.setProperty('padding', '10px 20px', 'important');

        const children = body.children;
        for (let i = 0; i < children.length; i++) {
            children[i].style.setProperty('margin-top', '0', 'important');
            children[i].style.setProperty('margin-bottom', '0', 'important');
            children[i].style.setProperty('padding-top', '0', 'important');
            if (i > 0) {
                children[i].style.setProperty('margin-top', '0', 'important');
            }
        }
    });

    // Скрываем элементы описания по их стилям
    const elementsWithBackground = document.querySelectorAll('.service-modal [style*="background"], .service-modal [style*="border-left"]');
    elementsWithBackground.forEach(el => {
        if (el.style.background && el.style.background.includes('#f8fafc')) {
            el.style.setProperty('display', 'none', 'important');
    
        }
        if (el.style.borderLeft && el.style.borderLeft.includes('#10b981')) {
            el.style.setProperty('display', 'none', 'important');

        }
    });

    // Скрываем все параграфы в модальных окнах
    const modalParagraphs = document.querySelectorAll('.service-modal p, .service-modal-body p');
    modalParagraphs.forEach(p => {
        p.style.setProperty('display', 'none', 'important');
     
    });

    // Показываем только сетки подуслуг
    const subservicesGrids = document.querySelectorAll('.subservices-grid');
    subservicesGrids.forEach(grid => {
        grid.style.setProperty('display', 'grid', 'important');
        grid.style.setProperty('margin-top', '0', 'important');
       
    });
}

// Применяем исправления при загрузке страницы
document.addEventListener('DOMContentLoaded', function () {
   
    fixModalSpacing();

    // Применяем исправления каждые 500мс в течение первых 5 секунд
    let attempts = 0;
    const maxAttempts = 10;
    const interval = setInterval(() => {
        attempts++;
        fixModalSpacing();

        if (attempts >= maxAttempts) {
            clearInterval(interval);
           
        }
    }, 500);
});

// Применяем исправления при изменении DOM
const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
        if (mutation.type === 'childList') {
            // Проверяем, добавились ли модальные окна
            mutation.addedNodes.forEach(function (node) {
                if (node.nodeType === 1) { // Element node
                    if (node.classList && (node.classList.contains('service-modal') ||
                        node.querySelector && node.querySelector('.service-modal'))) {
                     
                        setTimeout(fixModalSpacing, 100);
                    }
                }
            });
        }
    });
});

// Наблюдаем за изменениями в body
observer.observe(document.body, {
    childList: true,
    subtree: true
});

// Экспортируем функцию для использования в других скриптах
window.fixModalSpacing = fixModalSpacing;

let teamCurrentSlide = 0;
const totalSlides = 5; // Количество фотографий команды

function moveCarousel(direction) {


    const carousel = document.getElementById('teamCarousel');
    if (!carousel) {
        console.error('❌ Карусель команды не найдена');
        return;
    }

    // Обновляем текущий слайд
    teamCurrentSlide += direction;

    // Зацикливаем карусель
    if (teamCurrentSlide >= totalSlides) {
        teamCurrentSlide = 0;
    } else if (teamCurrentSlide < 0) {
        teamCurrentSlide = totalSlides - 1;
    }

    // Применяем трансформацию для прокрутки
    const translateX = -teamCurrentSlide * 100;
    carousel.style.transform = `translateX(${translateX}%)`;
    carousel.style.transition = 'transform 0.5s ease';


}

// Автоматическая прокрутка карусели (опционально)
function startAutoCarousel() {
    setInterval(() => {
        if (window.innerWidth <= 768) { // Только на мобильных
            moveCarousel(1);
        }
    }, 5000); // Каждые 5 секунд
}

// Инициализация карусели при загрузке страницы
document.addEventListener('DOMContentLoaded', function () {


    // Проверяем, что мы на мобильном устройстве
    if (window.innerWidth <= 768) {
        const carousel = document.getElementById('teamCarousel');
        if (carousel) {
            // Устанавливаем начальную позицию
            carousel.style.transform = 'translateX(0%)';
            carousel.style.transition = 'transform 0.5s ease';

        

            // Запускаем автоматическую прокрутку (опционально)
            // startAutoCarousel();
        }
    }
});

// Обработка изменения размера окна
window.addEventListener('resize', function () {
    if (window.innerWidth > 768) {
        // На десктопе сбрасываем трансформацию
        const carousel = document.getElementById('teamCarousel');
        if (carousel) {
            carousel.style.transform = 'none';
            teamCurrentSlide = 0;
        }
    }
});

// Поддержка свайпов на мобильных устройствах
let startX = 0;
let endX = 0;

document.addEventListener('touchstart', function (e) {
    if (e.target.closest('.team-carousel')) {
        startX = e.touches[0].clientX;
    }
});

document.addEventListener('touchend', function (e) {
    if (e.target.closest('.team-carousel')) {
        endX = e.changedTouches[0].clientX;
        handleSwipe();
    }
});

function handleSwipe() {
    const swipeThreshold = 50; // Минимальное расстояние для свайпа
    const diff = startX - endX;

    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Свайп влево - следующий слайд
            moveCarousel(1);
        } else {
            // Свайп вправо - предыдущий слайд
            moveCarousel(-1);
        }
    }
}

// Экспортируем функцию для использования в HTML
window.moveCarousel = moveCarousel;
// ===== ИСПРАВЛЕНИЕ ПОЗИЦИИ КОПИРАЙТА В ПОДВАЛЕ =====
// JavaScript принуждение ОТКЛЮЧЕНО - настраивайте позицию через CSS!


// Экспортируем функцию для ручного вызова (если понадобится)
window.fixFooterCopyright = fixFooterCopyright;