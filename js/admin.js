// admin.js - дополнительные функции для админ-панели
document.addEventListener('DOMContentLoaded', function() {
    if (!document.querySelector('.admin-panel')) return;
    
    // Инициализация функционала админ-панели
    initAdminFunctions();
});

function initAdminFunctions() {
    // Обработка кнопок редактирования и удаления
    const editButtons = document.querySelectorAll('.edit-btn');
    const deleteButtons = document.querySelectorAll('.delete-btn');
    
    editButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const row = this.closest('tr');
            const cells = row.querySelectorAll('td:not(:last-child)');
            
            cells.forEach(cell => {
                const originalText = cell.textContent;
                cell.innerHTML = `<input type="text" value="${originalText}">`;
            });
            
            // Заменяем кнопки на подтверждение/отмену
            const actionsCell = row.querySelector('td:last-child');
            actionsCell.innerHTML = `
                <button class="btn-icon confirm-btn"><i class="fas fa-check"></i></button>
                <button class="btn-icon cancel-btn"><i class="fas fa-times"></i></button>
            `;
            
            // Обработка подтверждения
            actionsCell.querySelector('.confirm-btn').addEventListener('click', function() {
                // Здесь должна быть логика сохранения изменений на сервере
                cells.forEach(cell => {
                    const newValue = cell.querySelector('input').value;
                    cell.textContent = newValue;
                });
                
                // Возвращаем обычные кнопки
                actionsCell.innerHTML = `
                    <button class="btn-icon edit-btn"><i class="fas fa-edit"></i></button>
                    <button class="btn-icon delete-btn"><i class="fas fa-trash"></i></button>
                `;
                
                // Реинициализируем обработчики
                initAdminFunctions();
            });
            
            // Обработка отмены
            actionsCell.querySelector('.cancel-btn').addEventListener('click', function() {
                // Возвращаем оригинальные значения
                cells.forEach((cell, index) => {
                    cell.textContent = cell.querySelector('input').value;
                });
                
                // Возвращаем обычные кнопки
                actionsCell.innerHTML = `
                    <button class="btn-icon edit-btn"><i class="fas fa-edit"></i></button>
                    <button class="btn-icon delete-btn"><i class="fas fa-trash"></i></button>
                `;
                
                // Реинициализируем обработчики
                initAdminFunctions();
            });
        });
    });
    
    deleteButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            if (confirm('Вы уверены, что хотите удалить эту запись?')) {
                const row = this.closest('tr');
                // Здесь должна быть логика удаления на сервере
                row.remove();
            }
        });
    });
    
    // Экспорт данных в CSV
    const exportBtn = document.querySelector('.export-btn');
    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            // Здесь должна быть логика экспорта данных
            alert('Данные экспортированы в CSV файл');
        });
    }
    
    // Выход из админ-панели
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            if (confirm('Вы уверены, что хотите выйти из админ-панели?')) {
                // Здесь должна быть логика выхода
                window.location.href = 'index.html';
            }
        });
    }
}