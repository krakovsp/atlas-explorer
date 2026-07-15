// ==========================================
// ГЛОБАЛЬНОЕ СОСТОЯНИЕ
// ==========================================
let activeTable;
let valueRowCount = 0;


// ==========================================
// ТУЛТИПЫ ЗАГОЛОВКОВ ТАБЛИЦЫ
// ==========================================

// 0. Функция-генератор для сложных структурированных тултипов
function createHeaderTooltip(definition, featuresList = [], listTitle = "Values") {
    let html = `<div class="tooltip-definition">${definition}</div>`;
    
    if (featuresList.length > 0) {
        html += `<div class="tooltip-values-title">${listTitle}:</div>`;
        html += `<ul class="tooltip-values-list">`;
        
        featuresList.forEach(item => {
            if (typeof item === "object" && item !== null) {
                html += `<li><strong>${item.value}</strong> — ${item.desc}</li>`;
            } else {
                html += `<li>${item}</li>`;
            }
        });
        
        html += `</ul>`;
    }
    return html;
}


// ==========================================
// ТАБЛИЦА (TABULATOR): СОЗДАНИЕ, КОПИРОВАНИЕ, СКРОЛЛ, ФИЛЬТРЫ, ФОРМАТТЕРЫ
// ==========================================

// 1. Функция создания таблицы
function createRemoteTable(id, url, columns) {
    const table = new Tabulator(id, {
        ajaxURL: "data/" + url,
        layout: "fitColumns",
        height: "100%",
        popupContainer: "body",
        columnDefaults: {
            headerHozAlign: "center",
            hozAlign: "left",
            minWidth: 60,
        }, 
        pagination: "local",       
        paginationSize: 20,        
        paginationSizeSelector: [5, 10, 20, 50, 100, true],
        langs: {
           "default": { "pagination": { "All": "All" } }
        }, 
        paginationCounter: "rows", 
        columns: columns
    }); 

    // МЕТОД КОПИРОВАНИЯ ЯЧЕЕК (РАБОТАЕТ ЧЕРЕЗ API ДАННЫХ TABULATOR)
    table.on("cellClick", function(e, cell) {
        const column = cell.getColumn();
        const fieldAttr = column.getField();
        
        if (fieldAttr === "actions") return;
        if (e.target.tagName === "A" || e.target.closest("a")) return;

        const plainValue = cell.getValue();
        const plainText = String(plainValue !== undefined && plainValue !== null ? plainValue : "").trim();
        
        if (!plainText || plainText === "✔" || plainText === "✘" || plainText === "true" || plainText === "false") return;

        const textArea = document.createElement("textarea");
        textArea.value = plainText;
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        document.body.appendChild(textArea);
        textArea.select();
        
        try {
            document.execCommand("copy");
            showNativeToast(e, plainText);
        } catch (err) {
            console.error("Ошибка копирования: ", err);
        }
        
        document.body.removeChild(textArea);
    });

     // ДОБАВЛЕНИЕ КНОПОК ГОРИЗОНТАЛЬНОГО СКРОЛЛА
    table.on("tableBuilt", function() {
        const tableElement = document.querySelector(id);
        if (!tableElement) return;

        const tableSection = tableElement.closest(".table-section");
        if (!tableSection) return;
        
        const settingsGroup = tableSection.querySelector(".settings-group");
        const settingsBtn = tableSection.querySelector(".settings-btn");
        if (!settingsGroup || !settingsBtn) return;

        if (settingsGroup.querySelector(".custom-scroll-controls")) return;

        const scrollControls = document.createElement("div");
        scrollControls.className = "custom-scroll-controls";

        const btnLeft = document.createElement("button");
        btnLeft.className = "scroll-arrow-btn";
        btnLeft.innerHTML = "<i class='fa-solid fa-chevron-left'></i>";
        btnLeft.title = "Scroll Left";

        const btnRight = document.createElement("button");
        btnRight.className = "scroll-arrow-btn";
        btnRight.innerHTML = "<i class='fa-solid fa-chevron-right'></i>";
        btnRight.title = "Scroll Right";

        scrollControls.appendChild(btnLeft);
        scrollControls.appendChild(btnRight);

        settingsGroup.insertBefore(scrollControls, settingsBtn);

        const scrollAmount = 300;

        btnLeft.addEventListener("click", function() {
            if (activeTable) {
                const activeTableElement = activeTable.element;
                const currentHolder = activeTableElement.querySelector(".tabulator-tableholder");
                if (currentHolder) {
                    currentHolder.scrollBy({ left: -scrollAmount, behavior: "smooth" });
                }
            }
        });

        btnRight.addEventListener("click", function() {
            if (activeTable) {
                const activeTableElement = activeTable.element;
                const currentHolder = activeTableElement.querySelector(".tabulator-tableholder");
                if (currentHolder) {
                    currentHolder.scrollBy({ left: scrollAmount, behavior: "smooth" });
                }
            }
        });
    });
  

// ДОБАВЛЕНИЕ ЭЛЕМЕНТОВ В ФУТЕР (CLEAR FILTERS И QUICK JUMP ДЛЯ ТАБЛИЦЫ 3)
    table.on("tableBuilt", function() {
        const tableElement = document.querySelector(id);
        if (!tableElement) return;

        const footerContents = tableElement.querySelector(".tabulator-footer-contents");
        const paginator = tableElement.querySelector(".tabulator-paginator");
        if (!footerContents || !paginator) return;

        // 1. Создаем кнопку Clear Filters (если её еще нет)
        let clearFiltersBtn = paginator.querySelector(".footer-clear-filters-btn");
        if (!clearFiltersBtn) {
            clearFiltersBtn = document.createElement("button");
            clearFiltersBtn.className = "footer-clear-filters-btn";
            clearFiltersBtn.innerHTML = "<i class='fa-solid fa-filter-circle-xmark'></i> Clear Filters";
            clearFiltersBtn.title = "Clear all column filters";

            clearFiltersBtn.onclick = function() {
                if (activeTable) {
                    activeTable.clearFilter(true);
                }
            };

            paginator.insertBefore(clearFiltersBtn, paginator.firstChild);
        }

        // 2. ДЛЯ ТРЕТЬЕЙ ТАБЛИЦЫ: Создаем и вставляем панель Quick Jump слева от Clear Filters
        if (id === "#table3-id" && !paginator.querySelector(".table3-anchors-bar")) {
            const anchorsBar = document.createElement("div");
            anchorsBar.className = "table3-anchors-bar footer-anchors-bar";
            anchorsBar.innerHTML = `
                <span class="anchors-label"><i class="fa-solid fa-arrows-left-right"></i> Quick Jump:</span>
                <div class="anchor-dots-group">
                    <button class="anchor-dot dot-general" data-column="Status" title="General Information">
                        <span class="dot-tooltip">General</span>
                    </button>
                    <button class="anchor-dot dot-interface" data-column="Inclusiveness" title="Interface">
                        <span class="dot-tooltip">Interface</span>
                    </button>
                    <button class="anchor-dot dot-navigation" data-column="Layout Flexibility" title="IA & Navigation">
                        <span class="dot-tooltip">Navigation</span>
                    </button>
                    <button class="anchor-dot dot-representation" data-column="Content Search" title="Content Representation">
                        <span class="dot-tooltip">Representation</span>
                    </button>
                    <button class="anchor-dot dot-functionality" data-column="Map Labels" title="Functionality">
                        <span class="dot-tooltip">Functionality</span>
                    </button>
                </div>
            `;

            // Вешаем обработчик клика на точки навигации
            const dotsGroup = anchorsBar.querySelector('.anchor-dots-group');
            if (dotsGroup) {
                dotsGroup.addEventListener('click', (event) => {
                    const button = event.target.closest('.anchor-dot');
                    if (!button) return;

                    const columnName = button.getAttribute('data-column');
                    if (columnName && typeof scrollToTable3Column === 'function') {
                        scrollToTable3Column(columnName);
                    }
                });
            }

            // Вставляем панель Quick Jump в пагинатор строго перед кнопкой Clear Filters
            paginator.insertBefore(anchorsBar, clearFiltersBtn);
        }

        setTimeout(() => {
            const holder = tableElement.querySelector(".tabulator-tableholder");
            const currentScrollLeft = holder ? holder.scrollLeft : 0; 
            
            table.redraw();
            
            if (holder && currentScrollLeft > 0) {
                holder.scrollLeft = currentScrollLeft;
            }
        }, 60);
    });

    return table;
}

// Универсальная функция уведомления (не зависит от Tabulator)
function showNativeToast(e, text) {
    const toast = document.createElement("div");
    toast.textContent = "Copied!";
    toast.style.position = "fixed";
    toast.style.left = (e.clientX + 12) + "px";
    toast.style.top = (e.clientY - 15) + "px";
    toast.style.background = "#2B2B2B"; 
    toast.style.color = "#FFF";
    toast.style.padding = "4px 10px";
    toast.style.fontSize = "13px";
    toast.style.borderRadius = "4px";
    toast.style.zIndex = "999999";
    toast.style.pointerEvents = "none";
    toast.style.fontFamily = "sans-serif";
    toast.style.boxShadow = "0 2px 8px rgba(0,0,0,0.3)";
    toast.style.transition = "all 0.3s ease";
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateY(-10px)";
    }, 400);
    
    setTimeout(() => {
        if (toast.parentNode) document.body.removeChild(toast);
    }, 700);
}

/**
 * Глобальний форматировщик для Tabulator.
 * Залишає порожні ячейки чистими, для "Yes" виводить зелену галочку, для "No" — червоний хрестик.
 */
function tabulatorTickCrossCleanFormatter(cell) {
    const val = cell.getValue();
    
    // Якщо значення відсутнє (null, undefined) або є порожнім рядком — залишаємо ячейку чистою
    if (val === null || val === undefined || val === "") {
        return ""; 
    }
    
    // Перевірка на істинність (строка "Yes", логічне true або рядок "true")
    if (val === "Yes" || val === true || val === "true") {
        return "<span class='table-tick'>✔</span>";
    }
    
    // Перевірка на хибність (строка "No", логічне false або рядок "false")
    if (val === "No" || val === false || val === "false") {
        return "<span class='table-cross'>✘</span>";
    }
    
    // Якщо прийшло будь-яке інше специфічне текстове значення — виводимо як є
    return val;
}

// 2. Ініціалізація після завантаження DOM
document.addEventListener("DOMContentLoaded", function() {
    // table2 і table3 НЕ будуємо тут — їх вкладка прихована (.tab-content{display:none}),
    // і Tabulator з layout:"fitColumns" порахує % ширини колонок по нульовій ширині
    // контейнера. Їх створення перенесено в openTab() — там вони будуються ліниво,
    // в момент першого відкриття відповідної вкладки, коли контейнер уже видимий.
    window.table1 = createRemoteTable("#table1-id", "data1.json", TABLE_1_COLUMNS);

    activeTable = window.table1;

    setTimeout(() => {
        if(window.table1) window.table1.redraw();
    }, 100);
});


// ==========================================
// УПРАВЛІННЯ КОЛОНКАМИ ТАБЛИЦІ
// ==========================================

// 3. Управління колонками
function toggleColumnPicker() {
    const picker = document.getElementById("column-picker");
    const btn = document.querySelector(".settings-btn");
    if (!picker || !activeTable) return;

    // ДОБАВЛЕНО: Закрываем Help при открытии пикера колонок
    const helpMenu = document.getElementById('help-accordion-menu');
    if (helpMenu && helpMenu.classList.contains('show')) {
        helpMenu.classList.remove('show');
    }

    if (picker.classList.contains("show")) {
        picker.classList.remove("show");
        btn.classList.remove("active");
    } else {
        picker.innerHTML = "";
        picker.classList.add("show");
        btn.classList.add("active");

        // Создаем контейнер-шапку для кнопок управления
        const controlsContainer = document.createElement("div");
        controlsContainer.className = "picker-controls";

        // КНОПКА: SHOW ALL
        const selectAllBtn = document.createElement("button");
        selectAllBtn.className = "picker-select-all-btn";
        selectAllBtn.innerHTML = "<i class='fa-solid fa-eye'></i> Show All";
        selectAllBtn.onclick = function() {
    activeTable.getColumns().forEach(column => {
        const def = column.getDefinition();
        if (def.columns) {
            def.columns.forEach(subCol => activeTable.getColumn(subCol.field).show());
        } else if (def.field) {
            column.show();
        }
    });
    activeTable.redraw(true); // <--- Пересчитываем геометрию сетки
    toggleColumnPicker(); 
    toggleColumnPicker(); 
        };

        // КНОПКА: CLEAR ALL
        const clearAllBtn = document.createElement("button");
        clearAllBtn.className = "picker-clear-all-btn";
        clearAllBtn.innerHTML = "<i class='fa-solid fa-eye-slash'></i> Clear All";
        clearAllBtn.onclick = function() {
    activeTable.getColumns().forEach(column => {
        const def = column.getDefinition();
        if (def.columns) {
            def.columns.forEach(subCol => {
                const subColumnInstance = activeTable.getColumn(subCol.field);
                if (subCol.field !== "id" && subCol.field !== "Title") {
                    subColumnInstance.hide();
                } else {
                    subColumnInstance.show();
                }
            });
        } else if (def.field) {
            if (def.field !== "id" && def.field !== "Title") {
                column.hide();
            } else {
                column.show();
            }
        }
    });
    activeTable.redraw(true); // <--- Пересчитываем геометрию сетки
    toggleColumnPicker(); 
    toggleColumnPicker(); 
      };

        // Добавляем кнопки в контейнер управления, а сам контейнер — в пикер
        controlsContainer.appendChild(selectAllBtn);
        controlsContainer.appendChild(clearAllBtn);
        picker.appendChild(controlsContainer);

        // ГЕНЕРАЦИЯ СПИСКА ЧЕКБОКСОВ (остается без изменений)
        activeTable.getColumns().forEach(column => {
            const def = column.getDefinition();
            if (def.columns) {
                def.columns.forEach(subCol => addCheckbox(picker, activeTable.getColumn(subCol.field), def.cssClass));
            } else if (def.title && def.field) {
                addCheckbox(picker, column, def.cssClass);
            }
        });
    }

    function addCheckbox(container, col, parentCssClass) {
        const def = col.getDefinition();
        const columnClass = def.cssClass || parentCssClass || "";

        const label = document.createElement("label");
        label.className = `column-item ${columnClass}`.trim();
        
        const chk = document.createElement("input");
        chk.type = "checkbox";
        chk.checked = col.isVisible();
        
        // Отключаем возможность снять галочку вручную для обязательных полей
        if (def.field === "id" || def.field === "Title") {
            chk.disabled = true;
            label.style.setProperty('color', '#7A3535', 'important');
            label.style.cursor = "not-allowed";
        }
        
        chk.onchange = () => {
    col.toggle();
    
    // Двойной requestAnimationFrame гарантирует, что браузер успел 
    // обновить colspan групповых заголовков в DOM перед тем, как Tabulator начнет расчет widths
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            if (activeTable) {
                activeTable.redraw(true);
            }
        });
    });
};
        
        label.appendChild(chk);
        label.appendChild(document.createTextNode(def.title));
        container.appendChild(label);
    }
}


// ==========================================
// ВКЛАДКИ ТА ПОВНОЕКРАННИЙ РЕЖИМ
// ==========================================

// 4. Переключення вкладок
function openTab(evt, tabName) {
    const contents = document.getElementsByClassName("tab-content");
    for (let x of contents) x.classList.remove("active");

    const buttons = document.getElementsByClassName("tab-button");
    for (let x of buttons) x.classList.remove("active");

    document.getElementById(tabName).classList.add("active");
    evt.currentTarget.classList.add("active");

    const picker = document.getElementById("column-picker");
    if (picker) picker.classList.remove("show");
    
    const btn = document.querySelector(".settings-btn");
    if (btn) btn.classList.remove("active");

    // Класс .active уже применён (строка выше) — контейнер вкладки видим,
    // поэтому таблицу для tab2/tab3 безопасно строить именно сейчас, при первом
    // открытии: Tabulator посчитает fitColumns по реальной, а не нулевой ширине.
    if (tabName === 'tab1') {
        activeTable = window.table1;
    }
    if (tabName === 'tab2') {
        if (!window.table2) {
            window.table2 = createRemoteTable("#table2-id", "data2.json", TABLE_2_COLUMNS);
        }
        activeTable = window.table2;
    }
    if (tabName === 'tab3') {
        if (!window.table3) {
            window.table3 = createRemoteTable("#table3-id", "data3.json", TABLE_3_COLUMNS);
        }
        activeTable = window.table3;
    }

    // Страховка на случай, если таблица уже существовала (повторное открытие вкладки)
    // и вдруг успела "сжаться" — досчитываем размеры после отрисовки кадра.
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            if (activeTable) {
                activeTable.redraw(true); // Параметр true полностью пересчитывает размеры замороженных слоев
            }
        });
    });
}

// 5. Повноекранний режим
function toggleFullscreen() {
    const tableSection = document.querySelector('.table-section');
    tableSection.classList.toggle('fullscreen-mode');
    
    setTimeout(() => {
        if (activeTable) {
            activeTable.redraw(true); 
        }
    }, 50);

    const escapeHandler = function(e) {
        if (e.key === "Escape" && tableSection.classList.contains('fullscreen-mode')) {
            tableSection.classList.remove('fullscreen-mode');
            setTimeout(() => { activeTable.redraw(true); }, 50);
            document.removeEventListener('keydown', escapeHandler);
        }
    };
    document.addEventListener('keydown', escapeHandler);
}


// ==========================================
// МОДАЛЬНЕ ВІКНО "UPDATES LOG"
// ==========================================

// 0.1 Функция открытия модального окна
function openUpdatesLog(event) {
    if (event) event.preventDefault();
    const modal = document.getElementById("updates-modal");
    if (modal) {
        modal.style.display = "flex";
    }
}

// Функция закрытия модального окна
function closeUpdatesLog() {
    const modal = document.getElementById("updates-modal");
    if (modal) {
        modal.style.display = "none";
    }
}


// ==========================================
// МОДАЛЬНЕ ВІКНО "SUGGESTIONS" (ФОРМА ПРОПОЗИЦІЙ)
// ==========================================

// 6. Открытие модального окна предложений
function openSuggestionsModal() {
    const modal = document.getElementById("suggestions-modal");
    if (modal) modal.style.display = "flex";
}

// Функция закрытия модального окна предложений
function closeSuggestionsModal() {
    const modal = document.getElementById("suggestions-modal");
    if (modal) {
        modal.style.display = "none";
        document.getElementById("suggestions-form").reset(); 
        
        const container = document.getElementById("dynamic-values-container");
        if (container) container.innerHTML = "";
        valueRowCount = 0; 
    }
}

// Асинхронная отправка данных формы на ваш email (Formspree API)
document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("suggestions-form");
    if (!form) return;

    form.addEventListener("submit", async function(event) {
        event.preventDefault(); // Запрещаем перезагрузку
        
        const submitBtn = form.querySelector(".form-submit-btn");
        const originalBtnText = submitBtn.textContent;
        submitBtn.textContent = "Sending...";
        submitBtn.disabled = true;

        const data = new FormData(event.target);
        
        try {
            const response = await fetch(event.target.action, {
                method: form.method,
                body: data,
                headers: { 'Accept': 'application/json' }
            });
            
            if (response.ok) {
                alert("Thank you! Your suggestion has been successfully sent.");
                closeSuggestionsModal();
            } else {
                alert("Oops! There was a problem submitting your form. Please try again.");
            }
        } catch (error) {
            alert("Network error. Could not send the data.");
        } finally {
            submitBtn.textContent = originalBtnText;
            submitBtn.disabled = false;
        }
    });
});

// Функция динамического добавления пары полей
function addAttributeValueRow() {
    valueRowCount++;
    const container = document.getElementById("dynamic-values-container");
    if (!container) return;

    // Создаем обертку для строки
    const row = document.createElement("div");
    row.className = "form-group-row dynamic-value-row";
    row.id = `value-row-${valueRowCount}`;

    // 👇 ИСПРАВЛЕНО: Убраны атрибуты required из инпутов
    row.innerHTML = `
        <div class="form-group">
            <input type="text" name="Value ${valueRowCount}" placeholder="e.g., External">
        </div>
        <div class="form-group">
            <input type="text" name="Value Definition ${valueRowCount}" placeholder="Explanation of the value...">
        </div>
        <button type="button" class="remove-value-btn" onclick="removeAttributeValueRow(${valueRowCount})" title="Remove row">&times;</button>
    `;

    container.appendChild(row);
}

// Функция удаления конкретной строки
function removeAttributeValueRow(id) {
    const row = document.getElementById(`value-row-${id}`);
    if (row) row.remove();
}


// ==========================================
// МОДАЛЬНІ ВІКНА "SUPPLEMENTARY MATERIALS" ТА "MATERIAL CONTENT" (ГЛОСАРІЙ)
// ==========================================

// Функция модального окна Дополнительных материалов
function openSupplementaryModal(event) {
    if (event) event.preventDefault();
    const modal = document.getElementById("supplementary-modal");
    if (modal) modal.style.display = "flex";
}

function closeSupplementaryModal() {
    const modal = document.getElementById("supplementary-modal");
    if (modal) modal.style.display = "none";
}

// Универсальный обработчик выбора материала
function handleMaterialClick(element) {
    const type = element.getAttribute("data-type");
    const target = element.getAttribute("data-target");

    if (type === "external") {
        // Сценарий 1: Открытие стороннего сайта в новой вкладке
        window.open(target, "_blank");
    } else if (type === "internal") {
        // Сценарий 2: Открытие вложенного модального окна на нашем сайте
        openInternalMaterialModal(target);
    }
}

// Логіка відображення внутрішнього контенту (Глосарій)
function openInternalMaterialModal(materialId) {
    closeSupplementaryModal();
    
    const contentModal = document.getElementById("material-content-modal");
    const tbody = document.getElementById("glossary-table-tbody");
    
    if (!contentModal || !tbody) return;

    if (materialId === 'glossary-terms') {
        tbody.innerHTML = "";
        
        // По умолчанию используется стандартная (default) группа
        let currentGroup = "default"; 

        GLOSSARY_DATA.forEach(item => {
            
            // ТИП 4: Заголовок секции
            if (item.isSection) {
                // Если group не задан, сбрасываем на default (раньше/обычный беж)
                currentGroup = item.group || "default"; 

                const row = document.createElement("tr");
                row.className = `glossary-section-title-row group-${currentGroup}`;
                
                // 👇 ДИНАМІЧНО ДОДАЄМО ID ДЛЯ ПРАВИЛЬНОЇ НАВІГАЦІЇ
                row.id = `sec-${currentGroup}`; 
                
                row.innerHTML = `
                    <td class="cell-index">${item.number || ""}</td>
                    <td colspan="3" class="section-text-centered">${item.term}</td>
                `;
                tbody.appendChild(row);
                return;
            }

            // ТИП 3: Структурированный массив (с nested элементами)
            if (item.nested && Array.isArray(item.nested)) {
                
                const headerRow = document.createElement("tr");
                headerRow.className = `glossary-group-header group-${currentGroup}`;
                headerRow.innerHTML = `
                    <td class="cell-index">${item.number || ""}</td>
                    <td class="cell-term">${item.term}</td>
                    <td><span class="category-text"></span></td>
                    <td class="cell-definition">${item.definition}</td>
                `;
                tbody.appendChild(headerRow);

                item.nested.forEach(subItem => {
                    const row = document.createElement("tr");
                    row.className = `glossary-group-row group-${currentGroup}`;
                    row.innerHTML = `
                        <td class="cell-index"></td>
                        <td class="cell-term">${subItem.term}</td>
                        <td><span class="category-text">${subItem.category || ""}</span></td>
                        <td class="cell-definition">${subItem.definition}</td>
                    `;
                    tbody.appendChild(row);
                });

            } else {
                // ТИП 1 и 2: Одиночные строки
                const row = document.createElement("tr");
                row.className = `glossary-normal-row group-${currentGroup}`;
                
                const categoryContent = item.category 
                    ? `<span class="category-text">${item.category}</span>` 
                    : `<span class="category-text"></span>`;

                row.innerHTML = `
                    <td class="cell-index">${item.number || ""}</td>
                    <td class="cell-term">${item.term}</td>
                    <td>${categoryContent}</td>
                    <td class="cell-definition">${item.definition}</td>
                `;
                tbody.appendChild(row);
            }
        });
    }

    contentModal.style.display = "flex";
}

function closeMaterialContentModal() {
    const contentModal = document.getElementById("material-content-modal");
    if (contentModal) contentModal.style.display = "none";
}

// Функція повернення назад до модального вікна Supplementary
function goBackToSupplementary() {
    closeMaterialContentModal(); // Закриваємо поточне вікно (Глосарій)
    openSupplementaryModal();    // Відкриваємо попереднє модальне вікно
}


// ==========================================
// ЗАКРИТТЯ МОДАЛЬНИХ ВІКОН КЛІКОМ ПО ТЕМНІЙ ОБЛАСТІ
// ==========================================

// Закрытие окна при клике на темную область вокруг него
window.addEventListener("click", function(event) {
    const updatesModal = document.getElementById("updates-modal");
    const suggestionsModal = document.getElementById("suggestions-modal");
    
    if (event.target === updatesModal) closeUpdatesLog();
    if (event.target === suggestionsModal) closeSuggestionsModal();
});


// ==========================================
// ЛОГИКА ДЛЯ HELP-АККОРДЕОНА (ИЗ HTML)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const helpBtn = document.getElementById('help-trigger-btn');
    const helpMenu = document.getElementById('help-accordion-menu');
    
    if (!helpBtn || !helpMenu) return;

    // Открыть / Закрыть меню Help
    helpBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        
        // Закрываем picker колонок, если он открыт
        const picker = document.getElementById("column-picker");
        const settingsBtn = document.querySelector(".settings-btn");
        if (picker && picker.classList.contains("show")) {
            picker.classList.remove("show");
            if (settingsBtn) settingsBtn.classList.remove("active");
        }

        helpMenu.classList.toggle('show');
    });

    // Клик по рубрикам внутри аккордеона
    const headers = helpMenu.querySelectorAll('.help-accordion-header');
    headers.forEach(header => {
        header.addEventListener('click', (e) => {
            e.stopPropagation();
            
            const currentItem = header.parentElement;
            const currentContent = currentItem.querySelector('.help-accordion-content');
            const isOpen = currentItem.classList.contains('open');

            // Закрываем остальные открытые рубрики
            helpMenu.querySelectorAll('.help-accordion-item').forEach(item => {
                item.classList.remove('open');
                item.querySelector('.help-accordion-content').style.maxHeight = null;
            });

            // Открываем текущую рубрику
            if (!isOpen) {
                currentItem.classList.add('open');
                currentContent.style.maxHeight = currentContent.scrollHeight + "px";
            }
        });
    });

    // Глобальный клик "мимо" для закрытия всего меню (включая Fullscreen)
    document.addEventListener('click', (event) => {
        const helpContainer = document.querySelector('.help-container');
        if (helpMenu.classList.contains('show') && helpContainer && !helpContainer.contains(event.target)) {
            helpMenu.classList.remove('show');
            
            helpMenu.querySelectorAll('.help-accordion-item').forEach(item => {
                item.classList.remove('open');
                item.querySelector('.help-accordion-content').style.maxHeight = null;
            });
        }
    });
});


// ==========================================
// НАВІГАЦІЯ ПО ЯКОРЯХ ГЛОСАРІЮ
// ==========================================
document.querySelectorAll('.glossary-nav-menu a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

/**
 * Плавно прокручивает третью таблицу (table3) к указанной колонке по её field name.
 * @param {string} columnField - Название поля колонки (field), к которой нужно скроллить.
 */
function scrollToTable3Column(columnField) {
    // 1. Проверяем, инициализирована ли таблица 3 и активна ли она
    if (window.table3) {
        // 2. Метод Tabulator scrollToColumn возвращает Promise и плавно скроллит к колонке.
        // Передаем true во второй параметр для выравнивания по левому краю (left) и "smooth" для анимации.
        window.table3.scrollToColumn(columnField, "left", true)
            .catch(err => {
                console.warn(`Не удалось прокрутить к колонке "${columnField}":`, err);
            });
    } else {
        console.warn("Таблица table3 еще не инициализирована. Скроллинг невозможен.");
    }
}
