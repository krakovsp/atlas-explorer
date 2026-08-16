// ==========================================
// ГЛОБАЛЬНОЕ СОСТОЯНИЕ
// ==========================================
let table;
let activeTable;
let valueRowCount = 0;

// Глобальное состояние header-фильтров.
// Ключ — field колонки, значение — значение фильтра.
let globalHeaderFilters = {};

let currentTab = "tab1";


// ==========================================
// РАБОЧАЯ ВЫБОРКА СТРОК (ROW SELECTION)
// ==========================================
const ROW_SELECTOR_FIELD = "__rowSelector";

let rowSelectionMode = false;
let rowSubsetActive = false;
let selectedRowIds = new Set();
let draftSelectedRowIds = new Set();

function normalizeRowId(value) {
    return String(value ?? "").trim();
}

function getBaseColumnsForTab(tabName) {
    if (tabName === "tab2") return TABLE_2_COLUMNS;
    if (tabName === "tab3") return TABLE_3_COLUMNS;
    return TABLE_1_COLUMNS;
}

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

function getColumnsForTab(tabName) {
    const baseColumns = getBaseColumnsForTab(tabName);

    if (!rowSelectionMode) {
        return baseColumns;
    }

    return [ROW_SELECTOR_COLUMN, ...baseColumns];
}

function rowSubsetFilter(rowData) {
    return selectedRowIds.has(normalizeRowId(rowData.id));
}

function applyRowSubsetFilter() {
    if (!table) return;

    // В текущей архитектуре это единственный programmatic filter.
    // Header filters существуют отдельно и этим вызовом не затрагиваются.
    table.clearFilter();

    if (rowSubsetActive && selectedRowIds.size > 0) {
        table.setFilter(rowSubsetFilter);
    }
}

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


// ========================================================
// ВЕРТИКАЛЬНОЕ МЕНЮ ДЕЙСТВИЙ ROW SELECTION
// ========================================================

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

function toggleRowSelectionMenu() {
    const menu = document.querySelector(".row-selection-actions-menu");

    if (!menu) return;

    if (menu.classList.contains("show")) {
        closeRowSelectionMenu();
    } else {
        openRowSelectionMenu();
    }
}


// ========================================================
// СОСТОЯНИЕ КНОПОК
// ========================================================

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


// ========================================================
// СОЗДАНИЕ КНОПКИ И ВЕРТИКАЛЬНОГО МЕНЮ
// ========================================================

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


// ========================================================
// ДЕЙСТВИЯ ROW SELECTION
// ========================================================

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

function clearDraftRowSelection() {
    if (!table || !rowSelectionMode) return;

    draftSelectedRowIds.clear();

    table.redraw(true);
    updateRowSelectionControls();
}

function cancelRowSelection() {
    if (!table || !rowSelectionMode) return;

    rowSelectionMode = false;
    draftSelectedRowIds = new Set(selectedRowIds);

    closeRowSelectionMenu();
    applyRowSubsetFilter();
    rebuildCurrentColumns();
}

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

/* ==========================================
   ОФОРМЛЕНИЕ ТУЛТИПА АТРИБУТА
   ========================================== */

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


/* ==========================================
   АВТОМАТИЧЕСКАЯ ПРИВЯЗКА НАЗВАНИЙ КОЛОНОК
   ========================================== */

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

// ==========================================
// ТАБЛИЦА (TABULATOR): СОЗДАНИЕ, КОПИРОВАНИЕ, СКРОЛЛ, ФИЛЬТРЫ, ФОРМАТТЕРЫ
// ==========================================

// 0. Функция создания таблицы
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
    clearGlobalFilters();
};

            paginator.insertBefore(clearFiltersBtn, paginator.firstChild);
        }

        // 2. Создаем панель Quick Jump.
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

// ==========================================
// ГЛОБАЛЬНОЕ СОСТОЯНИЕ ФИЛЬТРОВ
// ==========================================

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


function getAllTableColumns() {
    const allColumns = [];

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

function clearGlobalFilters() {
    globalHeaderFilters = {};

    if (table) {
        // Очищаем только фильтры атрибутов.
        // Активная рабочая выборка строк сохраняется.
        table.clearHeaderFilter();
    }
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

// Таблица уже создаётся в основном DOMContentLoaded-блоке выше.

// ==========================================
// УПРАВЛІННЯ КОЛОНКАМИ ТАБЛИЦІ
// ==========================================

// 3. Управління колонками
// ============================================================
// УПРАВЛЕНИЕ ОКНОМ ВЫБОРА КОЛОНОК
// ============================================================

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

    function closePicker() {
        picker.classList.remove("show");
        settingsButton?.classList.remove("active");
    }


    // ========================================================
    // ЦЕНТРИРОВАНИЕ
    // ========================================================

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

    function scheduleRedraw() {
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                if (activeTable) {
                    activeTable.redraw(true);
                }
            });
        });
    }

// ========================================================
// ПОДГОТОВКА К ИЗМЕНЕНИЮ РАЗМЕРА
// ========================================================

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


// ==========================================
// ВКЛАДКИ ТА ПОВНОЕКРАННИЙ РЕЖИМ
// ==========================================

// 4. Переключення вкладок
function openTab(evt, tabName) {

    // ------------------------------------------
    // 1. Сохраняем состояние текущего представления
    // ------------------------------------------

    saveCurrentHeaderFilters();
    saveViewState(currentTab);


    // ------------------------------------------
    // 2. Активная кнопка
    // ------------------------------------------

    const buttons = document.getElementsByClassName("tab-button");

    for (let button of buttons) {
        button.classList.remove("active");
    }

    evt.currentTarget.classList.add("active");


    // ------------------------------------------
    // 3. Закрываем Column Picker
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
    // 4. Переключаем набор колонок
    // ------------------------------------------

    const columnsPromise = table.setColumns(
        getColumnsForTab(tabName)
    );

    activeTable = table;
    currentTab = tabName;


    // ------------------------------------------
    // 5. Quick Jump — только для Tab 3
    // ------------------------------------------

    const quickJump = document.querySelector(".table3-anchors-bar");

    if (quickJump) {
        quickJump.style.display =
            tabName === "tab3" ? "" : "none";
    }


    // ------------------------------------------
    // 6. Ждём завершения setColumns()
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


// 5. Повноекранний режим
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


// ==========================================
// МОДАЛЬНЕ ВІКНО "UPDATES LOG"
// ==========================================

// 0.1 Функция открытия модального окна
async function openUpdatesLog(event) {
  if (event) {
    event.preventDefault();
  }

  await window.fragmentsReady;

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
async function openSupplementaryModal(event) {
  if (event) {
    event.preventDefault();
  }

  await window.fragmentsReady;

  const modal = document.getElementById("supplementary-modal");

  if (modal) {
    modal.style.display = "flex";
  }
}

function closeSupplementaryModal() {
    const modal = document.getElementById("supplementary-modal");
    if (modal) modal.style.display = "none";
}

// Универсальный обработчик выбора материала
function handleMaterialClick(element) {
    const type = element.dataset.type;
    const target = element.dataset.target;

    if (!target) return;

    const title =
        element.querySelector(".item-title")?.textContent.trim()
        || "Document preview";

    if (type === "pdf") {
        openPdfViewer(target, title);
        return;
    }

    if (type === "external") {
        window.open(target, "_blank", "noopener,noreferrer");
        return;
    }

    if (type === "internal") {
        openInternalMaterialModal(target);
    }
}


function openPdfViewer(url, title) {
    const modal = document.getElementById("pdf-viewer-modal");
    const frame = document.getElementById("pdf-viewer-frame");
    const heading = document.getElementById("pdf-viewer-title");
    const externalLink = document.getElementById(
        "pdf-viewer-external-link"
    );

    /*
     * Если фрагмент модального окна не загрузился,
     * документ всё равно откроется в новой вкладке.
     */
    if (!modal || !frame || !heading || !externalLink) {
        window.open(url, "_blank", "noopener,noreferrer");
        return;
    }

    closeSupplementaryModal();

    heading.textContent = title;
    externalLink.href = url;

    /*
     * Параметры после # поддерживаются встроенными
     * просмотрщиками PDF большинства браузеров.
     */
    frame.src = url.includes("#")
        ? url
        : `${url}#view=FitH&toolbar=1&navpanes=0`;

    modal.style.display = "flex";
}


function closePdfViewer() {
    const modal = document.getElementById("pdf-viewer-modal");
    const frame = document.getElementById("pdf-viewer-frame");

    if (modal) {
        modal.style.display = "none";
    }

    /*
     * Освобождаем документ и прекращаем его загрузку.
     */
    if (frame) {
        frame.src = "about:blank";
    }

    /*
     * После закрытия просмотра возвращаем пользователя
     * к списку дополнительных материалов.
     */
    openSupplementaryModal();
}


document.addEventListener("keydown", event => {
    if (event.key !== "Escape") return;

    const modal = document.getElementById("pdf-viewer-modal");

    if (modal && getComputedStyle(modal).display !== "none") {
        closePdfViewer();
    }
});

// Логіка відображення внутрішнього контенту (Глосарій)
async function openInternalMaterialModal(materialId) {
    // Ждём загрузки вынесенного HTML-фрагмента
    if (window.fragmentsReady) {
        await window.fragmentsReady;
    }

    const contentModal = document.getElementById("material-content-modal");
    const tbody = document.getElementById("glossary-table-tbody");

    if (!contentModal || !tbody) {
        console.error("Glossary modal fragment is not available.");
        return;
    }

    closeSupplementaryModal();

    if (materialId === "glossary-terms") {
        tbody.innerHTML = "";

        // По умолчанию используется стандартная группа
        let currentGroup = "default";

        GLOSSARY_DATA.forEach((item) => {
            // ТИП 4: заголовок секции
            if (item.isSection) {
                currentGroup = item.group || "default";

                const row = document.createElement("tr");

                row.className =
                    `glossary-section-title-row group-${currentGroup}`;

                row.id = `sec-${currentGroup}`;

                row.innerHTML = `
                    <td class="cell-index">
                        ${item.number || ""}
                    </td>

                    <td colspan="3" class="section-text-centered">
                        ${item.term}
                    </td>
                `;

                tbody.appendChild(row);
                return;
            }

            // ТИП 3: структурированный массив
            if (item.nested && Array.isArray(item.nested)) {
                const headerRow = document.createElement("tr");

                headerRow.className =
                    `glossary-group-header group-${currentGroup}`;

                headerRow.innerHTML = `
                    <td class="cell-index">
                        ${item.number || ""}
                    </td>

                    <td class="cell-term">
                        ${item.term}
                    </td>

                    <td>
                        <span class="category-text"></span>
                    </td>

                    <td class="cell-definition">
                        ${item.definition}
                    </td>
                `;

                tbody.appendChild(headerRow);

                item.nested.forEach((subItem) => {
                    const row = document.createElement("tr");

                    row.className =
                        `glossary-group-row group-${currentGroup}`;

                    row.innerHTML = `
                        <td class="cell-index"></td>

                        <td class="cell-term">
                            ${subItem.term}
                        </td>

                        <td>
                            <span class="category-text">
                                ${subItem.category || ""}
                            </span>
                        </td>

                        <td class="cell-definition">
                            ${subItem.definition}
                        </td>
                    `;

                    tbody.appendChild(row);
                });

                return;
            }

            // ТИПЫ 1 и 2: одиночные строки
            const row = document.createElement("tr");

            row.className =
                `glossary-normal-row group-${currentGroup}`;

            const categoryContent = item.category
                ? `<span class="category-text">${item.category}</span>`
                : `<span class="category-text"></span>`;

            row.innerHTML = `
                <td class="cell-index">
                    ${item.number || ""}
                </td>

                <td class="cell-term">
                    ${item.term}
                </td>

                <td>
                    ${categoryContent}
                </td>

                <td class="cell-definition">
                    ${item.definition}
                </td>
            `;

            tbody.appendChild(row);
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
// ЛОГИКА HELP-АККОРДЕОНА
// ==========================================

function closeHelpMenu() {
    const helpBtn = document.getElementById("help-trigger-btn");
    const helpMenu = document.getElementById("help-accordion-menu");

    if (!helpMenu) return;

    helpMenu.classList.remove("show");
    helpMenu.setAttribute("aria-hidden", "true");

    if (helpBtn) {
        helpBtn.classList.remove("active");
        helpBtn.setAttribute("aria-expanded", "false");
    }

    // Закрываем все секции
    helpMenu.querySelectorAll(".help-accordion-item").forEach(item => {
        item.classList.remove("open");

        const header = item.querySelector(".help-accordion-header");
        const content = item.querySelector(".help-accordion-content");

        if (header) {
            header.setAttribute("aria-expanded", "false");
        }

        if (content) {
            content.style.maxHeight = null;
        }
    });
}


function positionHelpMenu() {
    const helpBtn = document.getElementById("help-trigger-btn");
    const helpMenu = document.getElementById("help-accordion-menu");

    if (
        !helpBtn ||
        !helpMenu ||
        !helpMenu.classList.contains("show")
    ) {
        return;
    }

    const buttonRect = helpBtn.getBoundingClientRect();

    const gap = 8;
    const viewportPadding = 12;

    /*
     * Меню position: fixed.
     * Привязываем его нижний край к верхнему краю кнопки.
     *
     * Благодаря bottom меню при раскрытии секции
     * автоматически растёт ВВЕРХ.
     */
    helpMenu.style.top = "auto";
    helpMenu.style.left = "auto";

    helpMenu.style.right =
        Math.max(
            viewportPadding,
            window.innerWidth - buttonRect.right
        ) + "px";

    /*
     * В обычном режиме окно всегда открывается над Help.
     */
    const tableSection = document.querySelector(".table-section");
    const isFullscreen =
        tableSection?.classList.contains("fullscreen-mode");

    /*
     * В fullscreen кнопка находится практически у верхнего края
     * экрана, поэтому физически разместить окно над ней невозможно.
     * Только в этом случае используем нижнее расположение.
     */
    if (isFullscreen) {
        helpMenu.style.bottom = "auto";
        helpMenu.style.top =
            (buttonRect.bottom + gap) + "px";

        helpMenu.dataset.placement = "bottom";
    } else {
        helpMenu.style.bottom =
            (window.innerHeight - buttonRect.top + gap) + "px";

        helpMenu.dataset.placement = "top";
    }
}


document.addEventListener("DOMContentLoaded", () => {

    const helpBtn = document.getElementById("help-trigger-btn");
    const helpMenu = document.getElementById("help-accordion-menu");
    if (!helpBtn || !helpMenu) return;


    // ------------------------------------------
    // ОТКРЫТИЕ / ЗАКРЫТИЕ HELP
    // ------------------------------------------

    helpBtn.addEventListener("click", event => {
        event.stopPropagation();

        const isOpen = helpMenu.classList.contains("show");

        if (isOpen) {
            closeHelpMenu();
            return;
        }


        // Закрываем Show/Hide Columns
        const picker = document.getElementById("column-picker");
        const settingsBtn = document.querySelector(".settings-btn");

        if (picker?.classList.contains("show")) {
            picker.classList.remove("show");
            settingsBtn?.classList.remove("active");
        }


        helpMenu.classList.add("show");
        helpMenu.setAttribute("aria-hidden", "false");

        helpBtn.classList.add("active");
        helpBtn.setAttribute("aria-expanded", "true");

        requestAnimationFrame(() => {
            positionHelpMenu();
        });
    });

    // ------------------------------------------
    // СЕКЦИИ АККОРДЕОНА
    // ------------------------------------------

    helpMenu
        .querySelectorAll(".help-accordion-header")
        .forEach(header => {

            header.addEventListener("click", event => {
                event.stopPropagation();

                const currentItem =
                    header.closest(".help-accordion-item");

                const currentContent =
                    currentItem?.querySelector(
                        ".help-accordion-content"
                    );

                if (!currentItem || !currentContent) return;

                const isOpen =
                    currentItem.classList.contains("open");


                // Закрываем остальные секции
                helpMenu
                    .querySelectorAll(".help-accordion-item")
                    .forEach(item => {

                        const itemHeader =
                            item.querySelector(
                                ".help-accordion-header"
                            );

                        const itemContent =
                            item.querySelector(
                                ".help-accordion-content"
                            );

                        item.classList.remove("open");

                        itemHeader?.setAttribute(
                            "aria-expanded",
                            "false"
                        );

                        if (itemContent) {
                            itemContent.style.maxHeight = null;
                        }
                    });


                // Открываем выбранную секцию
                if (!isOpen) {
                    currentItem.classList.add("open");

                    header.setAttribute(
                        "aria-expanded",
                        "true"
                    );

                    /*
                     * Высота равна реальной высоте содержимого.
                     * Никакого фиксированного ограничения нет.
                     */
                    currentContent.style.maxHeight =
                        currentContent.scrollHeight + "px";
                }
            });
        });


    // ------------------------------------------
    // КЛИК ВНЕ HELP
    // ------------------------------------------

    document.addEventListener("click", event => {
        const helpContainer =
            document.querySelector(".help-container");

        if (
            helpMenu.classList.contains("show") &&
            helpContainer &&
            !helpContainer.contains(event.target)
        ) {
            closeHelpMenu();
        }
    });


    // ------------------------------------------
    // ESC
    // ------------------------------------------

    document.addEventListener("keydown", event => {
        if (
            event.key === "Escape" &&
            helpMenu.classList.contains("show")
        ) {
            closeHelpMenu();
        }
    });


    // ------------------------------------------
    // ИЗМЕНЕНИЕ РАЗМЕРА ОКНА
    // ------------------------------------------

    window.addEventListener("resize", () => {
        if (helpMenu.classList.contains("show")) {
            positionHelpMenu();
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

// ============================================================
// MOBILE ATLAS CATALOGUE
// ============================================================

const mobileCatalogueState = {
    initialized: false,
    data: [],
    view: "bibliographic",
    query: "",
    expandedId: null,
    visibleCount: 5,
    step: 5
};


// ------------------------------------------------------------
// 1. Определяем мобильный / ограниченный режим
// ------------------------------------------------------------

const mobileCatalogueMedia = window.matchMedia(
    "(max-width: 1299px), (max-height: 759px)"
);


// ------------------------------------------------------------
// 2. Инициализация
// ------------------------------------------------------------

async function initMobileAtlasCatalogue() {

    if (mobileCatalogueState.initialized) {
        return;
    }

    const catalogue =
        document.getElementById("mobile-atlas-catalogue");

    const list =
        document.getElementById("mobile-atlas-list");

    if (!catalogue || !list) {
        return;
    }

    mobileCatalogueState.initialized = true;

    bindMobileCatalogueControls();

    try {

        /*
         * Используем тот же data.json,
         * что и desktop Tabulator.
         */
        const response = await fetch("data/data.json");

        if (!response.ok) {
            throw new Error(
                `Failed to load data.json: ${response.status}`
            );
        }

        const data = await response.json();

        mobileCatalogueState.data =
            Array.isArray(data) ? data : [];

        renderMobileAtlasCatalogue();

    } catch (error) {

        console.error(
            "Mobile Atlas Catalogue:",
            error
        );

        list.innerHTML = `
            <div class="mobile-catalogue-message">
                <i class="fa-solid fa-triangle-exclamation"></i>
                <span>Unable to load the atlas catalogue.</span>
            </div>
        `;
    }
}


// ------------------------------------------------------------
// 3. События интерфейса
// ------------------------------------------------------------

function bindMobileCatalogueControls() {

    const searchInput =
        document.getElementById("mobile-atlas-search");

    const clearSearch =
        document.getElementById("mobile-atlas-search-clear");

    const list =
        document.getElementById("mobile-atlas-list");

    const loadMore =
        document.getElementById("mobile-atlas-load-more");


    // SEARCH
    searchInput?.addEventListener("input", () => {

        mobileCatalogueState.query =
            searchInput.value.trim().toLowerCase();

        mobileCatalogueState.visibleCount =
            mobileCatalogueState.step;

        mobileCatalogueState.expandedId = null;

        if (clearSearch) {
            clearSearch.hidden =
                mobileCatalogueState.query.length === 0;
        }

        renderMobileAtlasCatalogue();
    });


    // CLEAR SEARCH
    clearSearch?.addEventListener("click", () => {

        if (!searchInput) return;

        searchInput.value = "";

        mobileCatalogueState.query = "";
        mobileCatalogueState.visibleCount =
            mobileCatalogueState.step;

        mobileCatalogueState.expandedId = null;

        clearSearch.hidden = true;

        searchInput.focus();

        renderMobileAtlasCatalogue();
    });


    // ATTRIBUTE TABS
    document
        .querySelectorAll(".mobile-catalogue-tab")
        .forEach(button => {

            button.addEventListener("click", () => {

                const view =
                    button.dataset.mobileView;

                if (!view) return;

                mobileCatalogueState.view = view;

                document
                    .querySelectorAll(".mobile-catalogue-tab")
                    .forEach(tab => {

                        const active =
                            tab === button;

                        tab.classList.toggle(
                            "active",
                            active
                        );

                        tab.setAttribute(
                            "aria-selected",
                            active
                                ? "true"
                                : "false"
                        );
                    });

                /*
                 * Если карточка уже раскрыта,
                 * она остаётся раскрытой,
                 * но показывает новый блок атрибутов.
                 */
                renderMobileAtlasCatalogue();
            });
        });


    // VIEW DETAILS / HIDE DETAILS
    list?.addEventListener("click", event => {

        const button =
            event.target.closest(
                ".mobile-atlas-details-trigger"
            );

        if (!button) return;

        const id =
            String(button.dataset.atlasId);

        if (
            mobileCatalogueState.expandedId === id
        ) {
            mobileCatalogueState.expandedId = null;
        } else {
            mobileCatalogueState.expandedId = id;
        }

        renderMobileAtlasCatalogue();

        /*
         * После перестройки возвращаем карточку
         * примерно на прежнее место.
         */
        requestAnimationFrame(() => {

            const card =
                document.querySelector(
                    `.mobile-atlas-card[data-atlas-id="${CSS.escape(id)}"]`
                );

            card?.scrollIntoView({
                behavior: "smooth",
                block: "nearest"
            });
        });
    });


    // SHOW MORE
    loadMore?.addEventListener("click", () => {

        mobileCatalogueState.visibleCount +=
            mobileCatalogueState.step;

        renderMobileAtlasCatalogue();
    });
}


// ------------------------------------------------------------
// 4. Фильтрация каталога
// ------------------------------------------------------------

function getFilteredMobileAtlases() {

    const query =
        mobileCatalogueState.query
            .trim()
            .toLowerCase();

    if (!query) {
        return mobileCatalogueState.data;
    }


    /*
     * Получаем ВСЕ поля текущей мобильной вкладки:
     *
     * bibliographic -> TABLE_1_COLUMNS
     * content       -> TABLE_2_COLUMNS
     * media         -> TABLE_3_COLUMNS
     */
    const currentColumns =
        getMobileCatalogueColumns();


    /*
     * Ищем именно ПО ЗНАЧЕНИЯМ этих полей.
     *
     * Title и ID доступны для поиска всегда.
     */
    const searchableFields = [
        "id",
        "Title",
        ...currentColumns.map(column => column.field)
    ];


    return mobileCatalogueState.data.filter(atlas => {

        return searchableFields.some(field => {

            const value = atlas[field];

            if (!hasMobileAtlasValue(value)) {
                return false;
            }


            /*
             * Приводим любое значение к тексту:
             *
             * 2021            -> "2021"
             * true            -> "true"
             * ["A", "B"]      -> "A B"
             * "Europe; Asia"  -> "Europe; Asia"
             */
            const searchableValue =
                Array.isArray(value)
                    ? value.join(" ")
                    : String(value);


            return searchableValue
                .toLowerCase()
                .includes(query);
        });

    });
}


// ------------------------------------------------------------
// 5. Получаем набор колонок текущего раздела
// ------------------------------------------------------------

function getMobileCatalogueColumns() {

    if (
        mobileCatalogueState.view === "content"
    ) {
        return flattenMobileColumnDefinitions(
            TABLE_2_COLUMNS
        );
    }

    if (
        mobileCatalogueState.view === "media"
    ) {
        return flattenMobileColumnDefinitions(
            TABLE_3_COLUMNS
        );
    }

    return flattenMobileColumnDefinitions(
        TABLE_1_COLUMNS
    );
}


// ------------------------------------------------------------
// 6. Превращаем структуру Tabulator в обычный список атрибутов
// ------------------------------------------------------------

function flattenMobileColumnDefinitions(
    columns,
    result = []
) {

    columns.forEach(column => {

        if (
            Array.isArray(column.columns)
        ) {
            flattenMobileColumnDefinitions(
                column.columns,
                result
            );

            return;
        }

        if (!column.field) return;

        /*
         * ID и Title уже находятся
         * в шапке мобильной карточки.
         */
        if (
            column.field === "id" ||
            column.field === "Title" ||
            column.field === "URL" ||
            column.field === "__rowSelection"
        ) {
            return;
        }

        if (
            result.some(
                item =>
                    item.field === column.field
            )
        ) {
            return;
        }

        result.push({
            field: column.field,
            title: getMobileColumnTitle(column)
        });
    });

    return result;
}


// ------------------------------------------------------------
// 7. Чистое название атрибута без HTML
// ------------------------------------------------------------

function getMobileColumnTitle(column) {

    const parser =
        document.createElement("div");

    parser.innerHTML =
        String(
            column.title ||
            column.field ||
            ""
        );

    return (
        parser.textContent.trim() ||
        column.field
    );
}


// ------------------------------------------------------------
// 8. Проверка значения
// ------------------------------------------------------------

function hasMobileAtlasValue(value) {

    return !(
        value === null ||
        value === undefined ||
        String(value).trim() === ""
    );
}


// ------------------------------------------------------------
// 9. Формат значения
// ------------------------------------------------------------

function formatMobileAtlasValue(value) {

    if (value === true || value === "true") {
        return "Yes";
    }

    if (value === false || value === "false") {
        return "No";
    }

    if (Array.isArray(value)) {
        return value.join("; ");
    }

    return String(value);
}


// ------------------------------------------------------------
// 10. Защита текста перед вставкой в HTML
// ------------------------------------------------------------

function escapeMobileCatalogueHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

// ============================================================
// MOBILE CARD — DEFAULT ATTRIBUTES FOR EACH VIEW
// ============================================================

const MOBILE_CARD_SUMMARY_FIELDS = {

    bibliographic: [
        {
            field: "Status",
            label: "Status"
        },
        {
            field: "Publisher",
            label: "Publisher"
        },
        {
            field: "Publication Date",
            label: "Publication Date"
        }
    ],

    content: [
        {
            field: "Theme",
            label: "Theme"
        },
        {
            field: "Territory",
            label: "Territory"
        },
        {
            field: "Content Spatiality",
            label: "Content Spatiality"
        }
    ],

    media: [
        {
            field: "Metaconcept",
            label: "Metaconcept"
        },
        {
            field: "Atlas Focus",
            label: "Atlas Focus"
        },
        {
            field: "Usage style",
            label: "Usage Style"
        }
    ]

};

// ------------------------------------------------------------
// 11. Краткая информация карточки
// ------------------------------------------------------------

function createMobileAtlasSummary(atlas) {

    const fields =
        MOBILE_CARD_SUMMARY_FIELDS[
            mobileCatalogueState.view
        ] || [];


    const summary = fields
        .map(item => {

            const value =
                atlas[item.field];

            if (!hasMobileAtlasValue(value)) {
                return null;
            }

            return {
                label: item.label,
                value: value
            };
        })
        .filter(Boolean);


    if (summary.length === 0) {
        return "";
    }


    return `
        <dl class="mobile-atlas-summary">

            ${summary
                .map(item => `
                    <div class="mobile-atlas-summary-row">

                        <dt>
                            ${escapeMobileCatalogueHTML(
                                item.label
                            )}
                        </dt>

                        <dd>
                            ${escapeMobileCatalogueHTML(
                                formatMobileAtlasValue(
                                    item.value
                                )
                            )}
                        </dd>

                    </div>
                `)
                .join("")}

        </dl>
    `;
}


// ------------------------------------------------------------
// 12. Полный список атрибутов раскрытой карточки
// ------------------------------------------------------------

function createMobileAtlasDetails(atlas) {

    const columns =
        getMobileCatalogueColumns();

    const attributes =
        columns.filter(column =>
            hasMobileAtlasValue(
                atlas[column.field]
            )
        );


    const sectionNames = {
        bibliographic:
            "Bibliographic Attributes",

        content:
            "Content Attributes",

        media:
            "Media-Cartographic Attributes"
    };


    if (attributes.length === 0) {

        return `
            <div class="mobile-atlas-details">

                <div class="mobile-atlas-details-heading">
                    ${sectionNames[
                        mobileCatalogueState.view
                    ]}
                </div>

                <p class="mobile-atlas-empty">
                    No data are available in this section.
                </p>

            </div>
        `;
    }


    return `
        <div class="mobile-atlas-details">

            <div class="mobile-atlas-details-heading">
                ${sectionNames[
                    mobileCatalogueState.view
                ]}
            </div>

            <dl class="mobile-atlas-attributes">

                ${attributes
                    .map(column => {

                        const value =
                            formatMobileAtlasValue(
                                atlas[column.field]
                            );

                        return `
                            <div class="mobile-atlas-attribute-row">

                                <dt>
                                    ${escapeMobileCatalogueHTML(
                                        column.title
                                    )}
                                </dt>

                                <dd>
                                    ${escapeMobileCatalogueHTML(
                                        value
                                    )}
                                </dd>

                            </div>
                        `;
                    })
                    .join("")}

            </dl>

        </div>
    `;
}


// ------------------------------------------------------------
// 13. Одна карточка
// ------------------------------------------------------------

function createMobileAtlasCard(atlas) {

    const id =
        String(atlas.id ?? "");

    const title =
        atlas.Title ||
        `Atlas ${id}`;

    const url =
        hasMobileAtlasValue(atlas.URL)
            ? String(atlas.URL)
            : "";

    const expanded =
        mobileCatalogueState.expandedId === id;


    const titleHTML = url

        ? `
            <a
                href="${escapeMobileCatalogueHTML(url)}"
                target="_blank"
                rel="noopener noreferrer"
                class="mobile-atlas-title-link"
            >
                ${escapeMobileCatalogueHTML(title)}

                <i
                    class="fa-solid fa-arrow-up-right-from-square"
                    aria-hidden="true"
                ></i>
            </a>
        `

        : `
            <span class="mobile-atlas-title-text">
                ${escapeMobileCatalogueHTML(title)}
            </span>
        `;


    return `
        <article
            class="mobile-atlas-card${expanded ? " expanded" : ""}"
            data-atlas-id="${escapeMobileCatalogueHTML(id)}"
        >

            <header class="mobile-atlas-card-header">

                <div class="mobile-atlas-id">
                    ID ${escapeMobileCatalogueHTML(id)}
                </div>

                <h3 class="mobile-atlas-title">
                    ${titleHTML}
                </h3>

            </header>


            ${createMobileAtlasSummary(atlas)}


            <button
                type="button"
                class="mobile-atlas-details-trigger"
                data-atlas-id="${escapeMobileCatalogueHTML(id)}"
                aria-expanded="${expanded ? "true" : "false"}"
            >

                <span>
                    ${expanded
                        ? "Hide details"
                        : "View details"}
                </span>

                <i
                    class="fa-solid fa-chevron-down"
                    aria-hidden="true"
                ></i>

            </button>


            ${expanded
                ? createMobileAtlasDetails(atlas)
                : ""}

        </article>
    `;
}


// ------------------------------------------------------------
// 14. Рендер каталога
// ------------------------------------------------------------

function renderMobileAtlasCatalogue() {

    const list =
        document.getElementById("mobile-atlas-list");

    const count =
        document.getElementById("mobile-catalogue-count");

    const loadMore =
        document.getElementById("mobile-atlas-load-more");

    if (!list) return;


    const filtered =
        getFilteredMobileAtlases();

    const visible =
        filtered.slice(
            0,
            mobileCatalogueState.visibleCount
        );


    // COUNT
    if (count) {

        if (mobileCatalogueState.query) {

            count.textContent =
                `${filtered.length} ${
                    filtered.length === 1
                        ? "match"
                        : "matches"
                }`;

        } else {

            count.textContent =
                `${filtered.length} ${
                    filtered.length === 1
                        ? "atlas"
                        : "atlases"
                }`;
        }
    }


    // Ничего не найдено
    if (filtered.length === 0) {

        list.innerHTML = `
            <div class="mobile-catalogue-message">

                <i class="fa-solid fa-magnifying-glass"></i>

                <div>
                    <strong>No atlases found</strong>
                    <span>Try another title or ID.</span>
                </div>

            </div>
        `;

        if (loadMore) {
            loadMore.hidden = true;
        }

        return;
    }


    list.innerHTML =
        visible
            .map(createMobileAtlasCard)
            .join("");


    // LOAD MORE
    if (loadMore) {

        const hasMore =
            visible.length < filtered.length;

        loadMore.hidden = !hasMore;

        if (hasMore) {

            const remaining =
                filtered.length -
                visible.length;

            loadMore.querySelector("span").textContent =
                `Show more atlases (${remaining})`;
        }
    }
}


// ------------------------------------------------------------
// 15. Запуск только тогда, когда mobile catalogue нужен
// ------------------------------------------------------------

document.addEventListener(
    "DOMContentLoaded",
    () => {

        if (mobileCatalogueMedia.matches) {
            initMobileAtlasCatalogue();
        }
    }
);


// Если пользователь изменил размер окна
mobileCatalogueMedia.addEventListener(
    "change",
    event => {

        if (event.matches) {
            initMobileAtlasCatalogue();
        }
    }
);