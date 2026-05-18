let activeTable;

// 0. Функция-генератор для сложных структурированных тултипов
function createHeaderTooltip(definition, valuesList = []) {
    let html = `<div class="tooltip-definition">${definition}</div>`;
    
    if (valuesList.length > 0) {
        html += `<div class="tooltip-values-title">Values:</div>`;
        html += `<ul class="tooltip-values-list">`;
        
        valuesList.forEach(item => {
            html += `<li><strong>${item.value}</strong> — ${item.desc}</li>`;
        });
        
        html += `</ul>`;
    }
    return html;
}
//0.1 Функция открытия модального окна
function openUpdatesLog(event) {
    if (event) event.preventDefault(); // Предотвращаем дефолтное поведение
    
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

// Дополнительно: закрытие окна при клике на темную область вокруг него
window.addEventListener("click", function(event) {
    const modal = document.getElementById("updates-modal");
    if (event.target === modal) {
        closeUpdatesLog();
    }
});
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
                minWidth: 60,
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
        window.table1 = createRemoteTable("#table1-id", "data1.json", [
            {title:"id", field:"id", width:60, headerFilter: "input"},
            {title:"Title", 
            field:"Title",
            width:350,
            cssClass: "title-column", 
            frozen: true, 
            headerFilter: "input",
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
              
            {title:"Publication Date", 
            field:"Publication Date",
            width:150, 
            headerTooltip: function() {
            return createHeaderTooltip("Date of the first launch of the EA by the same publisher using the same distribution method. The website address may have changed since then. This information was identified through the EA description, publications, Google Search, and the Wayback Machine")},
            headerFilter: "input"},

            {title:"Last Update", 
            field:"Last Update",
            width:150, 
            headerTooltip: function() {
            return createHeaderTooltip("Date of the most recent EA update. An update is defined as any change to the content or to the media-cartographic components of the EA, as determined from author")},
            headerFilter: "input"},

            {title:"Major Updates", 
            field:"Major Updates",
            width:150, 
            headerTooltip: function() {
            return createHeaderTooltip("Number of major updates, each involving substantial changes to the interface, navigation, etc. This information was identified through the EA description, publications, Google Search, and the Wayback Machine")},
            headerFilter: "input"},

            {title:"Last Major Update", 
            field:"Last Major Update",
            width:150, 
            headerTooltip: function() {
            return createHeaderTooltip("Date of the most recent major update. This information was identified through the EA description, publications, Google Search, and the Wayback Machine")},
            headerFilter: "input"},

            {title:"Publisher Type", 
            field:"Publisher Type",
            width:200,
            headerFilter: "list",
                        headerFilterParams: { 
                            valuesLookup: "data", // Просканировать все данные для поиска уникальных строк
                            sort: "asc",          // Сортировать список по алфавиту
                            clearable: true
                            },
                headerTooltip: function() {
                return createHeaderTooltip(
                "Type of entity responsible for publishing the EA. The publisher and the developer of the EA may not coincide",
                [
                { value: "Government", desc: "Entities affiliated with government departments, including research institutes whose institutional functions involve policy regulation within a given field" },
                { value: "Organization", desc: "Non-governmental non-profit organizations" },
                { value: "Research Institution", desc: "Research institutions and universities" },
                { value: "Private Sector", desc: "Commercial enterprises and profit-making organizations" },
                { value: "Volunteers", desc: "Individuals or groups of individuals" }
                ]);
            }},            

            {title:"Publisher", 
            field:"Publisher",
            width:300, 
            headerTooltip: function() {
            return createHeaderTooltip("Official name of the EA publisher. If published by a consortium, only the coordinating institution or the first few institutions are listed")},
            headerFilter: "input"},

            {title:"Region of Publication", 
            field:"Region of Publication",
            width:240,  
            headerFilter: "list",
                        headerFilterParams: { 
                            valuesLookup: "data", // Просканировать все данные для поиска уникальных строк
                            sort: "asc",          // Сортировать список по алфавиту
                            clearable: true
                            },
            headerTooltip: function() {
                return createHeaderTooltip(
                "Based on the location of the publisher’s headquarters. If no headquarters can be identified (e.g., for international organizations), the cell is left blank. Classification of regions and countries according to the UNSD Standard Country or Area Codes for Statistical Use (M49)",
                [
                { value: "Africa", desc: "" },
                { value: "North America", desc: "" },
                { value: "Latin America and the Caribbean", desc: "" },
                { value: "Asia", desc: "" },
                { value: "Europe", desc: "" },
                { value: "Oceania", desc: "" }
                ]);
            }},                 

            {title:"Place of Publication", 
            field:"Place of Publication",
            width:200,  
            headerTooltip: function() {
            return createHeaderTooltip("Based on the location of the publisher’s headquarters. If no headquarters can be identified (e.g., for international organizations), the cell is left blank")},
            headerFilter: "input"},

            {
                title:"International Publisher", 
                field:"International Publisher", 
                width:200,
                headerTooltip: function() {
                return createHeaderTooltip("Publishing institution self-identifies as international")},  
                hozAlign:"center",
                formatter:"tickCross", 
                formatterParams:{
                    trueValue:"Yes", 
                    falseValue:"No",
                    crossElement: "✘",
                    tickElement: "✔", 
                }},

            {title:"Type of App Developers", 
            field:"Type of App Developers",
            width:200,  
            headerFilter: "list",
                        headerFilterParams: { 
                            valuesLookup: "data", // Просканировать все данные для поиска уникальных строк
                            sort: "asc",          // Сортировать список по алфавиту
                            clearable: true
                            },
            headerTooltip: function() {
                return createHeaderTooltip(
                "Developers of the application or cartographic component. If individual authors are listed but affiliated with a specific entity, that entity type is indicated. If the developer is not specified, the type of the publishing entity is provided instead",
                [
                { value: "Government", desc: "Entities affiliated with government departments, including research institutes whose institutional functions involve policy regulation within a given field" },
                { value: "Organization", desc: "Non-governmental non-profit organizations" },
                { value: "Research Institution", desc: "Research institutions and universities" },
                { value: "Private Sector", desc: "Commercial enterprises and profit-making organizations" },
                { value: "Volunteers", desc: "Individuals or groups of individuals" }
                ]);
            }},                            
                            
            {title:"App Developers", 
            field:"App Developers",
            width:300,  
            headerTooltip: function() {
                return createHeaderTooltip("Developers of the application or cartographic component. If the developer is not specified, the publishing entity is provided instead")}, 
            headerFilter: "input"},
            
            {title:"Main Language", 
            field:"Main Language",
            width:180, 
            headerTooltip: function() {
                return createHeaderTooltip("Primary interface language of the EA. The extent to which EA content is translated is not taken into account")},
            headerFilter: "list",
                        headerFilterParams: { 
                            valuesLookup: "data", // Просканировать все данные для поиска уникальных строк
                            sort: "asc",          // Сортировать список по алфавиту
                            clearable: true
                            }},

            {title:"Number of Languages", 
            field:"Number of Languages",
            width:150, 
            headerTooltip: function() {
                return createHeaderTooltip("Number of the EA interface languages.The extent to which EA content is translated is not taken into account")},
            headerFilter: "input"},                                                    

            {
                title:"English", 
                field:"English", 
                width:130,
                headerTooltip: function() {
                return createHeaderTooltip("Availability of an English localisation. The extent to which EA content is translated is not taken into account")}, 
                hozAlign:"center",
                formatter:"tickCross", 
                formatterParams:{
                    trueValue:"Yes", 
                    falseValue:"No",
                    crossElement: "✘",
                    tickElement: "✔", 
                }},

            {title:"Project Type", 
            field:"Project Type",
            width:200, 
            headerFilter: "list",
                        headerFilterParams: { 
                            valuesLookup: "data", // Просканировать все данные для поиска уникальных строк
                            sort: "asc",          // Сортировать список по алфавиту
                            clearable: true
                            },
            headerTooltip: function() {
                return createHeaderTooltip(
                "Project involves the creation and maintenance of two versions of the atlas",
                [
                { value: "Standalone", desc: "EA only" },
                { value: "Dual", desc: "Both paper and electronic versions" }
                ]);
            }},                         

            {
                title:"Paper Version", 
                field:"Paper Version", 
                width:150,
                headerTooltip: function() {
                return createHeaderTooltip("Availability of a paper atlas linked to the electronic version. It may be published before or after the EA release")}, 
                hozAlign:"center",
                formatter:"tickCross", 
                formatterParams:{
                    trueValue:"Yes", 
                    falseValue:"No",
                    crossElement: "✘",
                    tickElement: "✔", 
                }},
                
            {title:"Distribution", 
            field:"Distribution",
            width:200, 
            headerTooltip: "coment",
            headerFilter: "list",
                        headerFilterParams: { 
                            valuesLookup: "data", // Просканировать все данные для поиска уникальных строк
                            sort: "asc",          // Сортировать список по алфавиту
                            clearable: true
                            },
            headerTooltip: function() {
                return createHeaderTooltip(
                "Method of EA distribution or type of client–server scenario",
                [
                { value: "Desktop", desc: "EA requires installation on the user’s computer or mobile device. No internet connection is required for operation" },
                { value: "Hybrid", desc: "EA requires installation on the user’s computer or mobile device. However, part of its data is stored in the cloud and requires a continuous internet connection" },
                { value: "Dual", desc: "EA is available only via a web browser" }
                ]);
            }},                        
                            
            {title:"Access", 
            field:"Access",
            width:200,  
            headerFilter: "list",
                        headerFilterParams: { 
                            valuesLookup: "data", // Просканировать все данные для поиска уникальных строк
                            sort: "asc",          // Сортировать список по алфавиту
                            clearable: true
                            },
            headerTooltip: function() {
                return createHeaderTooltip(
                "Access conditions for EA content",
                [
                { value: "Public (Free)", desc: "Free and unrestricted access" },
                { value: "Public (Paid)", desc: "Access to EA content requires payment" },
                { value: "Public (Freemium)", desc: "Part of the EA content requires payment" },
                { value: "Public (Registered)", desc: "Access to EA content is free but requires registration" },
                { value: "Restricted", desc: "Access is restricted" }
                ]);
            }},                 
                            
            {title:"Technology Type", 
            field:"Technology Type",
            width:200,  
            headerFilter: "list",
                        headerFilterParams: { 
                            valuesLookup: "data", // Просканировать все данные для поиска уникальных строк
                            sort: "asc",          // Сортировать список по алфавиту
                            clearable: true
                            },
            headerTooltip: function() {
                return createHeaderTooltip(
                "Type of technology used to implement the entire atlas application or cartographic representation. The technology must be suitable for repeated use. Software solutions for implementing other content elements should not be taken into account. Solutions at a higher level in the hierarchy should be specified",
                [
                { value: "None", desc: "Cartographic or atlas technology is absent" },
                { value: "Map-oriented", desc: "Library or solution intended for creating maps or spatial visualisations" },
                { value: "App-oriented", desc: "Platform, framework or solution intended for creating ready-made applications in the field of cartography and geovisualisation but not specifically designed for producing EAs" },
                { value: "Atlas platform/framework", desc: "Platform or framework specifically designed for the repeated creation of EAs. The platform/framework may be determined at your discretion if there are several identical atlas applications that differ only in terms of content" }
                ]);
            }},                          
                            
            {title:"Technology", 
            field:"Technology",
            width:200,  
            headerTooltip: function() {
                return createHeaderTooltip("Name of the technology used. Determined based on information from the developers, its visual appearance and the source code")},
            headerFilter: "input"},
            
            {title:"Implementation Method", 
            field:"Implementation Method",
            width:200,  
            headerFilter: "list",
                        headerFilterParams: { 
                            valuesLookup: "data", // Просканировать все данные для поиска уникальных строк
                            sort: "asc",          // Сортировать список по алфавиту
                            clearable: true
                            },
            headerTooltip: function() {
                return createHeaderTooltip(
                "Method of EA implementation from the perspective of navigational integrity",
                [
                { value: "Standalone", desc: "EA is implemented as a standalone website or application" },
                { value: "Embedded", desc: "EA is embedded within a website or geoportal. The main page corresponds to the website or geoportal homepage" },
                { value: "Separated", desc: "EA sections are navigationally isolated and open on separate pages without a unified global navigation system" }
                ]);
            }},                       

            {
                title:"Mobile Devices", 
                field:"Mobile Devices", 
                width:150,
                headerTooltip: function() {
                return createHeaderTooltip("Ability to operate on mobile devices. The degree of interface adaptation is not taken into account")}, 
                hozAlign:"center",
                formatter:"tickCross", 
                formatterParams:{
                    trueValue:"Yes", 
                    falseValue:"No",
                    crossElement: "✘",
                    tickElement: "✔", 
                }},
            
            {title:"Date of Analysis", 
            field:"Date of Analysis",
            width:150,  
            headerFilter: "input"},

            {title:"URL", 
            field:"URL", 
            width:150, 
            headerFilter: "input"}                                                                                             

        ]);

        window.table2 = createRemoteTable("#table2-id", "data2.json", [
            {title:"id", field:"id", width:60, headerFilter: "input"},
            {title:"Title", 
            field:"Title",
            width:350, 
            cssClass: "title-column",
            frozen: true, 
            headerFilter: "input",
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

            {title:"Content Type", 
            field:"Content Type",
            width:150,  
            headerFilter: "list",
                        headerFilterParams: { 
                            valuesLookup: "data", // Просканировать все данные для поиска уникальных строк
                            sort: "asc",          // Сортировать список по алфавиту
                            clearable: true
                            },
            headerTooltip: function() {
                return createHeaderTooltip(
                "Each type implies specific requirements for both EA content and implementation. The type is recorded only if explicitly stated by the developers in the EA title or description; no independent classification is applied",
                [{ value: "Thematic", desc: "Regular thematic EA" },
                { value: "Statistical", desc: "EA representing statistical data and typically complying with specific requirements (Schulz, 2014)" },
                { value: "National", desc: "Official national atlas, typically characterized by complex thematic coverage" }
                ]);
            }},

            {title:"Thematic Coverage", 
            field:"Thematic Coverage",
            width:200,  
            headerFilter: "list",
                        headerFilterParams: { 
                            valuesLookup: "data", // Просканировать все данные для поиска уникальных строк
                            sort: "asc",          // Сортировать список по алфавиту
                            clearable: true
                            },
            headerTooltip: function() {
                return createHeaderTooltip(
                "Number and diversity of topics represented in the EA",
                [{ value: "Monothematic", desc: "One dominant topic prevails (80% of the content or more)" },
                { value: "Polythematic", desc: "Two or more topics are represented. History is not counted as a separate topic" },
                { value: "Complex", desc: "Comprehensive representation of a theme or territory according to the interpretation of Konstantin Salichtchev (1976). The level of detail is not considered. The EA must include at least Human Geography, Environment, Physical Geography, and Economics" }
                ]);
            }},

            {title:"Topic 1", 
            field:"Topic 1",
            width:200,  
            headerFilter: "list",
                        headerFilterParams: { 
                            valuesLookup: "data", // Просканировать все данные для поиска уникальных строк
                            sort: "asc",          // Сортировать список по алфавиту
                            clearable: true
                            },
            headerTooltip: function() {
                return createHeaderTooltip(
                "Topics - generalized EA themes. The most common topics were selected. <br>Topic 1 - main topic (80% of the content or more) or one of the main topics</br>",
                [{ value: "Economics and Trade", desc: "Economy, Trade, Finance, Agriculture, Industry, and Economic activity" },
                { value: "Environment", desc: "Ecology, Human–Environment interaction, and Environmental protection activities" },
                { value: "Healthcare", desc: "Healthcare, Public health, and Disease spread" },
                { value: "History", desc: "Historical atlases. History is commonly combined with other topics" },
                { value: "Human geography", desc: "Population Geography, Political Geography, Cultural Geography, and Social Geography" },
                { value: "Physical geography", desc: "Geomorphology, Hydrology, Climatology, etc." },
                { value: "Other", desc: "Media & Journalism, Literature, Sport, etc." }
                ]);
            }},

             {title:"Topic 2", 
            field:"Topic 2",
            width:200,  
            headerFilter: "list",
                        headerFilterParams: { 
                            valuesLookup: "data", // Просканировать все данные для поиска уникальных строк
                            sort: "asc",          // Сортировать список по алфавиту
                            clearable: true
                            },
            headerTooltip: function() {
                return createHeaderTooltip(
                "Topics - generalized EA themes. The most common topics were selected. <br>Topic 2 - secondary or equally important topic</br>",
                [{ value: "Economics and Trade", desc: "Economy, Trade, Finance, Agriculture, Industry, and Economic activity" },
                { value: "Environment", desc: "Ecology, Human–Environment interaction, and Environmental protection activities" },
                { value: "Healthcare", desc: "Healthcare, Public health, and Disease spread" },
                { value: "History", desc: "Historical atlases. History is commonly combined with other topics" },
                { value: "Human geography", desc: "Population Geography, Political Geography, Cultural Geography, and Social Geography" },
                { value: "Physical geography", desc: "Geomorphology, Hydrology, Climatology, etc." },
                { value: "Other", desc: "Media & Journalism, Literature, Sport, etc." }
                ]);
            }},

            {title:"Topic 3", 
            field:"Topic 3",
            width:200,  
            headerFilter: "list",
                        headerFilterParams: { 
                            valuesLookup: "data", // Просканировать все данные для поиска уникальных строк
                            sort: "asc",          // Сортировать список по алфавиту
                            clearable: true
                            },
            headerTooltip: function() {
                return createHeaderTooltip(
                "Topics - generalized EA themes. The most common topics were selected. <br>Topic 3 - third or equally important topic</br>",
                [{ value: "Economics and Trade", desc: "Economy, Trade, Finance, Agriculture, Industry, and Economic activity" },
                { value: "Environment", desc: "Ecology, Human–Environment interaction, and Environmental protection activities" },
                { value: "Healthcare", desc: "Healthcare, Public health, and Disease spread" },
                { value: "History", desc: "Historical atlases. History is commonly combined with other topics" },
                { value: "Human geography", desc: "Population Geography, Political Geography, Cultural Geography, and Social Geography" },
                { value: "Physical geography", desc: "Geomorphology, Hydrology, Climatology, etc." },
                { value: "Other", desc: "Media & Journalism, Literature, Sport, etc." }
                ]);
            }},

            {title:"Theme", 
            field:"Theme",
            width:200,  
            headerTooltip: function() {
                return createHeaderTooltip("Specific theme of the EA. It is always narrower than a topic and may relate to multiple topics simultaneously")},
            headerFilter: "input"},

            {title:"Spatial Ontology of Objects", 
            field:"Spatial Ontology of Objects",
            width:250,  
            headerFilter: "list",
                        headerFilterParams: { 
                            valuesLookup: "data", // Просканировать все данные для поиска уникальных строк
                            sort: "asc",          // Сортировать список по алфавиту
                            clearable: true
                            },
            headerTooltip: function() {
                return createHeaderTooltip(
                "Origin and nature of the objects and phenomena constituting the EA's main content",
                [{ value: "Earth Objects & Phenomena", desc: "Real-world Earth objects and phenomena" },
                { value: "Space Objects & Phenomena", desc: "Real-world space (extraterrestrial) objects and phenomena" },
                { value: "Fictional World Objects & Phenomena", desc: "Objects and phenomena belonging to fictional worlds" },
                { value: "Abstract Concepts", desc: "Abstract and non-material ideas and concepts" }
                ]);
            }},

            {title:"Spatial Coverage", 
            field:"Spatial Coverage",
            width:200,  
            headerFilter: "list",
                        headerFilterParams: { 
                            valuesLookup: "data", // Просканировать все данные для поиска уникальных строк
                            sort: "asc",          // Сортировать список по алфавиту
                            clearable: true
                            },
            headerTooltip: function() {
                return createHeaderTooltip(
                "Spatial coverage level of the EA thematic content. For countries and their administrative units, classification is based on political boundaries rather than area size. This field is only used for Earth Objects & Phenomena",
                [{ value: "World", desc: "" },
                { value: "Continental/Oceanic", desc: "Antarctica, Arctic, Asia, Africa, Australia and Oceania, Europe, North America, South America" },
                { value: "Regional", desc: "Territories of several countries of any size" },
                { value: "Country/Sea", desc: "" },
                { value: "Sub-regional", desc: "Regions of countries (NUTS-1)" },
                { value: "Local", desc: "Provinces and districts of countries (NUTS-2 and NUTS-3)" },
                { value: "Municipal/Site-specific", desc: "Individual cities and agglomerations, and all other smaller objects" }
                ]);
            }},

            {title:"Region", 
            field:"Region",
            width:200,  
            headerFilter: "list",
                        headerFilterParams: { 
                            valuesLookup: "data", // Просканировать все данные для поиска уникальных строк
                            sort: "asc",          // Сортировать список по алфавиту
                            clearable: true
                            },
            headerTooltip: function() {
                return createHeaderTooltip(
                "Spatial coverage of the EA thematic content. This field is only used for Earth Objects & Phenomena",
                [{ value: "World", desc: "" },
                { value: "Antarctica", desc: "" },
                { value: "Africa", desc: "" },
                { value: "North America", desc: "" },
                { value: "Latin America and the Caribbean", desc: "" },
                { value: "Asia", desc: "" },
                { value: "Europe", desc: "" },
                { value: "Oceania", desc: "" },
                { value: "Arctic Ocean", desc: "" },
                { value: "Atlantic Ocean", desc: "" },
                { value: "Indian Ocean", desc: "" },
                { value: "Pacific Ocean", desc: "" },
                { value: "Southern Ocean", desc: "" }
                ]);
            }},

            {title:"Content Spatiality", 
            field:"Content Spatiality",
            width:200,  
            headerFilter: "list",
                        headerFilterParams: { 
                            valuesLookup: "data", // Просканировать все данные для поиска уникальных строк
                            sort: "asc",          // Сортировать список по алфавиту
                            clearable: true
                            },
            headerTooltip: function() {
                return createHeaderTooltip(
                "Spatial characteristics of the EA content",
                [{ value: "Cartographic", desc: "Maps are the primary type of content representation" },
                { value: "Geospatial", desc: "Mixed geolocated content predominates, which is neither cartographic nor visualizational" },
                { value: "Spatial", desc: "Spatial visualisations (constructed information space) are the primary type of content representation" },
                { value: "Visualisation", desc: "Non-spatial visualisations (charts and diagrams) prevail" }
                ]);
            }},

            {title:"Temporal scope", 
            field:"Temporal scope",
            width:200,  
            headerFilter: "list",
                        headerFilterParams: { 
                            valuesLookup: "data", // Просканировать все данные для поиска уникальных строк
                            sort: "asc",          // Сортировать список по алфавиту
                            clearable: true
                            },
            headerTooltip: function() {
                return createHeaderTooltip(
                "Temporal scope of the EA content",
                [{ value: "Current", desc: "Data for 2000–2025 only" },
                { value: "Historical", desc: "Includes pre-2000 data and historical dynamics" },
                { value: "Forecast", desc: "Includes post-2025 or forecast data" },
                { value: "Current & Historical", desc: "Combination of current and historical content" },
                { value: "Current & Forecast", desc: "Combination of current and forecast data" },
                { value: "Multi-temporal", desc: "Includes all three temporal dimensions" }
                ]);
            }},

            {
                title:"AI-generated Content", 
                field:"AI-generated Content", 
                width:150,
                headerTooltip: function() {
                return createHeaderTooltip("Presence of any AI-generated content, regardless of its proportion")}, 
                hozAlign:"center",
                formatter:"tickCross", 
                formatterParams:{
                    trueValue:"Yes", 
                    falseValue:"No",
                    crossElement: "✘",
                    tickElement: "✔", 
                }},

             {
                title:"Regular Updates", 
                field:"Regular Updates", 
                width:150,
                headerTooltip: function() {
                return createHeaderTooltip("EA content is continuously updated or planned for future updates")}, 
                hozAlign:"center",
                formatter:"tickCross", 
                formatterParams:{
                    trueValue:"Yes", 
                    falseValue:"No",
                    crossElement: "✘",
                    tickElement: "✔", 
                }},

            {
                title:"Data Catalogue", 
                field:"Data Catalogue", 
                width:150,
                headerTooltip: function() {
                return createHeaderTooltip("Presence of a local data directory or data directory separated into a distinct section. The catalogue should be in the form of an attribute table or an interactive interface, and the data should be available for download")}, 
                hozAlign:"center",
                formatter:"tickCross", 
                formatterParams:{
                    trueValue:"Yes", 
                    falseValue:"No",
                    crossElement: "✘",
                    tickElement: "✔", 
                }},

             {
                title:"Story-centred Content", 
                field:"Story-centred Content", 
                width:250,
                headerTooltip: function() {
                return createHeaderTooltip("All components of the EA serving to unfold or analyse (explicit) stories")}, 
                hozAlign:"center",
                formatter:"tickCross", 
                formatterParams:{
                    trueValue:"Yes", 
                    falseValue:"No",
                    crossElement: "✘",
                    tickElement: "✔", 
                }}            
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


