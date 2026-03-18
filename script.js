let activeTable;

    // 1. Функция создания таблицы
    function createRemoteTable(id, url, columns) {
        return new Tabulator(id, {
            ajaxURL: "data/" + url,
            layout: "fitColumns",
            height: "100%",
            popupContainer: true, 
            columnDefaults: {
                headerHozAlign: "center",
                hozAlign: "left",
                minWidth: 200,
            }, 
            pagination: "local",       
            paginationSize: 10,        
            paginationSizeSelector: [5, 10, 20, 50, 100, true],
            // Налаштування мови, щоб "true" відображалося як "Всі" або "All"
            langs: {
               "default": {
                   "pagination": {
                         "all": "all", // Слово, яке буде замість true у списку
                                 }
                         }
            }, 
            paginationCounter: "rows", 
            columns: columns
            
        }); 
    }

    // 2. Инициализация после загрузки DOM
    document.addEventListener("DOMContentLoaded", function() {
        window.table1 = createRemoteTable("#table1-id", "data3.json", [
            {title:"N", field:"id", width:70},
            {title:"Назва", 
            field:"Назва", 
            frozen: true, 
            headerFilter: "list",
                        headerFilterParams: { 
                            valuesLookup: "data", // Просканировать все данные для поиска уникальных строк
                            sort: "asc",          // Сортировать список по алфавиту
                            clearable: true
                            },
            formatter: function(cell, formatterParams, onRendered) {
        // Отримуємо дані всього рядка
        const data = cell.getRow().getData();
        const url = data.URL; // 'url' - назва поля з вашого JSON, де зберігається посилання
        const name = cell.getValue();

        // Якщо URL існує, створюємо посилання, інакше просто текст
        if (url) {
            return `<a href="${url}" target="_blank" style="color: #0078d4; text-decoration: none; font-weight: 500;">${name}</a>`;
        } else {
            return name;
        }}
            },
              
            {title:"Дата випуску", 
            field:"Дата випуску", 
            headerTooltip: "Тут може бути ваш дуже довгий опис на 100 слів, який пояснює методологію розрахунку цього показника або джерела даних...",
            headerFilter: "list",
                        headerFilterParams: { 
                            valuesLookup: "data", // Просканировать все данные для поиска уникальных строк
                            sort: "asc",          // Сортировать список по алфавиту
                            clearable: true
                            }},
            {
                title:"Англійська", 
                field:"Англійська мова", 
                width:120, 
                hozAlign:"center",
                formatter:"tickCross", 
                formatterParams:{
                    trueValue:"Так", 
                    falseValue:"Ні",
                    crossElement: "✘",
                    tickElement: "✔", 
                }
            }
        ]);

        window.table2 = createRemoteTable("#table2-id", "data2.json", [
            {title:"Тип видавця", field:"Тип видавця", headerTooltip: "шалай балай"},
            {title:"Видавець", field:"Видавець", headerTooltip: "Бур бур ля ля"}
        ]); 

        window.table3 = createRemoteTable("#table3-id", "data1.json", [
            {title:"Кількість мов", field:"Кількість мов", frozen:true},
            {title:"Назва", field:"Назва", frozen:true},
            {
                title:"General Information",
                columns:[
                     {title: "Прогрес виконання", 
                     field: "progress_val", // Назва поля у вашому JSON (значення 0-100)
                     formatter: "progress", 
                     formatterParams: {
                     min: 0,
                     max: 100,
                     // Пастельна палітра: Кораловий -> Теплий беж -> Приглушений зелений
                     color: ["#e57373", "#ffd54f", "#81c784"], 
                     legend: function(value) {
                         return value + "%";
                     },
                     legendColor: "#4A4541", // Темно-коричневий текст, як ми обрали раніше
                     legendAlign: "center",
                                      }
                    },
                    {title:"Дата останнього оновлення", field:"Дата останнього оновлення"},
                    {
                        title:"Спосіб реалізації", 
                        field:"Спосіб реалізації",
                        headerFilter: "list",
                        headerFilterParams: { 
                            valuesLookup: "data", // Просканировать все данные для поиска уникальных строк
                            sort: "asc",          // Сортировать список по алфавиту
                            clearable: true
                            }
                    },
                ],
            },
            {
                title:"Іnterface", cssClass: "column-interface",
                columns:[
                    {title:"Мобільні пристрої", field:"Мобільні пристрої", cssClass: "column-interface"},
                    {title:"Дата оновлення", field:"Дата останнього оновлення", headerFilter: "input", cssClass: "column-interface"},
                    {title:"URL", field:"URL", cssClass: "column-interface"},
                    {title:"Команда", field:"Команда розробників", cssClass: "column-interface"},
                ],
            },
            {
                title:"Information Architecture & Navigation", cssClass: "column-navigation",
                columns:[
                    {title:"Тип видавця", field:"Тип видавця", headerTooltip: "шалай балай", cssClass: "column-navigation"},
                    {title:"Видавець", field:"Видавець", headerTooltip: "Бур бур ля ля", cssClass: "column-navigation"},          
                ],
            },
            {
                title:"Content Representation", cssClass: "column-represent",
                columns:[
                    {title:"Тип видавця", field:"Тип видавця", headerTooltip: "шалай балай", cssClass: "column-represent"},
                    {title:"Видавець", field:"Видавець", headerTooltip: "Бур бур ля ля", cssClass: "column-represent"},          
                ],
            },
            {
                title:"Functionality", cssClass: "column-func",
                columns:[  
                    {title:"URL", field:"URL", cssClass: "column-func"},
                    {title:"Англійська мова", field:"Англійська мова", cssClass: "column-func"},
                ],
            } 
        ]);

        activeTable = window.table1;

        // Маленькая хитрость: принудительно перерисовываем первую таблицу через 100мс,
       // чтобы она точно "вписалась" в свои 60% высоты
        setTimeout(() => {
        if(window.table1) window.table1.redraw();
    }, 100);
    });

// 3. Управління колонками (ОПТИМІЗОВАНО ДЛЯ ВСІХ ТАБЛИЦЬ)
function toggleColumnPicker() {
        const picker = document.getElementById("column-picker");
    const btn = document.querySelector(".settings-btn"); // Знаходимо нашу кнопку
    if (!picker || !activeTable) return;

    if (picker.style.display === "block") {
        picker.style.display = "none";
        btn.classList.remove("active"); // Видаляємо клас, коли меню закрите
        } else {
            picker.innerHTML = "";
            picker.style.display = "block";
            btn.classList.add("active"); // Додаємо клас, коли меню відкрите

            activeTable.getColumns().forEach(column => {
                const def = column.getDefinition();
                if (def.columns) {
                    def.columns.forEach(subCol => addCheckbox(picker, activeTable.getColumn(subCol.field)));
                } else if (def.title && def.field) {
                    addCheckbox(picker, column);
                }
            });
        }

        function addCheckbox(container, col) {
            const label = document.createElement("label");
            label.className = "column-item";
            const chk = document.createElement("input");
            chk.type = "checkbox";
            chk.checked = col.isVisible();
            chk.onchange = () => col.toggle();
            label.appendChild(chk);
            label.appendChild(document.createTextNode(col.getDefinition().title));
            container.appendChild(label);
        }
    }

// 4. Переключення вкладок (ВИПРАВЛЕНО: винесено окремо)
function openTab(evt, tabName) {
    const contents = document.getElementsByClassName("tab-content");
    for (let x of contents) x.classList.remove("active");

    const buttons = document.getElementsByClassName("tab-button");
    for (let x of buttons) x.classList.remove("active");

    document.getElementById(tabName).classList.add("active");
    evt.currentTarget.classList.add("active");

    const picker = document.getElementById("column-picker");
    if (picker) picker.style.display = "none";

    if (tabName === 'tab1') activeTable = window.table1;
    if (tabName === 'tab2') activeTable = window.table2;
    if (tabName === 'tab3') activeTable = window.table3;

    setTimeout(() => {
        if (activeTable) activeTable.redraw();
    }, 50);
}

// 5. Повноекранний режим (ВИПРАВЛЕНО: винесено окремо)
function toggleFullscreen() {
    const tableSection = document.querySelector('.table-section');
    tableSection.classList.toggle('fullscreen-mode');
    
    // Даємо браузеру 50мс на перерахунок розмірів контейнера, 
    // а потім кажемо Tabulator перемалюватися
    setTimeout(() => {
        if (activeTable) {
            
            activeTable.redraw(true); 
        }
    }, 50);

    // Додаємо обробку Escape для виходу
    const escapeHandler = function(e) {
        if (e.key === "Escape" && tableSection.classList.contains('fullscreen-mode')) {
            tableSection.classList.remove('fullscreen-mode');
            setTimeout(() => { activeTable.redraw(true); }, 50);
            document.removeEventListener('keydown', escapeHandler);
        }
    };
    document.addEventListener('keydown', escapeHandler);
}
