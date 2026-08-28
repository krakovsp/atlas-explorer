/**
 * ATLAS EXPLORER — MOBILE & PRIVACY
 *
 * ОГЛАВЛЕНИЕ
 * 1. Mobile Atlas Catalogue
 * 2. Google Analytics и Cookie Consent
 *
 */

// ============================================================
// 1. MOBILE ATLAS CATALOGUE
// ============================================================

// 1.1 Состояние мобильного каталога.
const mobileCatalogueState = {
    initialized: false,
    data: [],
    view: "bibliographic",
    query: "",
    expandedId: null,
    visibleCount: 5,
    step: 5
};


// 1.2 Условие активации mobile / limited mode.
const mobileCatalogueMedia = window.matchMedia(
    "(max-width: 1099px)"
);


// 1.3 Инициализация мобильного каталога и загрузка data.json.
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


// 1.4 Подключение поиска, вкладок, details и Show More.
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


// 1.5 Фильтрация атласов по полям активного представления.
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


// 1.6 Получение колонок активного мобильного раздела.
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


// 1.7 Преобразование конфигурации Tabulator в плоский список атрибутов.
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


// 1.8 Получение чистого текстового названия атрибута.
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


// 1.9 Проверка наличия значения.
function hasMobileAtlasValue(value) {

    return !(
        value === null ||
        value === undefined ||
        String(value).trim() === ""
    );
}


// 1.10 Форматирование значения для карточки.
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


// 1.11 Экранирование текста перед вставкой в HTML.
function escapeMobileCatalogueHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


// 1.12 Наборы кратких атрибутов для трёх мобильных представлений.
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


// 1.13 Создание краткой информации карточки.
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


// 1.14 Создание полного блока атрибутов раскрытой карточки.
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


// 1.15 Создание HTML одной карточки атласа.
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


// 1.16 Рендер списка, счётчика и Show More.
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


// 1.17 Первичный запуск мобильного каталога после готовности DOM.
document.addEventListener(
    "DOMContentLoaded",
    () => {

        if (mobileCatalogueMedia.matches) {
            initMobileAtlasCatalogue();
        }
    }
);


// Если пользователь изменил размер окна
// 1.18 Инициализация каталога при переходе в mobile / limited mode.
mobileCatalogueMedia.addEventListener(
    "change",
    event => {

        if (event.matches) {
            initMobileAtlasCatalogue();
        }
    }
);


// ============================================================
// 2. GOOGLE ANALYTICS И COOKIE CONSENT
// ============================================================

// 2.1 Константы и текущее состояние Analytics Consent.
const GA_MEASUREMENT_ID = "G-RKM4M70Q6P";

const ANALYTICS_CONSENT_KEY =
    "atlasExplorerAnalyticsConsent";

const ANALYTICS_CONSENT_MAX_AGE =
    180 * 24 * 60 * 60 * 1000; // 180 дней

let googleAnalyticsLoaded = false;


// 2.2 Чтение сохранённого решения о статистике.
function getAnalyticsConsent() {

    try {

        const rawValue =
            localStorage.getItem(ANALYTICS_CONSENT_KEY);

        if (!rawValue) return null;

        const stored = JSON.parse(rawValue);

        if (
            !stored ||
            !stored.value ||
            !stored.timestamp
        ) {
            return null;
        }

        const isExpired =
            Date.now() - stored.timestamp >
            ANALYTICS_CONSENT_MAX_AGE;

        if (isExpired) {

            localStorage.removeItem(
                ANALYTICS_CONSENT_KEY
            );

            return null;
        }

        return stored.value;

    } catch (error) {

        console.warn(
            "Could not read analytics consent.",
            error
        );

        return null;
    }
}


// 2.3 Сохранение решения о статистике.
function saveAnalyticsConsent(value) {

    try {

        localStorage.setItem(
            ANALYTICS_CONSENT_KEY,
            JSON.stringify({
                value: value,
                timestamp: Date.now()
            })
        );

    } catch (error) {

        console.warn(
            "Could not save analytics consent.",
            error
        );
    }
}


// 2.4 Показ панели Cookie Consent.
function showCookieConsent() {

    const banner =
        document.getElementById("cookie-consent");

    if (!banner) return;

    banner.hidden = false;
}


// 2.5 Скрытие панели Cookie Consent.
function hideCookieConsent() {

    const banner =
        document.getElementById("cookie-consent");

    if (!banner) return;

    banner.hidden = true;
}


// 2.6 Обновление Google Consent Mode.
function updateGoogleConsent(granted) {

    if (typeof window.gtag !== "function") return;

    gtag("consent", "update", {

        analytics_storage:
            granted ? "granted" : "denied",

        // Atlas Explorer не использует Google Ads
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied"
    });
}


// 2.7 Загрузка GA4 после согласия.
function loadGoogleAnalytics() {

    if (googleAnalyticsLoaded) return;

    if (
        document.querySelector(
            'script[data-atlas-google-analytics]'
        )
    ) {
        googleAnalyticsLoaded = true;
        return;
    }

    googleAnalyticsLoaded = true;

    updateGoogleConsent(true);

    const analyticsScript =
        document.createElement("script");

    analyticsScript.async = true;

    analyticsScript.src =
        "https://www.googletagmanager.com/gtag/js?id=" +
        encodeURIComponent(GA_MEASUREMENT_ID);

    analyticsScript.dataset.atlasGoogleAnalytics =
        "true";

    document.head.appendChild(
        analyticsScript
    );


    /*
     * Команды помещаются в dataLayer.
     * gtag.js обработает их после загрузки.
     */
    gtag("js", new Date());

    gtag(
        "config",
        GA_MEASUREMENT_ID,
        {
            /*
             * Для Atlas Explorer нужны только
             * статистические функции.
             */
            allow_google_signals: false,
            allow_ad_personalization_signals: false
        }
    );
}


// 2.8 Удаление cookies Google Analytics.
function deleteGoogleAnalyticsCookies() {

    const analyticsCookiePrefixes = [
        "_ga",
        "_gid",
        "_gat"
    ];

    const cookies =
        document.cookie
            .split(";")
            .map(cookie =>
                cookie.trim().split("=")[0]
            );

    const hostname =
        window.location.hostname;

    cookies.forEach(cookieName => {

        const isAnalyticsCookie =
            analyticsCookiePrefixes.some(
                prefix =>
                    cookieName.startsWith(prefix)
            );

        if (!isAnalyticsCookie) return;


        // Host-only cookie
        document.cookie =
            `${cookieName}=; Max-Age=0; path=/`;


        // Domain cookie
        document.cookie =
            `${cookieName}=; Max-Age=0; path=/; domain=${hostname}`;

        document.cookie =
            `${cookieName}=; Max-Age=0; path=/; domain=.${hostname}`;
    });
}


// 2.9 Обработка согласия на Analytics.
function acceptAnalyticsCookies() {

    saveAnalyticsConsent("granted");

    hideCookieConsent();

    loadGoogleAnalytics();
}


// 2.10 Обработка отказа от Analytics.
function rejectAnalyticsCookies() {

    const analyticsWasLoaded =
        googleAnalyticsLoaded;

    saveAnalyticsConsent("denied");

    updateGoogleConsent(false);

    deleteGoogleAnalyticsCookies();

    hideCookieConsent();


    /*
     * Если пользователь ранее разрешил Analytics,
     * gtag.js уже присутствует на странице.
     *
     * Перезагрузка полностью возвращает сайт
     * в Basic Consent Mode, где Google script
     * больше не загружается.
     */
    if (analyticsWasLoaded) {

        window.setTimeout(() => {
            window.location.reload();
        }, 100);
    }
}


// 2.11 Открытие Cookie Settings из Site Information.
function openCookieSettings() {

    /*
     * Если Site Information сейчас открыто —
     * закрываем его перед показом cookie panel.
     */
    if (
        typeof closeSiteInformationModal ===
        "function"
    ) {
        closeSiteInformationModal();
    }

    requestAnimationFrame(() => {
        showCookieConsent();
    });
}


// 2.12 Инициализация режима Analytics при загрузке сайта.
async function initialiseAnalyticsConsent() {

    /*
     * Cookie panel находится во внешнем
     * HTML fragment.
     */
    if (window.fragmentsReady) {
        await window.fragmentsReady;
    }

    const consent =
        getAnalyticsConsent();


    if (consent === "granted") {

        loadGoogleAnalytics();
        return;
    }


    if (consent === "denied") {

        /*
         * Ничего не загружаем.
         */
        return;
    }


    /*
     * Пользователь ещё не сделал выбор.
     */
    showCookieConsent();
}


// 2.13 Запуск Analytics Consent после готовности DOM.
if (document.readyState === "loading") {

    document.addEventListener(
        "DOMContentLoaded",
        initialiseAnalyticsConsent,
        { once: true }
    );

} else {

    initialiseAnalyticsConsent();
}
