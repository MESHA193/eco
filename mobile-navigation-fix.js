let isNavigating = false;

function fixMobileNavigation() {
    if (window.innerWidth > 1200) {
        return;
    }

    const heroActions = document.querySelector('.hero-actions');
    if (!heroActions) {
        return;
    }

    if (heroActions.dataset.mobileFixed) {
        return;
    }

    const buttons = [
        { text: 'Наши услуги', section: 'services' },
        { text: 'Акции', section: 'prices' },
        { text: 'Календарь эколога', section: 'hero-container' },
        { text: 'О нас', section: 'about' },
        { text: 'Связаться', section: 'contacts' }
    ];

    heroActions.innerHTML = '';

    buttons.forEach(buttonData => {
        const newButton = document.createElement('button');
        newButton.className = 'btn primary';
        newButton.textContent = buttonData.text;
        newButton.style.cssText = 'touch-action: manipulation; user-select: none;';

        newButton.addEventListener('touchstart', function(e) {
            if (isNavigating) {
                return;
            }

            isNavigating = true;
            e.preventDefault();
            e.stopPropagation();

            this.style.transform = 'scale(0.95)';
            this.style.transition = 'transform 0.1s ease';

            setTimeout(() => {
                try {
                    if (buttonData.text === 'Календарь эколога') {
                        if (typeof openCalendarModal === 'function') {
                            openCalendarModal();
                        } else {
                            try {
                                window.open('images/calendar.png', '_blank');
                            } catch (error) {
                                window.location.href = 'images/calendar.png';
                            }
                        }
                    } else {
                        scrollToSection(buttonData.section);
                    }
                } catch (error) {
                    if (typeof scrollToSection === 'function') {
                        scrollToSection(buttonData.section);
                    }
                }

                setTimeout(() => {
                    isNavigating = false;
                }, 1000);

                this.style.transform = 'scale(1)';
            }, 100);
        }, { passive: false });

        newButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
        }, { passive: false });

        newButton.addEventListener('touchend', function(e) {
            e.preventDefault();
            e.stopPropagation();
        }, { passive: false });

        heroActions.appendChild(newButton);
    });

    heroActions.dataset.mobileFixed = 'true';
}

function replaceClickWithTouch() {
    if (window.innerWidth <= 1200) {
        const clickableElements = document.querySelectorAll('[onclick], button, .btn');
        
        clickableElements.forEach(element => {
            if (!element.dataset.touchFixed) {
                const onclickAttr = element.getAttribute('onclick');
                
                if (onclickAttr) {
                    const newButton = element.cloneNode(true);
                    newButton.removeAttribute('onclick');
                    newButton.dataset.touchFixed = 'true';
                    newButton.style.cssText += 'touch-action: manipulation; user-select: none;';

                    newButton.addEventListener('touchstart', function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        
                        this.style.transform = 'scale(0.95)';
                        this.style.transition = 'transform 0.1s ease';
                        
                        setTimeout(() => {
                            try {
                                eval(onclickAttr);
                            } catch (error) {
                            }
                            this.style.transform = 'scale(1)';
                        }, 100);
                    }, { passive: false });

                    element.parentNode.replaceChild(newButton, element);
                }
            }
        });
    }
}

function disableMobileHover() {
    if (window.innerWidth <= 1200) {
        const style = document.createElement('style');
        style.textContent = `
            @media (max-width: 1200) {
                * {
                    -webkit-touch-callout: none !important;
                    -webkit-user-select: none !important;
                    -khtml-user-select: none !important;
                    -moz-user-select: none !important;
                    -ms-user-select: none !important;
                    user-select: none !important;
                }
                
                *:hover {
                    background-color: initial !important;
                    color: initial !important;
                    transform: initial !important;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

function fixCalendarButton() {
    if (window.innerWidth > 1200) {
        return;
    }

    const buttons = document.querySelectorAll('button, .btn');
    let calendarButton = null;

    buttons.forEach(button => {
        const text = button.textContent || button.innerText || '';
        if (text.includes('Календарь') || text.includes('календарь')) {
            calendarButton = button;
        }
    });

    if (!calendarButton) {
        return;
    }

    const newCalendarButton = document.createElement('button');
    newCalendarButton.className = calendarButton.className;
    newCalendarButton.textContent = calendarButton.textContent;
    newCalendarButton.id = calendarButton.id;
    newCalendarButton.type = 'button';
    newCalendarButton.style.cssText = calendarButton.style.cssText + 'touch-action: manipulation; user-select: none;';

    newCalendarButton.addEventListener('touchstart', function(e) {
        e.preventDefault();
        e.stopPropagation();

        this.style.transform = 'scale(0.95)';
        this.style.transition = 'transform 0.1s ease';

        setTimeout(() => {
            window.open('images/calendar.png', '_blank');
        }, 100);

        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 200);
    }, { passive: false });

    newCalendarButton.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
    }, { passive: false });

    calendarButton.parentNode.replaceChild(newCalendarButton, calendarButton);
}

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        fixMobileNavigation();
        replaceClickWithTouch();
        disableMobileHover();
        fixCalendarButton();
    }, 500);

    setTimeout(() => {
        fixMobileNavigation();
        fixCalendarButton();
    }, 1000);

    setTimeout(() => {
        fixMobileNavigation();
        fixCalendarButton();
    }, 2000);
});

window.addEventListener('load', function() {
    setTimeout(() => {
        fixMobileNavigation();
        fixCalendarButton();
    }, 500);
});

window.addEventListener('resize', function() {
    if (window.innerWidth <= 1200) {
        setTimeout(() => {
            fixMobileNavigation();
            fixCalendarButton();
        }, 100);
    }
});

function testCalendar() {
    if (typeof openCalendarModal === 'function') {
        try {
            openCalendarModal();
        } catch (error) {
        }
    } else {
        try {
            window.open('images/calendar.png', '_blank');
        } catch (error) {
        }
    }
}

window.testCalendar = testCalendar;
window.fixMobileNavigation = fixMobileNavigation;