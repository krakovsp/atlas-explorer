/**
 * ATLAS EXPLORER — SITE INTERFACE
 *
 * ОГЛАВЛЕНИЕ
 * 1. Update History
 * 2. Site Information
 * 3. Suggestions
 * 4. Supplementary Materials, PDF Viewer и внутренние материалы
 * 5. Общие обработчики модальных окон
 * 6. Help Accordion
 * 7. Навигация по Glossary
 *
 */

// ============================================================
// 1. UPDATE HISTORY
// ============================================================

// 1.1 Сортировка годов и записей Update History от новых к старым.
function sortUpdateHistory() {
    const modal = document.getElementById("updates-modal");

    if (!modal) return;

    const updatesBody = modal.querySelector(".updates-body");

    if (!updatesBody) return;


    // --------------------------------------------------------
    // 1.1.1 Сортируем записи внутри каждого года.
    // --------------------------------------------------------

    const yearSections = [
        ...updatesBody.querySelectorAll(":scope > .updates-year")
    ];

    yearSections.forEach(yearSection => {

        const entries = [
            ...yearSection.querySelectorAll(":scope > .update-entry")
        ];


        entries.sort((entryA, entryB) => {

            const timeA =
                entryA.querySelector("time.update-date");

            const timeB =
                entryB.querySelector("time.update-date");


            const dateA = timeA
                ? Date.parse(timeA.getAttribute("datetime"))
                : 0;

            const dateB = timeB
                ? Date.parse(timeB.getAttribute("datetime"))
                : 0;


            // Новая дата выше старой
            return dateB - dateA;
        });


        entries.forEach(entry => {
            yearSection.appendChild(entry);
        });

    });


    // --------------------------------------------------------
    // 1.1.2 Сортируем сами годы.
    // --------------------------------------------------------

    yearSections.sort((yearA, yearB) => {

        const titleA =
            yearA.querySelector(".updates-year-title");

        const titleB =
            yearB.querySelector(".updates-year-title");


        const valueA =
            parseInt(titleA?.textContent.trim(), 10) || 0;

        const valueB =
            parseInt(titleB?.textContent.trim(), 10) || 0;


        // Новый год выше старого
        return valueB - valueA;
    });


    yearSections.forEach(yearSection => {
        updatesBody.appendChild(yearSection);
    });
}

// 1.2 Открытие Update History.
async function openUpdatesLog(event) {
    if (event) {
        event.preventDefault();
    }

    await window.fragmentsReady;

    const modal =
        document.getElementById("updates-modal");

    if (!modal) return;


    // Всегда нормализуем хронологический порядок
    // перед показом Update History.
    sortUpdateHistory();


    modal.style.display = "flex";
}

// 1.3 Закрытие Update History.
function closeUpdatesLog() {
    const modal = document.getElementById("updates-modal");
    if (modal) {
        modal.style.display = "none";
    }
}


// ============================================================
// 2. SITE INFORMATION
// ============================================================

// 2.1 Открытие Site Information.
async function openSiteInformationModal(event) {
    if (event) {
        event.preventDefault();
    }

    await window.fragmentsReady;

    const modal = document.getElementById("site-information-modal");

    if (modal) {
        modal.style.display = "flex";
        modal.setAttribute("aria-hidden", "false");

        requestAnimationFrame(() => {
            modal.querySelector(".modal-close-btn")?.focus();
        });
    }
}

// 2.2 Закрытие Site Information.
function closeSiteInformationModal() {
    const modal = document.getElementById("site-information-modal");

    if (modal) {
        modal.style.display = "none";
        modal.setAttribute("aria-hidden", "true");
    }
}


// ============================================================
// 3. SUGGESTIONS
// ============================================================

let valueRowCount = 0;

// 3.1 Счётчик динамически добавленных строк формы.

// 3.2 Открытие формы Suggestions.
function openSuggestionsModal() {
    const modal = document.getElementById("suggestions-modal");
    if (modal) modal.style.display = "flex";
}

// Функция закрытия модального окна предложений
// 3.3 Закрытие и сброс формы Suggestions.
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

// 3.4 Подключение асинхронной отправки Suggestions через Formspree.
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

// 3.5 Добавление пары полей Attribute Value.
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

// 3.6 Удаление строки Attribute Value.
function removeAttributeValueRow(id) {
    const row = document.getElementById(`value-row-${id}`);
    if (row) row.remove();
}


// ============================================================
// 4. SUPPLEMENTARY MATERIALS, PDF VIEWER И ВНУТРЕННИЕ МАТЕРИАЛЫ
// ============================================================

// 4.1 Открытие Supplementary Materials.
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

// 4.2 Закрытие Supplementary Materials.
function closeSupplementaryModal() {
    const modal = document.getElementById("supplementary-modal");
    if (modal) modal.style.display = "none";
}

// 4.3 Маршрутизация выбранного дополнительного материала.
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


// 4.4 Открытие документа во встроенном PDF Viewer.
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


// 4.5 Закрытие PDF Viewer и возврат к Supplementary Materials.
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


// 4.6 Закрытие PDF Viewer клавишей Escape.
document.addEventListener("keydown", event => {
    if (event.key !== "Escape") return;

    const modal = document.getElementById("pdf-viewer-modal");

    if (modal && getComputedStyle(modal).display !== "none") {
        closePdfViewer();
    }
});

// 4.7 Формирование и открытие внутреннего материала.
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

// 4.8 Закрытие окна внутреннего материала.
function closeMaterialContentModal() {
    const contentModal = document.getElementById("material-content-modal");
    if (contentModal) contentModal.style.display = "none";
}

// 4.9 Возврат из внутреннего материала к Supplementary Materials.
function goBackToSupplementary() {
    closeMaterialContentModal(); // Закриваємо поточне вікно (Глосарій)
    openSupplementaryModal();    // Відкриваємо попереднє модальне вікно
}


// ============================================================
// 5. ОБЩИЕ ОБРАБОТЧИКИ МОДАЛЬНЫХ ОКОН
// ============================================================

// 5.1 Закрытие основных модальных окон кликом по backdrop.
window.addEventListener("click", function(event) {
    const updatesModal = document.getElementById("updates-modal");
    const siteInformationModal = document.getElementById("site-information-modal");
    const suggestionsModal = document.getElementById("suggestions-modal");
    
    if (event.target === updatesModal) closeUpdatesLog();
    if (event.target === siteInformationModal) closeSiteInformationModal();
    if (event.target === suggestionsModal) closeSuggestionsModal();
});

// 5.2 Закрытие Site Information клавишей Escape.
window.addEventListener("keydown", function(event) {
    if (event.key !== "Escape") return;

    const modal = document.getElementById("site-information-modal");

    if (modal && getComputedStyle(modal).display !== "none") {
        closeSiteInformationModal();
    }
});


// ============================================================
// 6. HELP ACCORDION
// ============================================================

// 6.1 Закрытие Help и всех раскрытых секций.
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


// 6.2 Позиционирование Help относительно кнопки и fullscreen.
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


// 6.3 Инициализация Help Accordion и его обработчиков.
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


// ============================================================
// 7. НАВИГАЦИЯ ПО GLOSSARY
// ============================================================

// 7.1 Плавная навигация по якорям Glossary.
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
