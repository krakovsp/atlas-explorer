let activeTable;

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

// Закрытие окна при клике на темную область вокруг него
window.addEventListener("click", function(event) {
    const modal = document.getElementById("updates-modal");
    if (event.target === modal) {
        closeUpdatesLog();
    }
});

// 1. Функция создания таблицы
function createRemoteTable(id, url, columns) {
    const table = new Tabulator(id, {
        ajaxURL: "data/" + url,
        layout: "fitColumns",
        height: "100%",
        popupContainer: function(element) {
            const container = element.closest(".tabulator");
            return container ? container : document.body; 
        },
        columnDefaults: {
            headerHozAlign: "center",
            hozAlign: "left",
            minWidth: 60,
        }, 
        pagination: "local",       
        paginationSize: 10,        
        paginationSizeSelector: [5, 10, 20, 50, 100, true],
        langs: {
           "default": { "pagination": { "all": "all" } }
        }, 
        paginationCounter: "rows", 
        columns: columns
    }); 

    // 👇 НАДЕЖНЫЙ МЕТОД КОПИРОВАНИЯ ЯЧЕЕК (РАБОТАЕТ ЧЕРЕЗ API ДАННЫХ TABULATOR)
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

    // ДОБАВЛЕНИЕ КНОПКИ "CLEAR FILTERS" В ФУТЕР
    table.on("tableBuilt", function() {
        const tableElement = document.querySelector(id);
        if (!tableElement) return;

        const footerContents = tableElement.querySelector(".tabulator-footer-contents");
        const paginator = tableElement.querySelector(".tabulator-paginator");
        if (!footerContents || !paginator) return;

        if (footerContents.querySelector(".footer-clear-filters-btn")) return;

        const clearFiltersBtn = document.createElement("button");
        clearFiltersBtn.className = "footer-clear-filters-btn";
        clearFiltersBtn.innerHTML = "<i class='fa-solid fa-filter-circle-xmark'></i> Clear Filters";
        clearFiltersBtn.title = "Clear all column filters";

        clearFiltersBtn.onclick = function() {
            if (activeTable) {
                activeTable.clearFilter(true);
            }
        };

        paginator.insertBefore(clearFiltersBtn, paginator.firstChild);

        // 🔥 КРИТИЧЕСКИЙ ФИКС: Принудительно заставляем Tabulator 
        // пересчитать геометрию замороженных слоев ПУТЕМ ОБНОВЛЕНИЯ РАЗМЕРОВ
        setTimeout(() => {
            table.redraw(true);
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

// 2. Инициализация после загрузки DOM
document.addEventListener("DOMContentLoaded", function() {
    window.table1 = createRemoteTable("#table1-id", "data1.json", TABLE_1_COLUMNS);
    window.table2 = createRemoteTable("#table2-id", "data2.json", TABLE_2_COLUMNS);
    window.table3 = createRemoteTable("#table3-id", "data3.json", TABLE_3_COLUMNS);

    activeTable = window.table1;

    setTimeout(() => {
        if(window.table1) window.table1.redraw();
    }, 100);
});

// 3. Управління колонками
function toggleColumnPicker() {
    const picker = document.getElementById("column-picker");
    const btn = document.querySelector(".settings-btn");
    if (!picker || !activeTable) return;

    if (picker.classList.contains("show")) {
        picker.classList.remove("show");
        btn.classList.remove("active");
    } else {
        picker.innerHTML = "";
        picker.classList.add("show");
        btn.classList.add("active");

        const selectAllBtn = document.createElement("button");
        selectAllBtn.className = "picker-select-all-btn";
        selectAllBtn.innerHTML = "Show All";
        selectAllBtn.onclick = function() {
            activeTable.getColumns().forEach(column => {
                const def = column.getDefinition();
                if (def.columns) {
                    def.columns.forEach(subCol => activeTable.getColumn(subCol.field).show());
                } else if (def.field) {
                    column.show();
                }
            });
            toggleColumnPicker(); 
            toggleColumnPicker(); 
        };
        picker.appendChild(selectAllBtn);

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
        chk.onchange = () => col.toggle();
        
        label.appendChild(chk);
        label.appendChild(document.createTextNode(def.title));
        container.appendChild(label);
    }
}

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

    if (tabName === 'tab1') activeTable = window.table1;
    if (tabName === 'tab2') activeTable = window.table2;
    if (tabName === 'tab3') activeTable = window.table3;

    setTimeout(() => {
    if (activeTable) {
        activeTable.redraw(true); // Параметр true полностью пересчитывает размеры замороженных слоев
    }
}, 80);
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

// 6. Открытие модального окна предложений
function openSuggestionsModal() {
    const modal = document.getElementById("suggestions-modal");
    if (modal) modal.style.display = "flex";
}

// Закрытие модального окна предложений
function closeSuggestionsModal() {
    const modal = document.getElementById("suggestions-modal");
    if (modal) {
        modal.style.display = "none";
        document.getElementById("suggestions-form").reset(); // Очищаем форму
    }
}

// Обновление глобального перехватчика кликов на темную область вокруг окон
window.addEventListener("click", function(event) {
    const updatesModal = document.getElementById("updates-modal");
    const suggestionsModal = document.getElementById("suggestions-modal");
    
    if (event.target === updatesModal) closeUpdatesLog();
    if (event.target === suggestionsModal) closeSuggestionsModal();
});

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

let valueRowCount = 0;

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
