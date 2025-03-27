// Основной JavaScript для функциональности сайта
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация таймеров
    initCountdowns();
    
    // Переключение вкладок
    setupTabs();
    
    // Обработка отправки номинаций
    setupNominationForm();
    
    // Обработка голосования
    setupVoting();
    
    // Анимации для страницы победителей
    if (document.querySelector('.winners')) {
        animateWinners();
    }
    
    // Админ-функции
    if (document.querySelector('.admin-panel')) {
        initAdminPanel();
    }
});

// Функции для работы с таймерами
function initCountdowns() {
    // Таймер для первого этапа (номинации)
    const nominationEnd = new Date('2025-03-30T23:59:59').getTime();
    updateCountdown(nominationEnd, 'nominationCountdown');
    
    // Таймер для второго этапа (голосование)
    const votingEnd = new Date('2025-04-05T23:59:59').getTime();
    updateCountdown(votingEnd, 'votingCountdown');
    
    // Глобальный таймер
    const now = new Date().getTime();
    let targetDate;
    
    if (now < nominationEnd) {
        targetDate = nominationEnd;
        document.getElementById('countdownText').textContent = 'До окончания приема кандидатур:';
    } else if (now < votingEnd) {
        targetDate = votingEnd;
        document.getElementById('countdownText').textContent = 'До окончания голосования:';
    } else {
        document.getElementById('globalCountdown').innerHTML = '<span>Голосование завершено</span>';
        return;
    }
    
    updateCountdown(targetDate, 'globalCountdown');
}

function updateCountdown(endDate, elementId) {
    const countdownElement = document.getElementById(elementId);
    if (!countdownElement) return;
    
    const timer = setInterval(function() {
        const now = new Date().getTime();
        const distance = endDate - now;
        
        if (distance < 0) {
            clearInterval(timer);
            const timerElement = countdownElement.querySelector('.timer') || countdownElement;
            timerElement.innerHTML = '<span>Этап завершен</span>';
            return;
        }
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        if (elementId === 'globalCountdown' || elementId === 'nominationCountdown' || elementId === 'votingCountdown') {
            document.getElementById(elementId.replace('Countdown', '') + 'Days').textContent = days.toString().padStart(2, '0');
            document.getElementById(elementId.replace('Countdown', '') + 'Hours').textContent = hours.toString().padStart(2, '0');
            document.getElementById(elementId.replace('Countdown', '') + 'Minutes').textContent = minutes.toString().padStart(2, '0');
            document.getElementById(elementId.replace('Countdown', '') + 'Seconds').textContent = seconds.toString().padStart(2, '0');
        } else {
            const timerElement = countdownElement.querySelector('.timer') || countdownElement;
            timerElement.innerHTML = `
                <span>${days.toString().padStart(2, '0')}</span>д 
                <span>${hours.toString().padStart(2, '0')}</span>ч 
                <span>${minutes.toString().padStart(2, '0')}</span>м 
                <span>${seconds.toString().padStart(2, '0')}</span>с
            `;
        }
    }, 1000);
}

// Функции для переключения вкладок
function setupTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn, .admin-tab-btn');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabContainer = this.closest('.tabs, .admin-tabs');
            const tabContentId = this.getAttribute('data-tab');
            
            // Убираем активный класс у всех кнопок и контента
            tabContainer.querySelectorAll('.tab-btn, .admin-tab-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            const tabContents = tabContainer.nextElementSibling 
                ? tabContainer.nextElementSibling.querySelectorAll('.tab-content, .admin-tab-content')
                : document.querySelectorAll('.tab-content, .admin-tab-content');
            
            tabContents.forEach(content => {
                content.classList.remove('active');
            });
            
            // Добавляем активный класс текущей кнопке и соответствующему контенту
            this.classList.add('active');
            document.getElementById(tabContentId).classList.add('active');
        });
    });
}

// Функции для страницы номинаций
function setupNominationForm() {
    const submitBtn = document.querySelector('.submit-nominations');
    if (!submitBtn) return;
    
    submitBtn.addEventListener('click', function() {
        // Здесь должна быть логика отправки данных на сервер
        alert('Ваши предложения отправлены! Спасибо за участие.');
        
        // Очищаем поля после отправки
        document.querySelectorAll('.candidate-input').forEach(input => {
            input.value = '';
        });
    });
}

// Функции для страницы голосования
function setupVoting() {
    const voteButtons = document.querySelectorAll('.vote-btn');
    if (!voteButtons.length) return;
    
    voteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const candidateCard = this.closest('.candidate-card');
            const candidateName = candidateCard.querySelector('h4').textContent;
            
            // Здесь должна быть логика отправки голоса на сервер
            this.textContent = 'Голос учтен!';
            this.disabled = true;
            this.classList.add('disabled');
            
            // Временная визуализация
            candidateCard.style.borderColor = 'var(--gold)';
            candidateCard.style.boxShadow = '0 0 15px rgba(255, 215, 0, 0.5)';
            
            setTimeout(() => {
                alert(`Вы проголосовали за ${candidateName}!`);
            }, 300);
        });
    });
}

// Анимации для страницы победителей
function animateWinners() {
    const winnerCards = document.querySelectorAll('.winner-card');
    
    winnerCards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('pulse');
        }, index * 300);
    });
}

// Функции для админ-панели
function initAdminPanel() {
    // Инициализация графика (используем Chart.js)
    if (document.getElementById('votesChart')) {
        initVotesChart();
    }
    
    // Обработка добавления категорий
    const addCategoryBtn = document.querySelector('.add-category');
    if (addCategoryBtn) {
        addCategoryBtn.addEventListener('click', function() {
            const name = document.getElementById('categoryName').value;
            const type = document.getElementById('categoryType').value;
            const description = document.getElementById('categoryDescription').value;
            
            if (!name) {
                alert('Пожалуйста, введите название категории');
                return;
            }
            
            // Здесь должна быть логика отправки данных на сервер
            alert(`Категория "${name}" добавлена!`);
            
            // Очищаем поля
            document.getElementById('categoryName').value = '';
            document.getElementById('categoryDescription').value = '';
        });
    }
    
    // Обработка добавления кандидатов
    const addCandidateBtn = document.querySelector('.add-candidate');
    if (addCandidateBtn) {
        addCandidateBtn.addEventListener('click', function() {
            const category = document.getElementById('candidateCategory').value;
            const name = document.getElementById('candidateName').value;
            const description = document.getElementById('candidateDescription').value;
            
            if (!category || !name) {
                alert('Пожалуйста, заполните обязательные поля');
                return;
            }
            
            // Здесь должна быть логика отправки данных на сервер
            alert(`Кандидат "${name}" добавлен!`);
            
            // Очищаем поля
            document.getElementById('candidateName').value = '';
            document.getElementById('candidateDescription').value = '';
        });
    }
}

function initVotesChart() {
    // Это пример с использованием Chart.js, который нужно подключить в head
    const ctx = document.getElementById('votesChart').getContext('2d');
    
    // В реальном приложении данные должны приходить с сервера
    const chartData = {
        labels: ['Артем_Воронин', 'Михаил_Петрович', 'Джон_Макклейн', 'Сара_Коннор', 'Братство', 'Славяне'],
        datasets: [{
            label: 'Количество голосов',
            data: [124, 98, 104, 76, 89, 65],
            backgroundColor: [
                'rgba(255, 215, 0, 0.7)',
                'rgba(255, 193, 0, 0.7)',
                'rgba(230, 184, 0, 0.7)',
                'rgba(255, 215, 0, 0.5)',
                'rgba(255, 193, 0, 0.5)',
                'rgba(230, 184, 0, 0.5)'
            ],
            borderColor: [
                'rgba(255, 215, 0, 1)',
                'rgba(255, 193, 0, 1)',
                'rgba(230, 184, 0, 1)',
                'rgba(255, 215, 0, 0.8)',
                'rgba(255, 193, 0, 0.8)',
                'rgba(230, 184, 0, 0.8)'
            ],
            borderWidth: 1
        }]
    };
    
    const config = {
        type: 'bar',
        data: chartData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: 'var(--text-gray)'
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: 'var(--text-gray)'
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: 'var(--text-gray)'
                    }
                }
            }
        }
    };
    
    new Chart(ctx, config);
}