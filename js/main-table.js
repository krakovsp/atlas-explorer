/**
 * ATLAS EXPLORER — TABLE CORE
 *
 * ОГЛАВЛЕНИЕ
 * 1. Глобальное состояние
 * 2. Рабочая выборка строк (Row Selection)
 * 3. Состояние представлений таблицы
 * 4. Тултипы заголовков
 * 5. Tabulator: инициализация и основная логика
 * 6. Глобальные фильтры, копирование и форматтеры
 * 7. Column Picker
 * 8. Вкладки, fullscreen и навигация по колонкам
 *
 */

// ============================================================
// 1. ГЛОБАЛЬНОЕ СОСТОЯНИЕ
// ============================================================

let table;
let activeTable;

// Глобальное состояние header-фильтров.
// Ключ — field колонки, значение — значение фильтра.
let globalHeaderFilters = {};

let currentTab = "tab1";


// ============================================================
// 2. РАБОЧАЯ ВЫБОРКА СТРОК (ROW SELECTION)
// ============================================================

const ROW_SELECTOR_FIELD = "__rowSelector";

let rowSelectionMode = false;
let rowSubsetActive = false;
let selectedRowIds = new Set();
let draftSelectedRowIds = new Set();

// 2.1 Нормализация ID строки.
function normalizeRowId(value) {
    return String(value ?? "").trim();
}

// 2.2 Получение базового набора колонок для вкладки.
function getBaseColumnsForTab(tabName) {
    if (tabName === "tab2") return TABLE_2_COLUMNS;
    if (tabName === "tab3") return TABLE_3_COLUMNS;
    return TABLE_1_COLUMNS;
}

// 2.3 Конфигурация служебной колонки выбора строк.
const ROW_SELECTOR_COLUMN = {
    title: "",
    field: ROW_SELECTOR_FIELD,
    width: 44,
    minWidth: 44,
    maxWidth: 44,
    headerSort: false,
    resizable: false,
    hozAlign: "center",
    headerHozAlign: "center",
    cssClass: "row-selection-column",

    // 2.3.1 Создание checkbox и синхронизация чернового набора ID.
    formatter: function(cell) {
        const rowData = cell.getRow().getData();
        const rowId = normalizeRowId(rowData.id);

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "row-select-checkbox";
        checkbox.checked = draftSelectedRowIds.has(rowId);

        const rowTitle = rowData.Title ? `: ${rowData.Title}` : "";
        checkbox.setAttribute(
            "aria-label",
            `Select row ${rowId}${rowTitle}`
        );

        checkbox.addEventListener("click", event => {
            event.stopPropagation();
        });

        checkbox.addEventListener("change", event => {
            event.stopPropagation();

            if (checkbox.checked) {
                draftSelectedRowIds.add(rowId);
            } else {
                draftSelectedRowIds.delete(rowId);
            }

            updateRowSelectionControls();
        });

        return checkbox;
    }
};

// 2.4 Формирование набора колонок с учётом режима выбора строк.
function getColumnsForTab(tabName) {
    const baseColumns = getBaseColumnsForTab(tabName);

    if (!rowSelectionMode) {
        return baseColumns;
    }

    return [ROW_SELECTOR_COLUMN, ...baseColumns];
}

// 2.5 Фильтр активной рабочей выборки.
function rowSubsetFilter(rowData) {
    return selectedRowIds.has(normalizeRowId(rowData.id));
}

// 2.6 Применение рабочей выборки к Tabulator.
function applyRowSubsetFilter() {
    if (!table) return;

    // В текущей архитектуре это единственный programmatic filter.
    // Header filters существуют отдельно и этим вызовом не затрагиваются.
    table.clearFilter();

    if (rowSubsetActive && selectedRowIds.size > 0) {
        table.setFilter(rowSubsetFilter);
    }
}

// 2.7 Перестроение колонок с восстановлением фильтров и состояния.
function rebuildCurrentColumns() {
    if (!table) return Promise.resolve();

    saveCurrentHeaderFilters();
    saveViewState(currentTab);

    const columnsPromise = table.setColumns(
        getColumnsForTab(currentTab)
    );

    return Promise.resolve(columnsPromise).then(() => {
        return new Promise(resolve => {
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    restoreGlobalHeaderFilters();
                    restoreViewState(currentTab);
                    updateRowSelectionControls();
                    positionRowSelectionMenu();
                    resolve();
                });
            });
        });
    });
}


// 2.8 Позиционирование меню действий Row Selection.
function positionRowSelectionMenu() {
    const trigger = document.querySelector(".row-selection-trigger-btn");
    const menu = document.querySelector(".row-selection-actions-menu");

    if (
        !trigger ||
        !menu ||
        !menu.classList.contains("show")
    ) {
        return;
    }

    const triggerRect = trigger.getBoundingClientRect();
    const gap = 8;
    const viewportPadding = 12;

    menu.style.left = "auto";

    // Правый край меню совпадает с правым краем кнопки Select Rows.
    menu.style.right =
        Math.max(
            viewportPadding,
            window.innerWidth - triggerRect.right
        ) + "px";

    const tableSection = document.querySelector(".table-section");
    const isFullscreen =
        tableSection?.classList.contains("fullscreen-mode");

    /*
     * В обычном режиме меню всегда раскрывается вверх — к Intro.
     * В fullscreen сверху нет свободного пространства, поэтому меню
     * разворачивается вниз от панели управления.
     */
    if (isFullscreen) {
        menu.style.bottom = "auto";
        menu.style.top = (triggerRect.bottom + gap) + "px";
        menu.dataset.placement = "bottom";
    } else {
        menu.style.top = "auto";
        menu.style.bottom =
            (window.innerHeight - triggerRect.top + gap) + "px";
        menu.dataset.placement = "top";
    }
}

// 2.9 Открытие меню Row Selection.
function openRowSelectionMenu() {
    const menu = document.querySelector(".row-selection-actions-menu");
    const trigger = document.querySelector(".row-selection-trigger-btn");

    if (!menu || !trigger) return;

    menu.classList.add("show");
    menu.setAttribute("aria-hidden", "false");
    trigger.setAttribute("aria-expanded", "true");

    requestAnimationFrame(() => {
        positionRowSelectionMenu();
    });
}

// 2.10 Закрытие меню Row Selection.
function closeRowSelectionMenu() {
    const menu = document.querySelector(".row-selection-actions-menu");
    const trigger = document.querySelector(".row-selection-trigger-btn");

    if (menu) {
        menu.classList.remove("show");
        menu.setAttribute("aria-hidden", "true");
    }

    if (trigger) {
        trigger.setAttribute("aria-expanded", "false");
    }
}

// 2.11 Переключение видимости меню Row Selection.
function toggleRowSelectionMenu() {
    const menu = document.querySelector(".row-selection-actions-menu");

    if (!menu) return;

    if (menu.classList.contains("show")) {
        closeRowSelectionMenu();
    } else {
        openRowSelectionMenu();
    }
}


// 2.12 Синхронизация подписей и состояний кнопок Row Selection.
function updateRowSelectionControls() {
    const triggerButton = document.querySelector(
        ".row-selection-trigger-btn"
    );
    const applyButton = document.querySelector(
        ".row-selection-apply-btn"
    );
    const resetButton = document.querySelector(
        ".row-selection-reset-btn"
    );

    if (!triggerButton || !applyButton || !resetButton) return;

    triggerButton.classList.remove("is-editing", "is-active");

    if (rowSelectionMode) {
        triggerButton.innerHTML =
            `<i class="fa-solid fa-list-check"></i>` +
            `<span>Select Rows</span>`;

        triggerButton.title = "Row selection is active";
        triggerButton.classList.add("is-editing");

        applyButton.innerHTML =
            `<i class="fa-solid fa-check"></i>` +
            `<span>Apply Selection (${draftSelectedRowIds.size})</span>`;
        applyButton.disabled = draftSelectedRowIds.size === 0;

        if (rowSubsetActive) {
            resetButton.innerHTML =
                `<i class="fa-solid fa-rotate-left"></i>` +
                `<span>Reset Selection</span>`;
            resetButton.title =
                "Remove the working subset and return to all rows";
            resetButton.disabled = false;
        } else {
            resetButton.innerHTML =
                `<i class="fa-solid fa-eraser"></i>` +
                `<span>Clear Selection</span>`;
            resetButton.title = "Clear all currently selected rows";
            resetButton.disabled = draftSelectedRowIds.size === 0;
        }

        return;
    }

    if (rowSubsetActive) {
        triggerButton.innerHTML =
            `<i class="fa-solid fa-list-check"></i>` +
            `<span>Selected Rows: ${selectedRowIds.size}</span>`;

        triggerButton.title = "Edit the current row selection";
        triggerButton.classList.add("is-active");
        return;
    }

    triggerButton.innerHTML =
        `<i class="fa-solid fa-list-check"></i>` +
        `<span>Select Rows</span>`;
    triggerButton.title = "Create a working subset of atlas rows";
}


// 2.13 Создание и размещение элементов управления Row Selection.
function ensureRowSelectionControls(settingsGroup, settingsButton) {
    if (!settingsGroup || !settingsButton) return;

    const existingControls = settingsGroup.querySelector(
        ".row-selection-controls"
    );

    if (existingControls) {
        // Всегда держим Select Rows после стрелок и перед Show/Hide Columns.
        settingsGroup.insertBefore(existingControls, settingsButton);
        updateRowSelectionControls();
        return;
    }

    const controls = document.createElement("div");
    controls.className = "row-selection-controls";

    const triggerButton = document.createElement("button");
    triggerButton.type = "button";
    triggerButton.className = "row-selection-trigger-btn";
    triggerButton.setAttribute("aria-haspopup", "true");
    triggerButton.setAttribute("aria-expanded", "false");

    const actionsMenu = document.createElement("div");
    actionsMenu.className = "row-selection-actions-menu";
    actionsMenu.setAttribute("aria-hidden", "true");

    const applyButton = document.createElement("button");
    applyButton.type = "button";
    applyButton.className =
        "row-selection-action-btn row-selection-apply-btn";

    const resetButton = document.createElement("button");
    resetButton.type = "button";
    resetButton.className =
        "row-selection-action-btn row-selection-reset-btn";

    const cancelButton = document.createElement("button");
    cancelButton.type = "button";
    cancelButton.className =
        "row-selection-action-btn row-selection-cancel-btn";
    cancelButton.innerHTML =
        `<i class="fa-solid fa-xmark"></i>` +
        `<span>Cancel</span>`;
    cancelButton.title = "Cancel row selection";

    triggerButton.addEventListener("click", event => {
        event.stopPropagation();

        if (rowSelectionMode) {
            toggleRowSelectionMenu();
            return;
        }

        startRowSelection();
    });

    applyButton.addEventListener("click", event => {
        event.stopPropagation();
        applySelectedRows();
    });

    resetButton.addEventListener("click", event => {
        event.stopPropagation();

        if (rowSubsetActive) {
            resetRowSelection();
        } else {
            clearDraftRowSelection();
        }
    });

    cancelButton.addEventListener("click", event => {
        event.stopPropagation();
        cancelRowSelection();
    });

    actionsMenu.append(
        applyButton,
        resetButton,
        cancelButton
    );

    controls.append(triggerButton, actionsMenu);
    settingsGroup.insertBefore(controls, settingsButton);

    updateRowSelectionControls();

    if (!window.__rowSelectionMenuResizeBound) {
        window.addEventListener("resize", () => {
            positionRowSelectionMenu();
        });

        window.__rowSelectionMenuResizeBound = true;
    }
}


// 2.14 Запуск режима выбора строк.
function startRowSelection() {
    if (!table || rowSelectionMode) return;

    closeHelpMenu();

    const picker = document.getElementById("column-picker");
    const settingsButton = document.querySelector(".settings-btn");

    if (picker) picker.classList.remove("show");
    if (settingsButton) settingsButton.classList.remove("active");

    draftSelectedRowIds = rowSubsetActive
        ? new Set(selectedRowIds)
        : new Set();

    rowSelectionMode = true;

    // Во время редактирования показываем доступные строки снова,
    // сохраняя все активные header filters.
    table.clearFilter();

    rebuildCurrentColumns().then(() => {
        updateRowSelectionControls();
        openRowSelectionMenu();
    });
}

// 2.15 Применение выбранных строк как рабочей выборки.
function applySelectedRows() {
    if (
        !table ||
        !rowSelectionMode ||
        draftSelectedRowIds.size === 0
    ) {
        return;
    }

    selectedRowIds = new Set(draftSelectedRowIds);
    rowSubsetActive = true;
    rowSelectionMode = false;

    closeRowSelectionMenu();
    applyRowSubsetFilter();

    rebuildCurrentColumns().then(() => {
        if (typeof table.setPage === "function") {
            table.setPage(1);
        }
    });
}

// 2.16 Очистка чернового выбора строк.
function clearDraftRowSelection() {
    if (!table || !rowSelectionMode) return;

    draftSelectedRowIds.clear();

    table.redraw(true);
    updateRowSelectionControls();
}

// 2.17 Отмена редактирования выбора строк.
function cancelRowSelection() {
    if (!table || !rowSelectionMode) return;

    rowSelectionMode = false;
    draftSelectedRowIds = new Set(selectedRowIds);

    closeRowSelectionMenu();
    applyRowSubsetFilter();
    rebuildCurrentColumns();
}

// 2.18 Полный сброс рабочей выборки.
function resetRowSelection() {
    if (!table) return;

    selectedRowIds.clear();
    draftSelectedRowIds.clear();

    rowSubsetActive = false;
    rowSelectionMode = false;

    closeRowSelectionMenu();

    // Удаляем только programmatic row-scope filter.
    // Header filters остаются активными.
    table.clearFilter();

    updateRowSelectionControls();
    rebuildCurrentColumns().then(() => {
        if (typeof table.setPage === "function") {
            table.setPage(1);
        }
    });
}

// ============================================================
// 3. СОСТОЯНИЕ ПРЕДСТАВЛЕНИЙ ТАБЛИЦЫ
// ============================================================

// 3.1 Хранилище состояния трёх представлений.
const viewStates = {
    tab1: {
        columnVisibility: {},
        scrollLeft: 0
    },

    tab2: {
        columnVisibility: {},
        scrollLeft: 0
    },

    tab3: {
        columnVisibility: {},
        scrollLeft: 0
    }
};

// 3.2 Сохранение видимости колонок и горизонтального скролла.
function saveViewState(tabName) {
    if (!table || !tabName) return;

    const state = viewStates[tabName];

    if (!state) return;

    // Сохраняем видимость колонок
    state.columnVisibility = {};

    table.getColumns().forEach(column => {
        const field = column.getField();

        if (!field || field === ROW_SELECTOR_FIELD) return;

        state.columnVisibility[field] = column.isVisible();
    });

    // Сохраняем горизонтальный scroll
    const holder = document.querySelector(
        "#table1-id .tabulator-tableholder"
    );

    if (holder) {
        state.scrollLeft = holder.scrollLeft;
    }
}

// 3.3 Восстановление состояния выбранной вкладки.
function restoreViewState(tabName) {
    if (!table || !tabName) return;

    const state = viewStates[tabName];

    if (!state) return;

    // Восстанавливаем видимость колонок
    Object.entries(state.columnVisibility).forEach(
        ([field, visible]) => {

            const column = table.getColumn(field);

            if (!column) return;

            if (visible) {
                column.show();
            } else {
                column.hide();
            }
        }
    );

    // Tabulator должен закончить перестроение DOM
    requestAnimationFrame(() => {

        requestAnimationFrame(() => {

            if (table) {
                table.redraw(true);
            }

            requestAnimationFrame(() => {

                const holder = document.querySelector(
                    "#table1-id .tabulator-tableholder"
                );

                if (!holder) return;

                holder.scrollLeft = state.scrollLeft || 0;

            });

        });

    });
}


// ============================================================
// 4. ТУЛТИПЫ ЗАГОЛОВКОВ ТАБЛИЦЫ
// ============================================================

// 4.1 Генерация содержимого структурированного тултипа.
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


// 4.2 Создание DOM-оболочки тултипа атрибута.
function createAttributeTooltip(column, content) {
    const columnDefinition = column?.getDefinition?.() || {};

    const rawTitle =
        columnDefinition.title ||
        columnDefinition.field ||
        "Attribute";

    /* Удаляем возможную HTML-разметку из названия колонки */
    const titleParser = document.createElement("div");
    titleParser.innerHTML = String(rawTitle);

    const title =
        titleParser.textContent.trim() ||
        columnDefinition.field ||
        "Attribute";

    const tooltip = document.createElement("section");
    tooltip.className = "attribute-tooltip";

    const tooltipHeader = document.createElement("header");
    tooltipHeader.className = "attribute-tooltip__header";

    const heading = document.createElement("h3");
    heading.className = "attribute-tooltip__title";
    heading.textContent = title;

    const tooltipBody = document.createElement("div");
    tooltipBody.className = "attribute-tooltip__body";

    if (content instanceof Node) {
        tooltipBody.append(content);
    } else {
        tooltipBody.innerHTML = String(content);
    }

    tooltipHeader.append(heading);
    tooltip.append(tooltipHeader, tooltipBody);
    
        return tooltip;
    }


// 4.3 Подключение единого оформления к headerTooltip колонок.
function prepareHeaderTooltips(columns) {
    columns.forEach(columnDefinition => {
        /* Поддержка сгруппированных колонок */
        if (Array.isArray(columnDefinition.columns)) {
            prepareHeaderTooltips(columnDefinition.columns);
        }

        if (typeof columnDefinition.headerTooltip !== "function") {
            return;
        }

        const originalTooltip = columnDefinition.headerTooltip;

        columnDefinition.headerTooltip = function (
            event,
            column,
            onRendered
        ) {
            
        
            const content = originalTooltip.call(
                this,
                event,
                column,
                onRendered
            );
        
            if (content === false || content == null) {
                return false;
            }
        
            return createAttributeTooltip(column, content);
        };
    });

    return columns;
}

// ============================================================
// 5. TABULATOR: ИНИЦИАЛИЗАЦИЯ И ОСНОВНАЯ ЛОГИКА
// ============================================================

// 5.1 Подготовка тултипов и первичная инициализация таблицы.
document.addEventListener("DOMContentLoaded", function() {
    prepareHeaderTooltips(TABLE_1_COLUMNS);
    prepareHeaderTooltips(TABLE_2_COLUMNS);
    prepareHeaderTooltips(TABLE_3_COLUMNS);

    table = createRemoteTable(
        "#table1-id",
        "data.json",
        TABLE_1_COLUMNS
    );

    activeTable = table;

    setTimeout(() => {
        if (table) {
            table.redraw();
        }
    }, 100);
});

// 5.2. Служебная маркировка ячеек с неопределёнными значениями.
// ============================================================
// UNCERTAIN CELLS
// ============================================================

// Закрытие всплывающего окна сомнительного значения
function hideUncertainTooltip() {
    const tooltip = document.querySelector(
        ".cell-uncertainty-tooltip"
    );

    if (tooltip) {
        tooltip.remove();
    }
}


// Показ всплывающего окна сомнительного значения
function showUncertainTooltip(cell, note) {
    hideUncertainTooltip();

    if (!note) return;

    const tooltip = document.createElement("div");
    tooltip.className =
        "tabulator-tooltip cell-uncertainty-tooltip";

    const content = document.createElement("section");
    content.className = "attribute-tooltip";

    // Заголовок
    const tooltipHeader = document.createElement("header");
    tooltipHeader.className = "attribute-tooltip__header";

    const heading = document.createElement("h3");
    heading.className = "attribute-tooltip__title";
    heading.textContent = "Uncertainty Note";

    tooltipHeader.appendChild(heading);

    // Причина неопределённости
    const tooltipBody = document.createElement("div");
    tooltipBody.className = "attribute-tooltip__body";

    const explanation = document.createElement("div");
    explanation.className = "tooltip-definition";
    explanation.textContent = note;

    tooltipBody.appendChild(explanation);

    content.append(tooltipHeader, tooltipBody);
    tooltip.appendChild(content);

    document.body.appendChild(tooltip);
}


// Маркировка только указанных ячеек строки
function applyUncertainCellMarkers(row) {
    const rowData = row.getData();

    const uncertain =
        rowData.__uncertain &&
        typeof rowData.__uncertain === "object" &&
        !Array.isArray(rowData.__uncertain)
            ? rowData.__uncertain
            : {};

    row.getCells().forEach(cell => {
        const field = cell.getColumn().getField();
        const element = cell.getElement();

        if (!element || !field) return;

        // Сбрасываем состояние на случай redraw / смены вкладки
        element.classList.remove("cell-uncertain");
        element.onmouseenter = null;
        element.onmouseleave = null;

        if (
            !Object.prototype.hasOwnProperty.call(
                uncertain,
                field
            )
        ) {
            return;
        }

        const note = String(
            uncertain[field] ?? ""
        ).trim();

        if (!note) return;

        element.classList.add("cell-uncertain");

        element.onmouseenter = function() {
            showUncertainTooltip(cell, note);
        };

        element.onmouseleave = function() {
            hideUncertainTooltip();
        };
    });
}

// 5.3 Создание и настройка единого экземпляра Tabulator.
function createRemoteTable(id, url, columns) {

    const table = new Tabulator(id, {
        ajaxURL: "data/" + url,
        layout: "fitColumns",
        height: "100%",
        popupContainer: "body",
        rowFormatter: applyUncertainCellMarkers,
        columnDefaults: {
            headerHozAlign: "center",
            hozAlign: "left",
            minWidth: 60,
            resizable: true,
        }, 
        pagination: "local",       
        paginationSize: true,        
        paginationSizeSelector: [5, 10, 20, 50, 100, true],
        langs: {
           "default": { "pagination": { "All": "All" } }
        }, 
        paginationCounter: "rows", 
        columns: columns
    });

    // 5.3.1 Синхронизация глобального состояния header-фильтров.
    table.on("headerFilterChanged", function(field, value) {

    if (
        value === null ||
        value === undefined ||
        value === "" ||
        (Array.isArray(value) && value.length === 0)
    ) {
        delete globalHeaderFilters[field];
    } else {
        globalHeaderFilters[field] = value;
    }

});


    // МЕТОД КОПИРОВАНИЯ ЯЧЕЕК (РАБОТАЕТ ЧЕРЕЗ API ДАННЫХ TABULATOR)
    // 5.3.2 Копирование значения ячейки по клику.
    table.on("cellClick", function(e, cell) {
        const column = cell.getColumn();
        const fieldAttr = column.getField();
        
        if (fieldAttr === "actions" || fieldAttr === ROW_SELECTOR_FIELD) return;
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
    // 5.3.3 Создание горизонтальных стрелок и Row Selection controls.
    table.on("tableBuilt", function() {
        const tableElement = document.querySelector(id);
        if (!tableElement) return;

        const tableSection = tableElement.closest(".table-section");
        if (!tableSection) return;
        
        const settingsGroup = tableSection.querySelector(".settings-group");
        const settingsBtn = tableSection.querySelector(".settings-btn");
        if (!settingsGroup || !settingsBtn) return;

        const existingScrollControls = settingsGroup.querySelector(
            ".custom-scroll-controls"
        );

        if (existingScrollControls) {
            // Стрелки уже существуют: просто гарантируем правильное место
            // Row Selection между стрелками и Show/Hide Columns.
            ensureRowSelectionControls(settingsGroup, settingsBtn);
            return;
        }

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

        // Row Selection должен идти строго после стрелок
        // и непосредственно перед Show/Hide Columns.
        ensureRowSelectionControls(settingsGroup, settingsBtn);

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
    // 5.3.4 Создание элементов футера: Clear Filters и Quick Jump.
    table.on("tableBuilt", function() {
        const tableElement = document.querySelector(id);
        if (!tableElement) return;

        const footerContents = tableElement.querySelector(".tabulator-footer-contents");
        const paginator = tableElement.querySelector(".tabulator-paginator");
        if (!footerContents || !paginator) return;

        // 5.2.4.1 Создаём кнопку Clear Filters, если её ещё нет.
        let clearFiltersBtn = paginator.querySelector(".footer-clear-filters-btn");
        if (!clearFiltersBtn) {
            clearFiltersBtn = document.createElement("button");
            clearFiltersBtn.className = "footer-clear-filters-btn";
            clearFiltersBtn.innerHTML = "<i class='fa-solid fa-filter-circle-xmark'></i> Clear Filters";
            clearFiltersBtn.title = "Clear all column filters";

           clearFiltersBtn.onclick = function() {
    clearGlobalFilters();
};

            paginator.insertBefore(clearFiltersBtn, paginator.firstChild);
        }

        // 5.3.4.2 Создаём панель Quick Jump.
// Она принадлежит единому Tabulator, но отображается только в третьем представлении.
if (!paginator.querySelector(".table3-anchors-bar")) {
    const anchorsBar = document.createElement("div");
    anchorsBar.className = "table3-anchors-bar footer-anchors-bar";
    anchorsBar.style.display = "none";

    anchorsBar.innerHTML = `
        <span class="anchors-label">
            <i class="fa-solid fa-arrows-left-right"></i> Quick Jump:
        </span>

        <div class="anchor-dots-group">
            <button class="anchor-dot dot-general"
                    data-column="Status"
                    title="General Information">
                <span class="dot-tooltip">General</span>
            </button>

            <button class="anchor-dot dot-interface"
                    data-column="Inclusiveness"
                    title="Interface">
                <span class="dot-tooltip">Interface</span>
            </button>

            <button class="anchor-dot dot-navigation"
                    data-column="Layout Flexibility"
                    title="IA & Navigation">
                <span class="dot-tooltip">Navigation</span>
            </button>

            <button class="anchor-dot dot-representation"
                    data-column="Content Search"
                    title="Content Representation">
                <span class="dot-tooltip">Representation</span>
            </button>

            <button class="anchor-dot dot-functionality"
                    data-column="Map Labels"
                    title="Functionality">
                <span class="dot-tooltip">Functionality</span>
            </button>
        </div>
    `;

    const dotsGroup = anchorsBar.querySelector(".anchor-dots-group");

    if (dotsGroup) {
        dotsGroup.addEventListener("click", (event) => {
            const button = event.target.closest(".anchor-dot");
            if (!button) return;

            const columnName = button.getAttribute("data-column");

            if (columnName && typeof scrollToTable3Column === "function") {
                scrollToTable3Column(columnName);
            }
        });
    }

    // Вставляем Quick Jump перед Clear Filters
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


// ============================================================
// 6. ГЛОБАЛЬНЫЕ ФИЛЬТРЫ, КОПИРОВАНИЕ И ФОРМАТТЕРЫ
// ============================================================

// 6.1 Сохранение активных header-фильтров.
function saveCurrentHeaderFilters() {
    if (!table) return;

    const filters = table.getHeaderFilters();

    filters.forEach(filter => {
        if (
            filter.value !== null &&
            filter.value !== undefined &&
            filter.value !== "" &&
            !(Array.isArray(filter.value) && filter.value.length === 0)
        ) {
            globalHeaderFilters[filter.field] = filter.value;
        } else {
            delete globalHeaderFilters[filter.field];
        }
    });
}


// 6.2 Сбор всех конечных колонок из трёх конфигураций.
function getAllTableColumns() {
    const allColumns = [];

    // 6.2.1 Рекурсивный сбор конечных колонок.
    function collect(columns) {
        columns.forEach(column => {
            if (column.columns) {
                collect(column.columns);
            } else if (column.field) {
                allColumns.push(column);
            }
        });
    }

    collect(TABLE_1_COLUMNS);
    collect(TABLE_2_COLUMNS);
    collect(TABLE_3_COLUMNS);

    return allColumns;
}


// 6.3 Восстановление глобальных header-фильтров.
function restoreGlobalHeaderFilters() {
    if (!table) return;

    const visibleColumns = table.getColumns();

    // Устанавливаем фильтры только для колонок
    // текущего представления.
    Object.entries(globalHeaderFilters).forEach(([field, value]) => {

        const column = table.getColumn(field);

        if (!column) return;

        table.setHeaderFilterValue(field, value);
    });
}

// 6.4 Очистка header-фильтров без сброса рабочей выборки.
function clearGlobalFilters() {
    globalHeaderFilters = {};

    if (table) {
        // Очищаем только фильтры атрибутов.
        // Активная рабочая выборка строк сохраняется.
        table.clearHeaderFilter();
    }
}

// Универсальная функция уведомления (не зависит от Tabulator)
// 6.5 Показ краткого уведомления о копировании.
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
// 6.6 Форматирование Yes/No как галочки и крестика.
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
        return "<span class='table-cross'>—</span>";
    }
    
    // Якщо прийшло будь-яке інше специфічне текстове значення — виводимо як є
    return val;
}

// Таблица уже создаётся в основном DOMContentLoaded-блоке выше.


// ============================================================
// 7. COLUMN PICKER
// ============================================================

// 7.1 Открытие или закрытие Column Picker.
function toggleColumnPicker() {
    const picker = document.getElementById("column-picker");
    const settingsButton = document.querySelector(".settings-btn");

    if (!picker || !activeTable) return;

    const isOpen = picker.classList.contains("show");

    if (isOpen) {
        closePicker();
        return;
    }

    // Закрываем меню Help
     closeHelpMenu();

    openPicker();


    // ========================================================
    // ОТКРЫТИЕ ОКНА
    // ========================================================

    // 7.1.1 Формирование и открытие окна Column Picker.
    function openPicker() {
        picker.innerHTML = "";

        picker.classList.add("show");
        settingsButton?.classList.add("active");

        // Не даём кликам внутри окна закрывать его внешними обработчиками
       picker.onpointerdown = event => {
    event.stopPropagation();

    /*
     * Перед началом resize убираем центрирование через transform.
     * Иначе при изменении размеров окно будет смещаться вверх и влево.
     */
    preparePickerForResize(event);
};

        // Левая панель управления одновременно служит зоной перетаскивания
        const controlsContainer = document.createElement("div");
        controlsContainer.className = "picker-controls";
        controlsContainer.setAttribute(
            "aria-label",
            "Column picker controls and drag area"
        );

        // Прокручиваемая область списка
        const columnsViewport = document.createElement("div");
        columnsViewport.className = "picker-columns-viewport";

        // Контейнер колонок
        const columnsContainer = document.createElement("div");
        columnsContainer.className = "picker-columns";

        columnsViewport.appendChild(columnsContainer);

        // Подсказка перетаскивания окна
const dragHint = document.createElement("div");

dragHint.className = "picker-drag-hint";
dragHint.setAttribute("aria-hidden", "true");

dragHint.innerHTML =
    "<i class='fa-solid fa-crosshairs'></i>" +
    "<span>Drag to move</span>";

controlsContainer.appendChild(dragHint);

        createControlButtons(controlsContainer);
        renderColumnItems(columnsContainer);

// Кнопка закрытия
const closeButton = document.createElement("button");

closeButton.type = "button";
closeButton.className = "column-picker-close-btn";
closeButton.setAttribute("aria-label", "Close column picker");

closeButton.innerHTML =
    "<i class='fa-solid fa-xmark' aria-hidden='true'></i>";

closeButton.addEventListener("click", event => {
    event.stopPropagation();
    closePicker();
});


// Подсказка изменения размеров
const resizeHint = document.createElement("div");

resizeHint.className = "picker-resize-hint";
resizeHint.setAttribute("aria-hidden", "true");

resizeHint.innerHTML =
    "<span class='picker-resize-symbol'>↘</span>" +
    "<span>Drag corner to resize</span>";


// Последовательность элементов окна
picker.appendChild(closeButton);
picker.appendChild(controlsContainer);
picker.appendChild(columnsViewport);
picker.appendChild(resizeHint);
        makeDraggable(controlsContainer, picker);

        // Центрируем после формирования содержимого
        requestAnimationFrame(() => {
            centerPicker();
        });

        bindViewportResize();
    }


    // ========================================================
    // ЗАКРЫТИЕ ОКНА
    // ========================================================

    // 7.1.2 Закрытие окна Column Picker.
    function closePicker() {
        picker.classList.remove("show");
        settingsButton?.classList.remove("active");
    }


    // ========================================================
    // ЦЕНТРИРОВАНИЕ
    // ========================================================

    // 7.1.3 Центрирование окна Column Picker.
    function centerPicker() {
        picker.style.setProperty("position", "fixed", "important");
        picker.style.setProperty("left", "50%", "important");
        picker.style.setProperty("top", "50%", "important");
        picker.style.setProperty("right", "auto", "important");
        picker.style.setProperty("bottom", "auto", "important");
        picker.style.setProperty(
            "transform",
            "translate(-50%, -50%)",
            "important"
        );
    }


    // ========================================================
    // КНОПКИ SHOW ALL / CLEAR ALL
    // ========================================================

    // 7.1.4 Создание кнопок Show All и Clear All.
    function createControlButtons(container) {
        const selectAllButton = document.createElement("button");

        selectAllButton.type = "button";
        selectAllButton.className = "picker-select-all-btn";
        selectAllButton.innerHTML =
            "<i class='fa-solid fa-eye' aria-hidden='true'></i>" +
            "<span>Show All</span>";

        selectAllButton.addEventListener("click", event => {
            event.stopPropagation();

            forEachLeafColumn(column => {
                column.show();
            });

            scheduleRedraw();
            renderColumnItems(
                picker.querySelector(".picker-columns")
            );
        });


        const clearAllButton = document.createElement("button");

        clearAllButton.type = "button";
        clearAllButton.className = "picker-clear-all-btn";
        clearAllButton.innerHTML =
            "<i class='fa-solid fa-eye-slash' aria-hidden='true'></i>" +
            "<span>Clear All</span>";

        clearAllButton.addEventListener("click", event => {
            event.stopPropagation();

            forEachLeafColumn(column => {
                const definition = column.getDefinition();
                const field = definition.field;

                if (field === "id" || field === "Title") {
                    column.show();
                } else {
                    column.hide();
                }
            });

            scheduleRedraw();
            renderColumnItems(
                picker.querySelector(".picker-columns")
            );
        });

        container.appendChild(selectAllButton);
        container.appendChild(clearAllButton);
    }


    // ========================================================
    // ГЕНЕРАЦИЯ СПИСКА КОЛОНОК
    // ========================================================

    // 7.1.5 Рендер списка доступных колонок.
    function renderColumnItems(container) {
        if (!container) return;

        container.innerHTML = "";

        activeTable.getColumns().forEach(column => {
            const definition = column.getDefinition();

            if (
                Array.isArray(definition.columns) &&
                definition.columns.length
            ) {
                definition.columns.forEach(subColumnDefinition => {
                    if (!subColumnDefinition.field) return;

                    const subColumn = activeTable.getColumn(
                        subColumnDefinition.field
                    );

                    if (subColumn) {
                        addCheckbox(
                            container,
                            subColumn,
                            definition.cssClass
                        );
                    }
                });

                return;
            }

            if (definition.title && definition.field) {
                addCheckbox(
                    container,
                    column,
                    definition.cssClass
                );
            }
        });
    }


    // ========================================================
    // ЭЛЕМЕНТ ОТДЕЛЬНОЙ КОЛОНКИ
    // ========================================================

    // 7.1.6 Создание одного элемента выбора колонки.
    function addCheckbox(container, column, parentCssClass = "") {
        const definition = column.getDefinition();
        const field = definition.field;

        const columnClass =
            definition.cssClass ||
            parentCssClass ||
            "";

        const isRequired =
            field === "id" ||
            field === "Title";

        const label = document.createElement("label");

        label.className = [
            "column-item",
            columnClass,
            isRequired ? "column-item-required" : ""
        ]
            .filter(Boolean)
            .join(" ");

        const checkbox = document.createElement("input");

        checkbox.type = "checkbox";
        checkbox.checked = column.isVisible();
        checkbox.disabled = isRequired;

        if (isRequired) {
            label.style.setProperty(
                "color",
                "#7a3535",
                "important"
            );

            label.style.cursor = "not-allowed";
            label.title = "This column is always visible";
        }

        checkbox.addEventListener("change", event => {
            event.stopPropagation();

            if (checkbox.checked) {
                column.show();
            } else {
                column.hide();
            }

            scheduleRedraw();
        });

        const title = document.createElement("span");
        title.className = "column-item-title";
        title.textContent =
            definition.title ||
            definition.field ||
            "";

        label.appendChild(checkbox);
        label.appendChild(title);
        container.appendChild(label);
    }


    // ========================================================
    // ПЕРЕБОР ВСЕХ КОНЕЧНЫХ КОЛОНОК
    // ========================================================

    // 7.1.7 Перебор конечных колонок Tabulator.
    function forEachLeafColumn(callback) {
        activeTable.getColumns().forEach(column => {
            const definition = column.getDefinition();

            if (
                Array.isArray(definition.columns) &&
                definition.columns.length
            ) {
                definition.columns.forEach(subColumnDefinition => {
                    if (!subColumnDefinition.field) return;

                    const subColumn = activeTable.getColumn(
                        subColumnDefinition.field
                    );

                    if (subColumn) {
                        callback(subColumn);
                    }
                });

                return;
            }

            if (definition.field) {
                callback(column);
            }
        });
    }


    // ========================================================
    // БЕЗОПАСНАЯ ПЕРЕРИСОВКА TABULATOR
    // ========================================================

    // 7.1.8 Безопасная отложенная перерисовка таблицы.
    function scheduleRedraw() {
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                if (activeTable) {
                    activeTable.redraw(true);
                }
            });
        });
    }


// 7.1.9 Подготовка окна к нативному resize.
function preparePickerForResize(event) {
    if (event.button !== 0) return;

    const rect = picker.getBoundingClientRect();
    const resizeZone = 28;

    const isResizeCorner =
        event.clientX >= rect.right - resizeZone &&
        event.clientY >= rect.bottom - resizeZone;

    if (!isResizeCorner) return;

    /*
     * Не вызываем preventDefault():
     * браузеру необходимо получить событие для нативного resize.
     */
    picker.style.setProperty(
        "transform",
        "none",
        "important"
    );

    picker.style.setProperty(
        "left",
        `${rect.left}px`,
        "important"
    );

    picker.style.setProperty(
        "top",
        `${rect.top}px`,
        "important"
    );

    picker.style.setProperty(
        "right",
        "auto",
        "important"
    );

    picker.style.setProperty(
        "bottom",
        "auto",
        "important"
    );
}

    // ========================================================
    // ПЕРЕТАСКИВАНИЕ ОКНА
    // ========================================================

    // 7.1.10 Подключение перетаскивания Column Picker.
    function makeDraggable(dragArea, target) {
        let isDragging = false;
        let pointerId = null;

        let startPointerX = 0;
        let startPointerY = 0;

        let startWindowLeft = 0;
        let startWindowTop = 0;

        dragArea.addEventListener("pointerdown", event => {
            // Кнопки внутри панели должны оставаться кликабельными
            if (event.target.closest("button, input, label, a")) {
                return;
            }

            if (event.button !== 0) return;

            event.preventDefault();

            const rect = target.getBoundingClientRect();

            // Переводим позиционирование из центрированного
            // transform в абсолютные экранные координаты
            target.style.setProperty(
                "transform",
                "none",
                "important"
            );

            target.style.setProperty(
                "left",
                `${rect.left}px`,
                "important"
            );

            target.style.setProperty(
                "top",
                `${rect.top}px`,
                "important"
            );

            target.style.setProperty(
                "right",
                "auto",
                "important"
            );

            target.style.setProperty(
                "bottom",
                "auto",
                "important"
            );

            isDragging = true;
            pointerId = event.pointerId;

            startPointerX = event.clientX;
            startPointerY = event.clientY;

            startWindowLeft = rect.left;
            startWindowTop = rect.top;

            dragArea.classList.add("is-dragging");
            document.documentElement.classList.add(
    "column-picker-is-dragging"
);
            dragArea.setPointerCapture(pointerId);
        });

        dragArea.addEventListener("pointermove", event => {
            if (
                !isDragging ||
                event.pointerId !== pointerId
            ) {
                return;
            }

            const deltaX = event.clientX - startPointerX;
            const deltaY = event.clientY - startPointerY;

            const targetRect = target.getBoundingClientRect();

            const maxLeft = Math.max(
                0,
                window.innerWidth - targetRect.width
            );

            const maxTop = Math.max(
                0,
                window.innerHeight - targetRect.height
            );

            const nextLeft = Math.min(
                Math.max(0, startWindowLeft + deltaX),
                maxLeft
            );

            const nextTop = Math.min(
                Math.max(0, startWindowTop + deltaY),
                maxTop
            );

            target.style.setProperty(
                "left",
                `${nextLeft}px`,
                "important"
            );

            target.style.setProperty(
                "top",
                `${nextTop}px`,
                "important"
            );
        });

        // 7.1.10.1 Завершение перетаскивания и освобождение pointer capture.
        const stopDragging = event => {
            if (
                !isDragging ||
                event.pointerId !== pointerId
            ) {
                return;
            }

            isDragging = false;

            dragArea.classList.remove("is-dragging");

            document.documentElement.classList.remove(
    "column-picker-is-dragging"
);

            if (dragArea.hasPointerCapture(pointerId)) {
                dragArea.releasePointerCapture(pointerId);
            }

            pointerId = null;
        };

        dragArea.addEventListener("pointerup", stopDragging);
        dragArea.addEventListener("pointercancel", stopDragging);
    }


    // ========================================================
    // РЕАКЦИЯ НА ИЗМЕНЕНИЕ РАЗМЕРА ЭКРАНА
    // ========================================================

    // 7.1.11 Перецентрирование Column Picker при resize viewport.
    function bindViewportResize() {
        if (picker.dataset.viewportResizeBound === "true") {
            return;
        }

        window.addEventListener("resize", () => {
            if (picker.classList.contains("show")) {
                centerPicker();
            }
        });

        picker.dataset.viewportResizeBound = "true";
    }
}


// ============================================================
// 8. ВКЛАДКИ, FULLSCREEN И НАВИГАЦИЯ ПО КОЛОНКАМ
// ============================================================

// 8.1 Переключение между наборами атрибутов.
function openTab(evt, tabName) {

    // ------------------------------------------
    // 8.1.1 Сохраняем состояние текущего представления.
    // ------------------------------------------

    saveCurrentHeaderFilters();
    saveViewState(currentTab);


    // ------------------------------------------
    // 8.1.2 Обновляем активную кнопку вкладки.
    // ------------------------------------------

    const buttons = document.getElementsByClassName("tab-button");

    for (let button of buttons) {
        button.classList.remove("active");
    }

    evt.currentTarget.classList.add("active");


    // ------------------------------------------
    // 8.1.3 Закрываем Column Picker.
    // ------------------------------------------

    const picker = document.getElementById("column-picker");

    if (picker) {
        picker.classList.remove("show");
    }

    const settingsBtn = document.querySelector(".settings-btn");

    if (settingsBtn) {
        settingsBtn.classList.remove("active");
    }


    // ------------------------------------------
    // 8.1.4 Переключаем набор колонок.
    // ------------------------------------------

    const columnsPromise = table.setColumns(
        getColumnsForTab(tabName)
    );

    activeTable = table;
    currentTab = tabName;


    // ------------------------------------------
    // 8.1.5 Показываем Quick Jump только для Tab 3.
    // ------------------------------------------

    const quickJump = document.querySelector(".table3-anchors-bar");

    if (quickJump) {
        quickJump.style.display =
            tabName === "tab3" ? "" : "none";
    }


    // ------------------------------------------
    // 8.1.6 Ждём завершения setColumns().
    // ------------------------------------------

    Promise.resolve(columnsPromise).then(() => {

        requestAnimationFrame(() => {

            requestAnimationFrame(() => {

                // Восстанавливаем глобальные фильтры
                restoreGlobalHeaderFilters();

                // Восстанавливаем состояние текущего представления
                restoreViewState(tabName);

            });

        });

    });
}


// 8.2 Переключение полноэкранного режима таблицы.
function toggleFullscreen() {
    const tableSection = document.querySelector('.table-section');
    tableSection.classList.toggle('fullscreen-mode');
    
    setTimeout(() => {
        if (activeTable) {
            activeTable.redraw(true); 
        }

        positionRowSelectionMenu();
    }, 50);

    const escapeHandler = function(e) {
        if (e.key === "Escape" && tableSection.classList.contains('fullscreen-mode')) {
            tableSection.classList.remove('fullscreen-mode');
            setTimeout(() => {
                activeTable.redraw(true);
                positionRowSelectionMenu();
            }, 50);
            document.removeEventListener('keydown', escapeHandler);
        }
    };
    document.addEventListener('keydown', escapeHandler);
}


/**
 * Плавно прокручивает третью таблицу (table3) к указанной колонке по её field name.
 * @param {string} columnField - Название поля колонки (field), к которой нужно скроллить.
 */
// 8.3 Плавный переход к колонке третьего представления.
function scrollToTable3Column(columnField) {
    if (!table) {
        console.warn("Таблица еще не инициализирована. Скроллинг невозможен.");
        return;
    }

    table.scrollToColumn(columnField, "left", true)
        .catch(err => {
            console.warn(
                `Не удалось прокрутить к колонке "${columnField}":`,
                err
            );
        });
}


