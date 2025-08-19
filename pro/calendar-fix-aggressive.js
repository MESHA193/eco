function forceFixCalendar() {
    if (window.innerWidth > 768) {
        return;
    }
    
    // Находим ВСЕ кнопки и ищем календарь
    const allButtons = document.querySelectorAll('button, .btn, [onclick]');
    let calendarButton = null;
    
    allButtons.forEach(button => {
        const text = button.textContent || button.innerText || '';
        if (text.includes('Календарь') || text.includes('календарь')) {
            calendarButton = button;
        }
    });

    // Проверяем, что кнопка найдена
    if (!calendarButton) {
        
        return;
    }

    // АГРЕССИВНО убираем ВСЕ обработчики
    const newButton = calendarButton.cloneNode(true);
    calendarButton.parentNode.replaceChild(newButton, calendarButton);
    
    // Убираем onclick атрибут
    newButton.removeAttribute('onclick');
    newButton.onclick = null;
    function openCalendar(e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        
        
        // Визуальная обратная связь
        newButton.style.transform = 'scale(0.95)';
        newButton.style.transition = 'transform 0.1s ease';
        
        setTimeout(() => {
            newButton.style.transform = 'scale(1)';
            
            try {
                window.open('images/calendar.png', '_blank');
            } catch (error) {
                console.error('❌ Ошибка открытия:', error);
                // Альтернативный способ
                window.location.href = 'images/calendar.png';
            }
        }, 100);
        
        return false;
    }
    
    // Добавляем обработчики для всех возможных событий
    newButton.addEventListener('touchstart', openCalendar, { passive: false, capture: true });
    newButton.addEventListener('touchend', openCalendar, { passive: false, capture: true });
    newButton.addEventListener('click', openCalendar, { passive: false, capture: true });
    newButton.addEventListener('mousedown', openCalendar, { passive: false, capture: true });
    
}

// Применяем исправления немедленно и многократно
setTimeout(forceFixCalendar, 100);
setTimeout(forceFixCalendar, 500);
setTimeout(forceFixCalendar, 1000);
setTimeout(forceFixCalendar, 2000);
setTimeout(forceFixCalendar, 3000);

// Применяем при загрузке DOM
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(forceFixCalendar, 100);
    setTimeout(forceFixCalendar, 500);
    setTimeout(forceFixCalendar, 1000);
});

// Применяем при полной загрузке страницы
window.addEventListener('load', function() {
    setTimeout(forceFixCalendar, 100);
    setTimeout(forceFixCalendar, 500);
});

// Применяем при изменении размера окна
window.addEventListener('resize', function() {
    setTimeout(forceFixCalendar, 300);
});

// Наблюдатель за изменениями DOM
const calendarObserver = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if (mutation.type === 'childList') {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeType === 1) { // Element node
                    const text = node.textContent || node.innerText || '';
                    if (text.includes('Календарь') || text.includes('календарь')) {
                     
                        setTimeout(forceFixCalendar, 100);
                    }
                }
            });
        }
    });
});

// Начинаем наблюдение за изменениями DOM
calendarObserver.observe(document.body, {
    childList: true,
    subtree: true
});

// Экспортируем функцию для ручного вызова
window.forceFixCalendar = forceFixCalendar;

