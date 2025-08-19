function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function initMobileMenu() {
    const navToggle = document.getElementById('navToggle');
    const mobileMenu = document.getElementById('mobileMenu');

    if (!navToggle || !mobileMenu) {
        setTimeout(() => initMobileMenu(), 500);
        return;
    }

    navToggle.replaceWith(navToggle.cloneNode(true));
    const newNavToggle = document.getElementById('navToggle');

    newNavToggle.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        mobileMenu.classList.toggle('open');
        newNavToggle.classList.toggle('active');
    });

    document.addEventListener('click', function (e) {
        if (!mobileMenu.contains(e.target) && !newNavToggle.contains(e.target)) {
            mobileMenu.classList.remove('open');
            newNavToggle.classList.remove('active');
        }
    });
}

function ensureMobileContactsVisible() {
    if (window.innerWidth <= 1200) {
        const mobileContacts = document.querySelector('.mobile-nav-contact');
        if (mobileContacts) {
            mobileContacts.style.display = 'flex';
            mobileContacts.style.visibility = 'visible';
            mobileContacts.style.opacity = '1';

            const contactButtons = mobileContacts.querySelectorAll('.btn.primary.btn-compact');
            contactButtons.forEach(button => {
                button.style.display = 'flex';
                button.style.visibility = 'visible';
                button.style.opacity = '1';
            });
        }
    }
}

function closeMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    const navToggle = document.getElementById('navToggle');

    if (mobileMenu) mobileMenu.classList.remove('open');
    if (navToggle) navToggle.classList.remove('active');
}

function initNavigation() {
    initNavScroll();
    initActiveNavigation();
}

function initFloatingContactBtn() {
    const floatingBtn = document.getElementById('floatingContactBtn');
    if (!floatingBtn) return;

    floatingBtn.addEventListener('click', function () {
        scrollToSection('contacts');
    });
}

let lastScrollTop = 0;
let scrollTimeout = null;
let isNavVisible = true;

function initNavScroll() {
    const nav = document.querySelector('.modern-nav');
    if (!nav) return;

    nav.classList.add('nav-visible');
    nav.classList.remove('nav-hidden');

    window.addEventListener('scroll', function () {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollDelta = scrollTop - lastScrollTop;
        const scrollThreshold = 10;

        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }

        if (scrollDelta > scrollThreshold && scrollTop > 100) {
            scrollTimeout = setTimeout(() => {
                if (isNavVisible) {
                    nav.classList.remove('nav-visible');
                    nav.classList.add('nav-hidden');
                    isNavVisible = false;
                }
            }, 100);
        }
        else if (scrollDelta < -scrollThreshold || scrollTop <= 100) {
            scrollTimeout = setTimeout(() => {
                if (!isNavVisible) {
                    nav.classList.remove('nav-hidden');
                    nav.classList.add('nav-visible');
                    isNavVisible = true;

                    const mobileMenu = document.getElementById('mobileMenu');
                    const navToggle = document.getElementById('navToggle');
                    if (mobileMenu && navToggle && mobileMenu.classList.contains('open')) {
                        closeMobileMenu();
                    }
                }
            }, 100);
        }

        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });

    nav.addEventListener('mouseenter', function () {
        if (!isNavVisible) {
            nav.classList.remove('nav-hidden');
            nav.classList.add('nav-visible');
            isNavVisible = true;

            const mobileMenu = document.getElementById('mobileMenu');
            const navToggle = document.getElementById('navToggle');
            if (mobileMenu && navToggle && mobileMenu.classList.contains('open')) {
                closeMobileMenu();
            }
        }
    });
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        let offsetTop;
        if (sectionId === 'contacts') {
            // Для мобильной версии используем больший offset
            if (window.innerWidth <= 768) {
                offsetTop = section.offsetTop + 2250; // Прокручиваем ниже на мобильной
            } else {
                offsetTop = section.offsetTop - -2200; // Меньший отступ на десктопе
            }
        } else {
            offsetTop = section.offsetTop - 80;
        }
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    } else {
        setTimeout(() => {
            const targetSection = document.getElementById(sectionId);
            if (targetSection) {
                let offsetTop;
                if (sectionId === 'contacts') {
                    // Для мобильной версии используем больший offset
                    if (window.innerWidth <= 768) {
                        offsetTop = targetSection.offsetTop + 200; // Прокручиваем ниже на мобильной
                    } else {
                        offsetTop = targetSection.offsetTop - 50; // Меньший отступ на десктопе
                    }
                } else {
                    offsetTop = targetSection.offsetTop - 80;
                }
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        }, 100);
    }
}

function initScrollProgress() {
    const progressBar = document.getElementById('scrollProgress');
    if (!progressBar) return;

    window.addEventListener('scroll', function () {
        const scrollTop = window.scrollY;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });
}

function initActiveNavigation() {
    const navButtons = document.querySelectorAll('.hero-actions .btn.primary');
    const sections = document.querySelectorAll('.section');

    const buttonSectionMap = {
        'services': 0,
        'prices': 1,
        'home': 2,
        'about': 3,
        'contacts': 4
    };

    window.addEventListener('scroll', function () {
        let current = '';
        const scrollPosition = window.scrollY + 100;
        const contactsSection = document.getElementById('contacts');
        const footer = document.querySelector('footer.footer');
        let footerVisible = false;
        if (footer) {
            const rect = footer.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0 && rect.height > 0) {
                const visibleHeight = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
                if (visibleHeight / rect.height > 0.2) {
                    footerVisible = true;
                }
            }
        }
        if (footerVisible) {
            current = 'contacts';
        } else if (contactsSection) {
            const rect = contactsSection.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > window.innerHeight * 0.3) {
                current = 'contacts';
            } else {
                sections.forEach(section => {
                    if (section.id === 'contacts') return;
                    const sectionTop = section.offsetTop;
                    const sectionHeight = section.offsetHeight;
                    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                        current = section.getAttribute('id');
                    }
                });
            }
        }

        navButtons.forEach(button => {
            button.classList.remove('nav-active');
        });

        navButtons.forEach((button, index) => {
            const buttonText = button.textContent.trim();
            if ((current === 'services' && buttonText === 'Наши услуги') ||
                (current === 'prices' && buttonText === 'Акции') ||
                (current === 'about' && buttonText === 'О нас') ||
                (current === 'contacts' && buttonText === 'Связаться') ||
                (current === 'hero' && buttonText === 'Календарь эколога')) {
                if (current === 'contacts' && buttonText !== 'Связаться') return;
                button.classList.add('nav-active');
            }
        });
    });
}

function openCalendarModal() {
    const url = 'images/calendar.png';
    const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    if (isMobile) {
        window.location.href = url;
        return;
    }

    let win = null;
    try {
        win = window.open(url, '_blank', 'noopener,noreferrer');
    } catch (e) {
    }
    if (!win || win.closed || typeof win.closed === 'undefined') {
        const a = document.createElement('a');
        a.href = url;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        document.body.appendChild(a);
        a.click();
        a.remove();
    }
}

function openPromotionsModal() {
    alert('Раздел "Акции" скоро будет доступен!\n\nСледите за обновлениями на нашем сайте.');
}

function initCounterAnimations() {
    const counters = document.querySelectorAll('.stat-number, .achievement-number');

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                entry.target.classList.add('counted');
                animateCounter(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000;
    const frameRate = 60;
    const totalFrames = (duration / 1000) * frameRate;
    const increment = target / totalFrames;
    let current = 0;
    let frame = 0;

    const timer = setInterval(() => {
        frame++;
        const progress = frame / totalFrames;
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        current = target * easedProgress;

        if (frame >= totalFrames) {
            element.textContent = target + (target > 50 ? '+' : '');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 1000 / frameRate);
}

let currentSlideIndex = 0;
const totalSlides = 3;

function moveCarousel(direction) {
    const carousel = document.getElementById('teamCarousel');
    const dots = document.querySelectorAll('.dot');

    if (!carousel) return;

    currentSlideIndex += direction;

    if (currentSlideIndex >= totalSlides) {
        currentSlideIndex = 0;
    } else if (currentSlideIndex < 0) {
        currentSlideIndex = totalSlides - 1;
    }

    const translateX = -currentSlideIndex * 100;
    carousel.style.transform = `translateX(${translateX}%)`;

    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlideIndex);
    });
}

function currentSlide(slideIndex) {
    const carousel = document.getElementById('teamCarousel');
    const dots = document.querySelectorAll('.dot');

    if (!carousel) return;

    currentSlideIndex = slideIndex - 1;

    const translateX = -currentSlideIndex * 100;
    carousel.style.transform = `translateX(${translateX}%)`;

    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlideIndex);
    });
}

function initCarouselAutoplay() {
    const carousel = document.getElementById('teamCarousel');
    if (!carousel) return;

    setInterval(() => {
        moveCarousel(1);
    }, 5000);
}

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.service-card, .pricing-card, .achievement-card').forEach(el => {
        observer.observe(el);
    });
}

const servicesData = {
    design: {
        title: "Разработка экологической документации",
        icon: "🏗️",
        description: "Разработка проектной документации для обеспечения экологической безопасности предприятий",
        features: [
            "Инвентаризация стационарных источников выбросов",
            "Проект нормативов допустимых выбросов (НДВ/ПДВ)",
            "Инвентаризация отходов производства и потребления",
            "Проект нормативов образования отходов (ПНООЛР)",
            "Мероприятия по сокращению выбросов (НМУ)",
            "Проект санитарно-защитной зоны (СЗЗ)",
            "Постановка на учёт объектов НВОС",
            "Программа ПЭК",
            "Декларация о воздействии на окружающую среду (ДВОС)"
        ]
    },
    reporting: {
        title: "Оформление и сдача экологической отчётности",
        icon: "📊",
        description: "Подготовка и сдача всех видов экологической отчетности в установленные сроки",
        features: [
            "Декларация о плате за НВОС",
            "Отчет о программе ПЭК",
            "Журнал движения отходов",
            "Отчет по форме 2-ТП (воздух)",
            "Отчет по форме 2-ТП (отходы)",
            "Отчет по форме 2-ТП (водхоз)",
            "Отчет по парниковым газам",
            "Экологический сбор, отчётность",
            "Отчет по форме 4-ОС",
            "Отчет по форме 4-ЛС"
        ]
    },
    support: {
        title: "Экологическое сопровождение предприятий",
        icon: "🏢",
        description: "Комплексное экологическое сопровождение деятельности предприятий на постоянной основе",
        features: [
            "Экологическое сопровождение предприятий"
        ]
    },
    audit: {
        title: "Экологическое аудит предприятий",
        icon: "🔍",
        description: "Комплексная оценка воздействия предприятия на окружающую среду и соответствия экологическим требованиям",
        features: [
            "Экологический аудит"
        ]
    },
    passportization: {
        title: "Разработка паспортов для отходов I-IV классов опасности, для V класса – протоколы биотестирования",
        icon: "📄",
        description: "Разработка паспортов отходов I-IV классов опасности",
        features: [
            "Паспортизация отходов"
        ]
    }
};

function openServiceModal(serviceId) {
    const service = servicesData[serviceId];
    if (!service) return;

    const modal = document.getElementById('serviceModal');
    if (!modal) return;

    const modalTitle = document.getElementById('modalTitle');
    const modalIcon = document.getElementById('modalIcon');
    const modalDescription = document.getElementById('modalDescription');
    const subservicesGrid = document.getElementById('subservicesGrid');

    if (modalTitle) modalTitle.textContent = service.title;
    if (modalIcon) modalIcon.textContent = service.icon;
    if (modalDescription) modalDescription.textContent = service.description;

    if (subservicesGrid) {
        subservicesGrid.innerHTML = '';
        service.features.forEach((feature, index) => {
            const subserviceButton = document.createElement('button');
            subserviceButton.className = 'subservice-button';
            subserviceButton.onclick = () => openSubserviceOrderModal(serviceId, index);

            const subserviceData = getSubserviceData(serviceId, feature);

            subserviceButton.innerHTML = `
        <div class="subservice-button-content">
          <div class="subservice-title">${feature}</div>
          <div class="subservice-info">
            <span class="subservice-price">${subserviceData.price}</span>
            <span class="subservice-duration">${subserviceData.duration}</span>
          </div>
        </div>
        <div class="subservice-arrow">→</div>
      `;

            subservicesGrid.appendChild(subserviceButton);
        });
    }

    modal.classList.add('show');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    const externalControls = modal.querySelector('.modal-external-controls');
    if (externalControls) {
        externalControls.style.display = 'flex';
    }

    const backBtn = document.getElementById('serviceBackBtn');
    if (backBtn) {
        backBtn.style.display = 'none';
    }
}

// Получение данных подуслуги
function getSubserviceData(serviceId, featureName) {
    const defaultData = {
        description: 'Профессиональное выполнение услуги с соблюдением всех требований законодательства',
        price: 'по запросу',
        duration: '5-10 дней'
    };

    const specificData = {
        'Инвентаризация стационарных источников выбросов': {
            description: 'Инвентаризация стационарных источников и выбросов загрязняющих веществ в атмосферный воздух проводится юридическими лицами и индивидуальными предпринимателями, осуществляющими хозяйственную и (или) иную деятельность на объектах, оказывающих негативное воздействие на окружающую среду.<br><br>На объектах, оказывающих негативное воздействие на окружающую среду, вводимых в эксплуатацию, инвентаризация проводится не позднее чем через два года после выдачи разрешения на ввод в эксплуатацию указанных объектов.',
            price: 'от 45 000 ₽',
            duration: 'от 2 недель',
            whoNeeds: 'Объектам I, II, III и IV категории НВОС, при наличии стационарных и передвижных источников выбросов загрязняющих веществ в атмосферный воздух.',
            validity: 'Для объектов НВОС I категории – 7 лет в составе Комплексного экологического разрешения (КЭР).<br><br> Для объектов НВОС II категории – 7 лет в составе Декларации о воздействии на окружающую среду (ДВОС).<br><br> Для объектов НВОС III и IV категории – до изменений в технологическом производстве, а также случаев изменения в количественном и качественном составе выбросов атмосферу.',
            approval: 'Согласования в государственных органах и организациях не требуется, утверждается руководителем организации.',
            stages: 'Сбор исходной информации – обработка, проведение расчётов - оформление документации.'
        },
        'Проект нормативов допустимых выбросов (НДВ/ПДВ)': {
            description: 'Проект нормативов допустимых выбросов (НДВ/ПДВ) - это природоохранная документация, которая устанавливает нормативы допустимого загрязнения атмосферного воздуха для предприятий.',
            price: 'от 80 000 ₽',
            duration: '3 месяца (включает разработку и этапы согласования)',
            whoNeeds: 'Для объектов НВОС I, II и III категории (только при наличии в составе выбросов I, II класса опасности)',
            validity: '7 лет при условии неизменности технологического процесса или до получения КЭР',
            discount: 'При выполнении комплекса работ, включающую разработку инвентаризации выбросов и проекта НДВ предоставляется скидка 15%!!!',
            necessaryFor: 'Декларация о воздействии на окружающую среду (ДВОС)<br>Комплексного экологического разрешения (КЭР)'
        },
        'Мероприятия по сокращению выбросов (НМУ)': {
            description: 'Мероприятия по уменьшению выбросов загрязняющих веществ в атмосферный воздух в периоды неблагоприятных метеорологических условий (НМУ) разрабатываются и реализуются юридическими лицами и индивидуальными предпринимателями, имеющими источники выбросов загрязняющих веществ в атмосферный воздух.<br><br>Разработка данной документации позволяет хозяйствующим субъектам провести оценку влияния выбросов предприятия на окружающие среду, выявить перечень источников, на которых необходимо будет снижать выбросы в период наступления НМУ.<br><br> Для разработки мероприятий по сокращению выбросов (НМУ) необходима в обязательном порядке актуальный проект по инвентаризации выбросов.',
            price: 'от 50 000 ₽',
            duration: 'от 2 месяцев',
            whoNeeds: 'Разработка мероприятий при НМУ осуществляется для всех источников выбросов на ОНВ I, II и III категорий, подлежащих нормированию в области охраны окружающей среды.',
            validity: 'Бессрочно (за исключением случая необходимости корректировки при изменении количественного и качественного состава максимально разовых выбросов).',
            necessaryFor: 'Cнижения выбросов загрязняющих веществ на источниках выбросов объектов НВОС в периоды наступления НМУ (штиль, туман, температурная инверсия, слабый ветер) при получении соответствующих прогнозов специализированных служб.'
        },
        'Проект санитарно-защитной зоны (СЗЗ)': {
            description: 'Проект санитарно-защитной зоны (СЗЗ) разрабатывается с целью создания вокруг предприятия буферной зоны, размеры которой будут обеспечивать отсутствие негативного влияния от производственной деятельности на окружающую среду и здоровье человека.',
            price: 'от 160 000 ₽',
            duration: 'от 6 месяцев',
            whoNeeds: 'Все промышленные объекты и большая часть организаций непроизводственного сектора, а именно:<br> • Объекты капитального строительства<br> • Некапитальные строения и сооружения<br> • Промышленные объекты, производства и сооружения<br> • Группы промышленных объектов, производств<br> • Объекты размещения отходов.<br> Источниками воздействия на среду обитания и здоровье человека являются также объекты, для которых уровни создаваемого загрязнения за пределами промышленной площадки превышают 0,1 ПДК и/или ПДУ.',
            validity: 'Бессрочно при неизменности технологического процесса, границ территории осуществления деятельности и объемов производства. Необходимо произвести корректировку, если произошло: изменение производственных мощностей более чем на 10%; ликвидация предприятия.',
            nec: '• Изменение производственных мощностей более чем на 10%<br> • Ликвидация предприятия',
            additionalInfo: 'Для проектируемых объектов и объектов на этапе строительства натурные исследования и измерения проводятся уже после ввода в эксплуатацию в течение одного года.'
        },
        'Инвентаризация отходов производства и потребления': {
            description: 'Инвентаризация отходов производства и потребления проводится с цель организации первичного учета отходов, организации раздельного сбора отходов, разработки мероприятий по предотвращению или снижению количества образования отходов.<br><br> В процессе проведения инвентаризации:<br><br> • Выявляются вещества или материалы, которые образовались при выполнении работ, очистке оборудования, территории, ликвидации загрязнений;<br><br> • Выявляются изделия или материалы, которые утратили потребительские свойства;<br><br> • Проводится классификация отходов, в том числе идентификация с видами отходов, включенными в Федеральный классификационный каталог отходов, утвержденный Приказом Росприроднадзора от 22.05.2017 N 242 (ред. от 18.01.2024), паспортизацию отходов.',
            price: 'от 12 000 ₽',
            duration: '10 дней',
            whoNeeds: 'Все юридические лица и индивидуальные предприниматели, в процессе деятельности которых образуются отходы.',
            validity: 'Бессрочно, при условии неизменности технологического процесса.',
            approval: 'Согласования в государственных органах и организациях не требуется, утверждается руководителем организации.'
        },
        'Проект нормативов образования отходов (ПНООЛР)': {
            description: 'Проект нормативов образования отходов (ПНООЛР) - документ, включающий в себя сведения обо всех отходах предприятия, их объемах, свойствах, местах накопления, заключенных договоров.',
            price: 'от 45 000 ₽',
            duration: 'от 2 месяцев',
            whoNeeds: 'Обязателен к разработке для юридических лиц и индивидуальных предпринимателей, эксплуатирующих объекты I и II категорий (ст. 18 ФЗ-89). <br>Объекты МСП не освобождены от разработки ПНООЛР.',
            validity: 'Для объектов I категории утверждается в составе КЭР на 7 лет и подлежит продлению на тот же срок при соблюдении конкретных условий – соблюдение нормативов, отсутствие задолжностей по плате за НВОС, своевременного предоставления отчетности по программе ПЭК (п.13 ст.31_1 Федерального закона от 10.01.2002 г. N 7-ФЗ).<br><br> Объекты II категории НВОС подают сведения о количестве образовавшихся и размещенных отходов в составе декларации о воздействии на окружающую среду. Данные заполняются на основании сведений из ПНООЛР (п. 25 пр. 2 приказа Минприроды № 509). Утверждает руководитель предприятия. Срок не определен, документация считается действительной при отсутствии изменений. <br><br>Для объектов III категория отсутствует обязанность в разработке ПНООЛР. Сведения подаются в составе отчета ПЭК. При этом необходимо провести инвентаризацию отходов на объекте.',
            bonus: 'При заказе работ по разработке ПНООЛР, инвентаризация отходов в подарок!!!'
        },
        'Декларация о воздействии на окружающую среду (ДВОС)': {
            description: 'Декларация о воздействии на окружающую среду (ДВОС) – документ, объединяющий информацию о негативном воздействии на окружающую среду от выбросов, сбросов, отходов предприятия.',
            price: 'от 30 000 ₽',
            duration: 'от 1 месяца с учётом согласования',
            whoNeeds: 'Только юридические лица и индивидуальные предприниматели, эксплуатирующие объекты II категорий НВОС.',
            validity: '7 лет при условии неизменности технологических процессов основных производств, качественных и количественных характеристик выбросов, сбросов загрязняющих веществ и стационарных источников.<br><br>Внесение изменений в декларацию о воздействии на окружающую среду осуществляется одновременно с актуализацией сведений об объектах, оказывающих негативное воздействие на окружающую среду.',
        },
        'Программа ПЭК': {
            description: 'Документ разрабатывается для организации контроля и разработки мероприятий в области охраны окружающей среды.',
            price: 'от 16 000 ₽',
            duration: 'до 10 дней',
            whoNeeds: 'В обязательном порядке объекты I, II, III категории НВОС.',
            validity: 'Бессрочно при условии неизменности технологического процесса.',
            approval: 'Согласования в государственных органах и организациях не требуется, утверждается руководителем организации.'
        },
        'Постановка на учёт объектов НВОС': {
            description: 'Обязательная процедура для всех юридических лиц и индивидуальных предпринимателей, деятельность которых оказывает негативное воздействие на окружающую среду (выбросы, сбросы, отходы).<br><br> Постановка объекта НВОС на государственный учет осуществляется в течение шести месяцев со дня ввода объекта в эксплуатацию (п. 2 ст. 69.2 закона № 7-ФЗ).<br><br> Актуализация сведений в государственном реестре объектов, оказывающих негативное воздействие на окружающую среду, осуществляется на основании п. 6 ст. 69.2 Закона № 7- ФЗ.<br><br> Снятие с государственного учета объекта НВОС, осуществляется в случае прекращения деятельности на объекте в связи с его консервацией или ликвидацией (п. 11,12 Закона № 7-ФЗ).',
            price: 'от 7 500 ₽',
            duration: '5-10 дней',
        },
        'Декларация о плате за НВОС': {
            description: 'Обязательна для юридических лиц и ИП, имеющих объекты I, II, III категории НВОС. Срок сдачи декларации о плате за негативное воздействие на окружающую среду (НВОС) за отчётный год – до 10 марта года, следующего за отчётным периодом.',
            price: 'от 4500 ₽',
            duration: 'от 5 дней'
        },
        'Отчет о программе ПЭК': {
            description: 'Обязательная отчётность для объектов II, III категории НВОС. Срок сдачи отчёта о программе ПЭК за отчётный год – до 25 марта года, следующего за отчётным периодом.',
            price: 'от 6300 ₽',
            duration: 'от 5 дней'
        },
        'Отчет по форме 2-ТП (воздух)': {
            description: 'Сведения предоставляются юридическими лицами или ИП в случае, если:<br><br> • Cуммарный объем разрешенных выбросов загрязняющих веществ по всем объектам, оказывающим негативное воздействие на окружающую среду, превышают 10 тонн в год.<br><br> • Cуммарный объем составляет от 5 до 10 тонн в год включительно при наличии в составе выбросов загрязняющих атмосферу веществ 1 и (или) 2 класса опасности.<br><br>Срок сдачи отчёта – до 22 января года, следующего за отчётным периодом.',
            price: 'от 4500 ₽',
            duration: 'от 5 дней'
        },
        'Отчет по форме 2-ТП (отходы)': {
            description: 'Обязательная отчётность для юридических лиц и ИП, осуществляющих деятельность в области обращения с отходами производства и потребления; региональных операторов по обращению с твердыми коммунальными отходами.<br><br> Срок сдачи отчёта - до 1 февраля года, следующего за отчетным.<br><br> Форму не предоставляют юридические лица и индивидуальные предприниматели, относящиеся к субъектам малого и среднего предпринимательства, у которых образуются только ТКО массой менее 0,1 тонны, заключившие договор с региональным оператором и не осуществляющие деятельность в области обращения с отходами производства и потребления (обработку, утилизацию, обезвреживание, размещение отходов).',
            price: 'от 3500 ₽',
            duration: 'от 5 дней'
        },
        'Экологический сбор, отчётность': {
            description: 'Производители и импортеры определенных товаров и упаковки должны либо утилизировать отходы, либо платить экологический сбор. Должны предоставить: 1. Отчетность о массе товаров, упаковки в соответствии с постановлением Правительства РФ от 31.05.2024 № 741; 2. Отчетность о выполнении утилизации в соответствии с постановлением Правительства РФ от 31.05.2024 № 742; 3. Расчет суммы экологического сбора в соответствии с постановлением Правительства РФ от 30.12.2024 № 1990. Сроки сдачи отчётности - ежегодно, до 15 апреля года, следующего за отчетным периодом.',
            additionalInfo: '• Отчетность о массе товаров, упаковки в соответствии с постановлением Правительства РФ от 31.05.2024 № 741<br><br> • Отчетность о выполнении утилизации в соответствии с постановлением Правительства РФ от 31.05.2024 № 742<br><br> • Расчет суммы экологического сбора в соответствии с постановлением Правительства РФ от 30.12.2024 № 1990',
            price: 'от 18 000 рублей (за три отчёта)',
            duration: 'от 10 дней'
        },
        'Отчет по парниковым газам': {
            description: 'Предоставляют регулируемые организации, деятельность которых сопровождается выбросами парниковых газов, масса которых эквивалентна 50 000 и более тонн углекислого газа в год.<br><br> Сроки сдачи отчётности - ежегодно, до 1 июля года, следующего за отчетным периодом.',
            price: 'от 6000 ₽',
            duration: 'от 5 дней'
        },
        'Отчет по форме 2-ТП (водхоз)': {
            description: 'Предоставляют юридические лица, физические лица, занимающиеся предпринимательской деятельностью без образования юридического лица (индивидуальные предприниматели), осуществляющие пользование водными ресурсами.<br><br> Сроки сдачи отчётности - с 1-го рабочего дня по 22 января после отчетного периода.',
            price: 'от 12 000 ₽',
            duration: 'от 5 дней'
        },
        'Отчет по форме 4-ОС': {
            description: 'Предоставляют организации, в отчетном периоде которых текущие затраты на ООС составили более 100000 рублей в год по всем филиалам и структурным подразделениям.<br><br> Сроки сдачи отчётности – до 25 января после отчетного периода.',
            price: 'от 7 000 ₽',
            duration: 'от 5 дней'
        },
        'Журнал движения отходов': {
            description: 'Порядок учета в области обращения с отходами устанавливает требования к организации и ведению юридическими лицами и индивидуальными предпринимателями, осуществляющими деятельность в области обращения с отходами, учета образовавшихся, обработанных, утилизированных, обезвреженных, переданных другим лицам или полученных от других лиц, а также размещенных отходов.<br><br> Учет в области обращения с отходами ведется отдельно по каждому объекту, оказывающему негативное воздействие на окружающую среду, I - IV категории, и (или) по юридическому лицу, индивидуальному предпринимателю в целом.',
            price: 'от 1 000 ₽',
            duration: 'от 3 дней'
        },
        'Экологическое сопровождение предприятий': {
            description: 'Экологический аутсорсинг – это комплексное сопровождение предприятия в области охраны окружающей среды, с частичной или полной передачей функции эколога специалистам нашей компании на основе гражданско-правового договора.',
            price: 'по договоренности',
            duration: 'по договоренности'
        },
        'Экологический аудит': {
            description: 'Экологический аудит – это независимая оценка соблюдения юридическим лицом или индивидуальным предпринимателем требований, в том числе нормативов и нормативных документов, федеральных норм и правил, в области охраны окружающей среды, требований международных стандартов и подготовка рекомендаций по улучшению такой деятельности (ст. 1 ФЗ от 10.01.2002 №7-ФЗ «Об охране окружающей среды).',
            price: 'по запросу',
            duration: 'по договоренности'
        },
        'Паспортизация отходов': {
            description: 'Паспортизация отходов\nКомпания ООО «ПРОЭКО» осуществляет работы по паспортизации отходов I-IV класса опасности. Работаем по всей территории России.',
            price: 'от 2500 ₽',
            duration: '10 - 15 дней'
        }
    };

    return specificData[featureName] || defaultData;
}

// Получение особенностей подуслуги
function getSubserviceFeatures(featureName) {
    const featuresMap = {
        'Инвентаризация стационарных источников выбросов': [
            'Постановка на учёт объектов НВОС',
            'Разработка проекта НДВ/ПДВ',
            'Разработка плана мероприятий НМУ',
            'Разработка проекта СЗЗ',
            'Разработка программы ПЭК',
            'Декларация ДВОС',
            'Комплексное экологическое разрешение (КЭР)'
        ],
        'Проект нормативов допустимых выбросов (НДВ/ПДВ)': [
            'Сбор исходной информации – обработка',
            'Проведение расчётов',
            'Оформление документации',
            'Согласование в государственных органах и организациях',
            'получение на документацию экспертного и санитарного эпидемиологического заключения',
        ],
        'Мероприятия по сокращению выбросов (НМУ)': [
            'Сбор исходной информации – обработка',
            'Проведение расчётов',
            'Оформление документации',
            'согласование в государственных органах и организациях',
            'Получение согласованных мероприятий при НМУ'
        ],
        'Проект санитарно-защитной зоны (СЗЗ)': [
            'Сбор исходной информации – обработка',
            'Проведение расчётов',
            'Получение графических материалов',
            'Оформление документации ',
            'Согласование в государственных органах и организациях (получение экспертного и санитарного эпидемиологического заключения)',
            'Проведение натурных исследований (привлечение аккредитованной лаборатории) ',
            'Получение экспертного заключения о результатах натурных исследований и измерений',
            'Получение решения об установлении границ СЗЗ в государственных органах'
        ],
        'Инвентаризация отходов производства и потребления': [
            'Исходной информации – анализ',
            'Классификация отходов',
            'обработка -оформление документации'
        ],
        'Проект нормативов образования отходов (ПНООЛР)': [
            'Сбор исходной информации – анализ',
            'Классификация отходов',
            'Расчёт объёмов',
            'Оформление документации ',
            'Согласование в государственных органов (необходимость зависит от категории объектов).'
        ],
        'Декларация о воздействии на окружающую среду (ДВОС)': [
            'Сбор исходной информации ',
            'Обработка и анализ',
            'Формирование и заполнение заявки в ЛК Природопользователя',
            'Формирование заявки в ЛК Природопользователя',
            'Согласование в государственных органах'
        ],
        'Программа ПЭК': [
            'Сбор исходной информации',
            'Обработка и анализ ',
            'Формирование и заполнение заявки в ЛК Природопользователя',
            'Согласование в государственных органах'
        ],
        'Постановка на учёт объектов НВОС': [
            'Подготовка документов для постановки на учет',
            'Актуализация сведений в государственном реестре',
            'Снятие с учета при необходимости',
            'Соблюдение сроков подачи документов',
            'Взаимодействие с государственными органами'
        ],
        'Экологическое сопровождение предприятий': [
            'снижение затрат на содержание штатных сотрудников',
            'оптимизация расходов на закупку необходимого программного обеспечения',
            'возможность уделить своему бизнесу больше времени, не отвлекаясь на вопросы, связанные с экологией',
            'ускорение рабочих процессов (опыт наших сотрудников позволяет сделать данную работу быстрее и качественнее)'
        ],
        'Экологический аудит': [
            'Стоимость работ определяется индивидуально по запросу.'
        ],
        'Паспортизация отходов': []
    };

    return featuresMap[featureName] || [
        'Профессиональное выполнение работ',
        'Соблюдение требований законодательства',
        'Консультации по вопросам',
        'Сопровождение процедуры'
    ];
}

function closeServiceModal() {
    const modal = document.getElementById('serviceModal');
    if (modal) {
        modal.classList.remove('show');
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

// Открытие модального окна заказа подуслуги
function openSubserviceOrderModal(serviceId, featureIndex) {
    const service = servicesData[serviceId];
    const featureName = service.features[featureIndex];
    const subserviceData = getSubserviceData(serviceId, featureName);

    const modal = document.getElementById('subserviceOrderModal');
    const modalTitle = document.getElementById('subserviceModalTitle');
    const modalIcon = document.getElementById('subserviceModalIcon');
    const modalDescription = document.getElementById('subserviceModalDescription');
    const modalPrice = document.getElementById('subserviceModalPrice');
    const modalDuration = document.getElementById('subserviceModalDuration');
    const modalFeatures = document.getElementById('subserviceModalFeaturesList');

    // Заполняем данные
    if (modalTitle) modalTitle.textContent = featureName;
    if (modalIcon) modalIcon.textContent = service.icon;
    if (modalDescription) {
        // Принудительно показываем основное описание с !important
        modalDescription.style.setProperty('display', 'block', 'important');
        modalDescription.style.setProperty('visibility', 'visible', 'important');
        modalDescription.style.setProperty('opacity', '1', 'important');
        modalDescription.innerHTML = subserviceData.description;
    }
    if (modalPrice) {
        const priceValue = modalPrice.querySelector('.price-value');
        if (priceValue) priceValue.textContent = subserviceData.price;
    }
    if (modalDuration) modalDuration.textContent = subserviceData.duration;

    // Заполняем особенности
    if (modalFeatures) {
        modalFeatures.innerHTML = '';
        const features = getSubserviceFeatures(featureName);
        features.forEach(feature => {
            const li = document.createElement('li');
            li.textContent = feature;
            modalFeatures.appendChild(li);
        });
    }

    // Заполняем дополнительную информацию
    const whoNeedsSection = document.getElementById('subserviceModalWhoNeeds');
    const validitySection = document.getElementById('subserviceModalValidity');
    const approvalSection = document.getElementById('subserviceModalApproval');
    const bonusSection = document.getElementById('subserviceModalBonus');
    const discountSection = document.getElementById('subserviceModalDiscount');

    // Показываем и заполняем секции, если есть данные
    if (subserviceData.whoNeeds && whoNeedsSection) {
        whoNeedsSection.style.setProperty('display', 'block', 'important');
        whoNeedsSection.style.setProperty('visibility', 'visible', 'important');
        whoNeedsSection.style.setProperty('opacity', '1', 'important');
        const whoNeedsText = whoNeedsSection.querySelector('.info-text');
        if (whoNeedsText) {
            whoNeedsText.innerHTML = subserviceData.whoNeeds;
            whoNeedsText.style.setProperty('display', 'block', 'important');
            whoNeedsText.style.setProperty('visibility', 'visible', 'important');
            whoNeedsText.style.setProperty('opacity', '1', 'important');
        }
    } else if (whoNeedsSection) {
        whoNeedsSection.style.display = 'none';
    }

    if (subserviceData.validity && validitySection) {
        validitySection.style.setProperty('display', 'block', 'important');
        validitySection.style.setProperty('visibility', 'visible', 'important');
        validitySection.style.setProperty('opacity', '1', 'important');
        const validityText = validitySection.querySelector('.info-text');
        if (validityText) {
            validityText.innerHTML = subserviceData.validity;
            validityText.style.setProperty('display', 'block', 'important');
            validityText.style.setProperty('visibility', 'visible', 'important');
            validityText.style.setProperty('opacity', '1', 'important');
        }
    } else if (validitySection) {
        validitySection.style.display = 'none';
    }

    if (subserviceData.approval && approvalSection) {
        approvalSection.style.setProperty('display', 'block', 'important');
        approvalSection.style.setProperty('visibility', 'visible', 'important');
        approvalSection.style.setProperty('opacity', '1', 'important');
        const approvalText = approvalSection.querySelector('.info-text');
        if (approvalText) {
            approvalText.innerHTML = subserviceData.approval;
            approvalText.style.setProperty('display', 'block', 'important');
            approvalText.style.setProperty('visibility', 'visible', 'important');
            approvalText.style.setProperty('opacity', '1', 'important');
        }
    } else if (approvalSection) {
        approvalSection.style.display = 'none';
    }

    if (subserviceData.bonus && bonusSection) {
        bonusSection.style.setProperty('display', 'block', 'important');
        bonusSection.style.setProperty('visibility', 'visible', 'important');
        bonusSection.style.setProperty('opacity', '1', 'important');
        const bonusText = bonusSection.querySelector('.info-text');
        if (bonusText) {
            bonusText.innerHTML = subserviceData.bonus;
            bonusText.style.setProperty('display', 'block', 'important');
            bonusText.style.setProperty('visibility', 'visible', 'important');
            bonusText.style.setProperty('opacity', '1', 'important');
        }
    } else if (bonusSection) {
        bonusSection.style.display = 'none';
    }

    if (subserviceData.discount && discountSection) {
        discountSection.style.setProperty('display', 'block', 'important');
        discountSection.style.setProperty('visibility', 'visible', 'important');
        discountSection.style.setProperty('opacity', '1', 'important');
        const discountText = discountSection.querySelector('.info-text');
        if (discountText) {
            discountText.innerHTML = subserviceData.discount;
            discountText.style.setProperty('display', 'block', 'important');
            discountText.style.setProperty('visibility', 'visible', 'important');
            discountText.style.setProperty('opacity', '1', 'important');
        }
    } else if (discountSection) {
        discountSection.style.display = 'none';
    }
    // Добавьте этот код в функцию openSubserviceOrderModal, где обрабатываются другие дополнительные поля
    const necSection = document.getElementById('subserviceModalNec');
    if (subserviceData.nec && necSection) {
        necSection.style.setProperty('display', 'block', 'important');
        necSection.style.setProperty('visibility', 'visible', 'important');
        necSection.style.setProperty('opacity', '1', 'important');
        const necText = necSection.querySelector('.info-text');
        if (necText) {
            necText.innerHTML = subserviceData.nec;
            necText.style.setProperty('display', 'block', 'important');
            necText.style.setProperty('visibility', 'visible', 'important');
            necText.style.setProperty('opacity', '1', 'important');
        }
    } else if (necSection) {
        necSection.style.display = 'none';
    }
    // Дополнительные поля
    const necessaryForSection = document.getElementById('subserviceModalNecessaryFor');
    const additionalInfoSection = document.getElementById('subserviceModalAdditionalInfo');

    if (subserviceData.necessaryFor && necessaryForSection) {
        necessaryForSection.style.setProperty('display', 'block', 'important');
        necessaryForSection.style.setProperty('visibility', 'visible', 'important');
        necessaryForSection.style.setProperty('opacity', '1', 'important');
        const necessaryForText = necessaryForSection.querySelector('.info-text');
        if (necessaryForText) {
            necessaryForText.innerHTML = subserviceData.necessaryFor;
            necessaryForText.style.setProperty('display', 'block', 'important');
            necessaryForText.style.setProperty('visibility', 'visible', 'important');
            necessaryForText.style.setProperty('opacity', '1', 'important');
        }
    } else if (necessaryForSection) {
        necessaryForSection.style.display = 'none';
    }

    if (subserviceData.additionalInfo && additionalInfoSection) {
        additionalInfoSection.style.setProperty('display', 'block', 'important');
        additionalInfoSection.style.setProperty('visibility', 'visible', 'important');
        additionalInfoSection.style.setProperty('opacity', '1', 'important');
        const additionalInfoText = additionalInfoSection.querySelector('.info-text');
        if (additionalInfoText) {
            additionalInfoText.innerHTML = subserviceData.additionalInfo;
            additionalInfoText.style.setProperty('display', 'block', 'important');
            additionalInfoText.style.setProperty('visibility', 'visible', 'important');
            additionalInfoText.style.setProperty('opacity', '1', 'important');
        }
    } else if (additionalInfoSection) {
        additionalInfoSection.style.display = 'none';
    }
    // Секция 'Этапы работ' для подуслуг с полем stages
    const stagesSectionId = 'subserviceModalStages';
    let stagesSection = document.getElementById(stagesSectionId);
    if (subserviceData.stages) {
        if (!stagesSection) {
            stagesSection = document.createElement('div');
            stagesSection.className = 'info-section';
            stagesSection.id = stagesSectionId;
            stagesSection.style.margin = '1.2em 0 0.7em 0';
            stagesSection.innerHTML = '<h4 style="margin-bottom:0.4em;">Этапы работ:</h4>' +
                '<p class="info-text" style="margin:0;"></p>';
            // Вставляем секцию после описания
            const desc = document.getElementById('subserviceModalDescription');
            if (desc && desc.parentNode) {
                desc.parentNode.insertBefore(stagesSection, desc.nextSibling);
            }
        } else {
            stagesSection.style.display = '';
        }
        // Принудительно показываем секцию и текст
        stagesSection.style.setProperty('display', 'block', 'important');
        stagesSection.style.setProperty('visibility', 'visible', 'important');
        stagesSection.style.setProperty('opacity', '1', 'important');

        const stagesText = stagesSection.querySelector('.info-text');
        if (stagesText) {
            stagesText.innerHTML = subserviceData.stages;
            stagesText.style.setProperty('display', 'block', 'important');
            stagesText.style.setProperty('visibility', 'visible', 'important');
            stagesText.style.setProperty('opacity', '1', 'important');
        }
    } else if (stagesSection) {
        stagesSection.style.display = 'none';
    }
    // Меняем заголовок особенностей для нужной подуслуги
    const modalFeaturesBlock = document.getElementById('subserviceModalFeatures');
    if (modalFeaturesBlock) {
        const featuresTitle = modalFeaturesBlock.querySelector('h4');
        if (featureName === 'Экологическое сопровождение предприятий') {
            featuresTitle.textContent = 'Основные преимущества:';
        } else {
            featuresTitle.textContent = 'Что входит в услугу:';
        }
    }

    // Для подуслуги 'Экологическое сопровождение предприятий' — отдельная секция 'Кому это нужно?'
    const komuSectionId = 'subserviceModalKomuNuzhno';
    let komuSection = document.getElementById(komuSectionId);
    if (featureName === 'Экологическое сопровождение предприятий') {
        if (!komuSection) {
            komuSection = document.createElement('div');
            komuSection.className = 'info-section';
            komuSection.id = komuSectionId;
            komuSection.style.margin = '1.2em 0 0.7em 0';
            komuSection.innerHTML = '<h4 style="margin-bottom:0.4em;">Кому это нужно?</h4>' +
                '<ul style="margin:0; padding-left:1.2em;">' +
                '<li>Организациям малого и среднего предпринимательства</li>' +
                '<li>Крупным предприятиям для снижения нагрузки со штатного специалиста</li>' +
                '</ul>';
            // Вставляем секцию после описания
            const desc = document.getElementById('subserviceModalDescription');
            if (desc && desc.parentNode) {
                desc.parentNode.insertBefore(komuSection, desc.nextSibling);
            }
        } else {
            komuSection.style.display = '';
        }
    } else if (komuSection) {
        komuSection.style.display = 'none';
    }

    // Для подуслуги 'Экологический аудит' — отдельная секция 'Этапы'
    const auditSectionId = 'subserviceModalAuditStages';
    let auditSection = document.getElementById(auditSectionId);
    if (featureName === 'Экологический аудит') {
        if (!auditSection) {
            auditSection = document.createElement('div');
            auditSection.className = 'info-section';
            auditSection.id = auditSectionId;
            auditSection.style.margin = '1.2em 0 0.7em 0';
            auditSection.innerHTML = '<h4 style="margin-bottom:0.4em;">Этапы:</h4>' +
                '<ul style="margin:0; padding-left:1.2em;">' +
                '<li>Предварительный – формируем цели аудита и критерии оценки</li>' +
                '<li>Основной – оценка соответствия деятельности организации нормам экологического законодательства, влияния на окружающую среду, а также предложения мер по улучшению ситуации</li>' +
                '<li>Заключительный – выдача аудиторского заключения</li>' +
                '</ul>';
            // Вставляем секцию после описания
            const desc = document.getElementById('subserviceModalDescription');
            if (desc && desc.parentNode) {
                desc.parentNode.insertBefore(auditSection, desc.nextSibling);
            }
        } else {
            auditSection.style.display = '';
        }
    } else if (auditSection) {
        auditSection.style.display = 'none';
    }

    // Для подуслуги 'Паспортизация отходов' — отдельная секция 'Вы получаете'
    const passportSectionId = 'subserviceModalPassportFeatures';
    let passportSection = document.getElementById(passportSectionId);
    if (featureName === 'Паспортизация отходов') {
        if (!passportSection) {
            passportSection = document.createElement('div');
            passportSection.className = 'info-section';
            passportSection.id = passportSectionId;
            passportSection.style.margin = '1.2em 0 0.7em 0';
            passportSection.innerHTML = '<h4 style="margin-bottom:0.4em;">Вы получаете:</h4>' +
                '<ul style="margin:0; padding-left:1.2em;">' +
                '<li>Паспорт отхода</li>' +
                '<li>Протокол КХА, биотестирования</li>' +
                '</ul>';
            // Вставляем секцию после описания
            const desc = document.getElementById('subserviceModalDescription');
            if (desc && desc.parentNode) {
                desc.parentNode.insertBefore(passportSection, desc.nextSibling);
            }

            // Отдельная секция для скидки
            let discountSection = document.getElementById('subserviceModalPassportDiscount');
            if (!discountSection) {
                discountSection = document.createElement('div');
                discountSection.className = 'info-section';
                discountSection.id = 'subserviceModalPassportDiscount';
                discountSection.style.margin = '0.7em 0 0.7em 0';
                discountSection.innerHTML = '<h4 style="margin-bottom:0.4em; color:#d97706;">Скидка</h4>' +
                    '<div style="color:#d97706;"><b>Закажи 5 паспортов отходов и более – получи 15% скидку!!!</b></div>';
                passportSection.parentNode.insertBefore(discountSection, passportSection.nextSibling);
            } else {
                discountSection.style.display = '';
            }
        } else {
            passportSection.style.display = '';
        }
    } else if (passportSection) {
        passportSection.style.display = 'none';
        let discountSection = document.getElementById('subserviceModalPassportDiscount');
        if (discountSection) discountSection.style.display = 'none';
    }

    // Закрываем первое модальное окно и открываем второе
    closeServiceModal();
    modal.classList.add('show');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    // Показываем внешние кнопки управления
    const externalControls = modal.querySelector('.modal-external-controls');
    if (externalControls) {
        externalControls.style.display = 'flex';
    }

    // Прячем блок особенностей для 'Паспортизация отходов'
    if (featureName === 'Паспортизация отходов' || featureName === 'Постановка на учёт объектов НВОС' || featureName === 'Декларация о плате за НВОС' || featureName==='Отчет о программе ПЭК' || 'featureName=== || featureName=== || featureName=== || featureName=== || featureName=== || featureName===') {
        const modalFeaturesBlock = document.getElementById('subserviceModalFeatures');
        if (modalFeaturesBlock) {
            modalFeaturesBlock.style.display = 'none';
        }
    } else {
        const modalFeaturesBlock = document.getElementById('subserviceModalFeatures');
        if (modalFeaturesBlock) {
            modalFeaturesBlock.style.display = '';
        }
    }

    // Показываем кнопку 'Назад' всегда при открытии подуслуги
    var backBtn = document.getElementById('subserviceBackToListBtn');
    if (backBtn) {
        backBtn.style.display = 'flex';
    }
}

function closeSubserviceOrderModal() {
    const modal = document.getElementById('subserviceOrderModal');
    if (modal) {
        modal.classList.remove('show');
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

function submitSubserviceOrder(event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);

    const serviceName = formData.get('service');
    const clientName = formData.get('name');
    const clientPhone = formData.get('phone');

    alert(`Спасибо за заявку!\n\nУслуга: ${serviceName}\nИмя: ${clientName}\nТелефон: ${clientPhone}\n\nМы свяжемся с вами в ближайшее время.`);

    closeSubserviceOrderModal();
    form.reset();
}

/* Универсальная отправка формы на sendmail.php через fetch */
async function postFormToSendmail(form) {
  try {
    const res = await fetch('sendmail.php', {
      method: 'POST',
      body: new FormData(form),
      cache: 'no-store'
    });
    const text = (await res.text()).trim();
    return text;
  } catch (err) {
    console.error('Ошибка отправки формы:', err);
    return 'error';
  }
}

/* Обработчик основной формы на странице Контакты */
document.addEventListener('DOMContentLoaded', function () {
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      if (btn) btn.disabled = true;
      const result = await postFormToSendmail(contactForm);
      if (result === 'success') {
        alert('Ваша заявка отправлена. Спасибо!');
        contactForm.reset();
      } else {
        alert('Ошибка отправки. Попробуйте позже.');
      }
      if (btn) btn.disabled = false;
    });
  }

  /* Делегированно: все формы заказа в модалках имеют класс .modal-order-form */
  document.querySelectorAll('.modal-order-form').forEach(form => {
    form.addEventListener('submit', submitSubserviceOrder);
  });
});

/* Функция, вызываемая у модальных форм: собирает данные и отправляет */
async function submitSubserviceOrder(e) {
  e.preventDefault();
  const form = e.target.closest('form') || e.target;
  if (!form) return;
  const submitBtn = form.querySelector('button[type="submit"]');
  if (submitBtn) submitBtn.disabled = true;

  // Дополнительно можно добавить поле service/utm, если нужно
  // const serviceName = document.getElementById('subserviceModalTitle')?.textContent || document.getElementById('orderServiceName')?.textContent;
  // if (serviceName) form.querySelector('input[name="service"]') || form.insertAdjacentHTML('beforeend', `<input type="hidden" name="service" value="${serviceName}">`);

  const result = await postFormToSendmail(form);
  if (result === 'success') {
    alert('Заявка отправлена. Мы свяжемся в ближайшее время.');
    form.reset();
    // закрываем модалку, если есть функция closeAllServiceModals или closeOrderModal
    if (typeof closeAllServiceModals === 'function') closeAllServiceModals();
    if (typeof closeOrderModal === 'function') closeOrderModal();
    if (typeof closeServiceModal === 'function') closeServiceModal();
  } else {
    alert('Ошибка отправки. Попробуйте позже.');
  }

  if (submitBtn) submitBtn.disabled = false;
}

document.addEventListener('DOMContentLoaded', function () {
    setTimeout(() => {
        if (typeof initNavigation === 'function') initNavigation();
        if (typeof initScrollProgress === 'function') initScrollProgress();
        if (typeof initScrollAnimations === 'function') initScrollAnimations();
        if (typeof initCounterAnimations === 'function') initCounterAnimations();
        if (typeof initMobileMenu === 'function') initMobileMenu();
        if (typeof initFloatingContactBtn === 'function') initFloatingContactBtn();
        if (typeof ensureMobileContactsVisible === 'function') ensureMobileContactsVisible();

        const calendarBtn = document.getElementById('calendarBtn');
        if (calendarBtn) {
            calendarBtn.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                if (typeof openCalendarModal === 'function') {
                    openCalendarModal();
                }
            });
        }

        const serviceModal = document.getElementById('serviceModal');
        if (serviceModal) {
            const closeBtn = serviceModal.querySelector('.modal-close-btn, .modal-close');
            if (closeBtn) {
                closeBtn.addEventListener('click', function(e){ e.preventDefault(); if (e.stopImmediatePropagation) e.stopImmediatePropagation(); e.stopPropagation(); closeAllServiceModals(); });
            }

            serviceModal.addEventListener('click', function (e) {
                if (e.target === serviceModal) {
                    e.preventDefault();
                    e.stopPropagation();
                    closeAllServiceModals();
                }
            });
        }

        const subserviceModal = document.getElementById('subserviceOrderModal');
        if (subserviceModal) {
            const closeBtn = subserviceModal.querySelector('.modal-close-btn, .modal-close');
            if (closeBtn) {
                closeBtn.addEventListener('click', function(e){ e.preventDefault(); if (e.stopImmediatePropagation) e.stopImmediatePropagation(); e.stopPropagation(); closeAllServiceModals(); });
            }

            const backBtn = subserviceModal.querySelector('#subserviceBackToListBtn');
            if (backBtn) {
                backBtn.addEventListener('click', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    backToServicesList();
                });
            }

            const backBtnAlt = document.getElementById('subserviceBackToListBtn');
            if (backBtnAlt && backBtnAlt !== backBtn) {
                backBtnAlt.addEventListener('click', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    backToServicesList();
                });
            }

            subserviceModal.addEventListener('click', function (e) {
                if (e.target === subserviceModal) {
                    e.preventDefault();
                    e.stopPropagation();
                    closeAllServiceModals();
                }
            });
        }

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                const subserviceModal = document.getElementById('subserviceOrderModal');
                const serviceModal = document.getElementById('serviceModal');
                const orderModal = document.getElementById('orderModal');

                if (subserviceModal && subserviceModal.style.display === 'flex') {
                    closeAllServiceModals();
                } else if (serviceModal && serviceModal.style.display === 'flex') {
                    closeAllServiceModals();
                } else if (orderModal && orderModal.style.display === 'flex') {
                    closeAllServiceModals();
                }
            }
        });
    }, 100);
}, 1000);

function backToServicesList() {
    const subserviceModal = document.getElementById('subserviceOrderModal');
    const serviceModal = document.getElementById('serviceModal');

    if (subserviceModal) {
        subserviceModal.classList.remove('show');
        subserviceModal.style.display = 'none';
    }

    if (serviceModal) {
        serviceModal.classList.add('show');
        serviceModal.style.display = 'flex';
    }
}

function backToServiceList() {
    backToServicesList();
}

function openOrderModal(serviceName, price) {
    const modal = document.getElementById('orderModal');
    if (!modal) return;

    const serviceNameEl = modal.querySelector('#orderServiceName');
    const servicePriceEl = modal.querySelector('#orderServicePrice');

    if (serviceNameEl) serviceNameEl.textContent = serviceName;
    if (servicePriceEl) servicePriceEl.textContent = price;

    modal.classList.add('show');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeOrderModal() {
    const modal = document.getElementById('orderModal');
    if (modal) {
        modal.classList.remove('show');
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
}
function closeAllServiceModals() {
    try {
        const modals = document.querySelectorAll('.service-modal');
        modals.forEach(m => {
            m.classList.remove('show');
            m.style.display = 'none';
        });
        document.body.style.overflow = '';
    } catch (e) {}
}

window.closeAllServiceModals = closeAllServiceModals;
window.addEventListener('load', function () {
    setTimeout(() => {
        if (typeof initCounterAnimations === 'function') {
            initCounterAnimations();
        }

        initMobileMenu();
        initNavigation();
        if (typeof ensureMobileContactsVisible === 'function') ensureMobileContactsVisible();

        const navButtons = document.querySelectorAll('.hero-actions .btn');
        navButtons.forEach(button => {
            if (!button.onclick && button.textContent) {
                button.addEventListener('click', function (e) {
                    e.preventDefault();
                    const text = this.textContent.trim();
                    if (text === 'Наши услуги') scrollToSection('services');
                    else if (text === 'Акции') scrollToSection('prices');
                    else if (text === 'О нас') scrollToSection('about');
                    else if (text === 'Связаться') scrollToSection('contacts');
                    else if (text.includes('Календарь')) openCalendarModal();
                });
            }
        });

        const backToListBtn = document.getElementById('subserviceBackToListBtn');
        if (backToListBtn) {
            backToListBtn.replaceWith(backToListBtn.cloneNode(true));
            const newBackBtn = document.getElementById('subserviceBackToListBtn');

            newBackBtn.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                backToServicesList();
            });
        }
    }, 500);
})
function initWhyChooseUsAnimation() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Анимация заголовков
                const title = entry.target.querySelector('.why-choose-title');
                const subtitle = entry.target.querySelector('.why-choose-subtitle');

                if (title) title.classList.add('animate-in');
                if (subtitle) subtitle.classList.add('animate-in');

                // Анимация карточек с задержкой
                const serviceRows = entry.target.querySelectorAll('.service-row');
                serviceRows.forEach((row, index) => {
                    setTimeout(() => {
                        row.classList.add('animate-in');
                    }, index * 150);
                });
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    });

    const whyChooseSection = document.querySelector('.values-section');
    if (whyChooseSection) {
        observer.observe(whyChooseSection);
    }
}

// Инициализация анимации при загрузке страницы
document.addEventListener('DOMContentLoaded', function () {
    setTimeout(() => {
        initWhyChooseUsAnimation();
    }, 500);
})
function switchMediaTab(tabName) {
    // Убираем активный класс со всех кнопок
    const allTabs = document.querySelectorAll('.media-tab');
    allTabs.forEach(tab => {
        tab.classList.remove('active');
    });

    // Убираем активный класс со всех панелей
    const allPanels = document.querySelectorAll('.media-panel');
    allPanels.forEach(panel => {
        panel.classList.remove('active');
    });

    // Добавляем активный класс к выбранной кнопке
    const activeTab = document.querySelector(`[data-tab="${tabName}"]`);
    if (activeTab) {
        activeTab.classList.add('active');
    }

    // Показываем соответствующую панель
    const activePanel = document.getElementById(`${tabName}-panel`);
    if (activePanel) {
        activePanel.classList.add('active');
    }
}

// Делаем функцию доступной глобально
window.switchMediaTab = switchMediaTab;
// Заглушка для функции initFloatingButtonFooterInteraction
function initFloatingButtonFooterInteraction() {
    // Здесь может быть код для взаимодействия плавающей кнопки с футером
    // Пока что просто заглушка, чтобы избежать ошибки
}

// Добавляем обработчик изменения размера окна
window.addEventListener('resize', function () {
    if (typeof ensureMobileContactsVisible === 'function') {
        ensureMobileContactsVisible();
    }
});