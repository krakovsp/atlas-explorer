
        const TABLE_1_COLUMNS = [
           {
                title: "ID", 
                field: "id", 
                width: "7%",       
                minWidth: 100, 
                headerFilter: "list", 
                // Кастомная функция: преобразует значения в строки, чтобы избежать конфликта "число vs строка"
                headerFilterFunc: function(headerValue, rowValue, rowData, filterParams){
                    // Если ничего не выбрано, показываем строку
                    if(!headerValue || headerValue.length === 0) return true;
                    
                    // Переводим текущее значение ID строки в строку
                    const currentId = String(rowValue).trim();
                    
                    // Проверяем, есть ли текущий ID среди выбранных в массиве элементов
                    return headerValue.map(v => String(v).trim()).includes(currentId);
                },
                headerFilterPlaceholder: "Select multiple...",
                headerFilterParams: { 
                    valuesLookup: "data", 
                    sort: "asc",          
                    clearable: true,      
                    multiselect: true     
                }
            },
            {title:"Title", 
            field:"Title",
            width: "16%",       
            minWidth: 100,
            cssClass: "title-column", 
            frozen: true, 
            headerFilter: "input",
            formatter: function(cell, formatterParams, onRendered) {
        const data = cell.getRow().getData();
        const url = data.URL; 
        const name = cell.getValue();

        if (url) {
            // Убрали инлайн-стиль цвета, добавили класс table-link
            return `<a href="${url}" target="_blank" class="table-link">${name}</a>`;
        } else {
            return name;
        }},
        headerFilterPlaceholder: "Enter keyword...",
        },
              
            {title:"Status", 
            field:"Status",
            width: "7%", 
            minWidth: 100,
            headerFilter: "list",
                        headerFilterParams: { 
                            valuesLookup: "data", // Просканировать все данные для поиска уникальных строк
                            sort: "asc",          // Сортировать список по алфавиту
                            clearable: true
                            },
                headerTooltip: function() {
                return createHeaderTooltip(
                "Current operational status of the EA, indicating whether it is actively maintained, archived, or no longer functional",
                [
                { value: "Active", desc: "EA is fully functional and is actively maintained and updated" },
                { value: "Archived", desc: "EA remains fully or partially functional but is no longer the current version and is no longer maintained or updated" },
                { value: "Inactive", desc: "EA has ceased to exist. A desktop application no longer runs on modern operating systems, or the website of an online atlas has been removed and is no longer accessible" },
                { value: "Replaced", desc: "Older version of the atlas that has been replaced by a newer version of the website, which remains active" }
                ]);

            }, headerFilterPlaceholder: "Select value..."
        },

            {title:"Publication Date", 
            field:"Publication Date",
            width: "9%", 
            minWidth: 100, 
            headerTooltip: function() {
            return createHeaderTooltip(
            "Date of the first launch of the EA by the same publisher using the same distribution method. The website address may have changed since then. This information was identified through the EA description, publications, Google Search, and the Wayback Machine",
             [
                "Use “-” to specify a range of values, e.g., 2015–2019" ,
                "Use the “>” operator for values strictly greater than, or “>=” for greater than or equal to, e.g., >=2015",
                "Use the “<” operator for values strictly less than, or “<=” for less than or equal to, e.g., <=2015",
                "Or enter an exact value, e.g., 2015" 
                ],
                "Functionality" // <-- Третий аргумент, который заменит "Values"
                );
                },
            headerFilter: "input",
             // Подсказка для пользователя внутри поля:
                headerFilterPlaceholder: "Enter condition…", 
    
        // Кастомная логика фильтрации:
        headerFilterFunc: function(headerValue, rowValue, rowData, filterParams) {
        // Если поле пустое — показываем все строки
        if (!headerValue) return true; 
        if (!rowValue) return false;

        const val = parseFloat(rowValue) || parseInt(rowValue);
        headerValue = headerValue.trim();

        // 1. Диапазон "МЕЖДУ" (через дефис, например: 2015-2025)
        if (headerValue.includes("-")) {
            const parts = headerValue.split("-");
            const min = parseFloat(parts[0]);
            const max = parseFloat(parts[1]);
            return val >= min && val <= max;
        }
        // 2. Больше или равно (>=10)
        if (headerValue.startsWith(">=")) {
            return val >= parseFloat(headerValue.replace(">=", ""));
        }
        // 3. Меньше или равно (<=5)
        if (headerValue.startsWith("<=")) {
            return val <= parseFloat(headerValue.replace("<=", ""));
        }
        // 4. Строго больше (>10)
        if (headerValue.startsWith(">")) {
            return val > parseFloat(headerValue.replace(">", ""));
        }
        // 5. Строго меньше (<5)
        if (headerValue.startsWith("<")) {
            return val < parseFloat(headerValue.replace("<", ""));
        }

        // Если просто ввели число — ищем совпадение (как раньше)
        return String(rowValue).toLowerCase().includes(String(headerValue).toLowerCase());
    }

            },

            {title:"Last Update", 
            field:"Last Update",
            width: "9%", 
            minWidth: 100, 
            headerTooltip: function() {
            return createHeaderTooltip("Date of the most recent EA update. An update is defined as any change to the content or to the media-cartographic components of the EA, as determined from author",
                [
                "Use “-” to specify a range of values, e.g., 2015–2019" ,
                "Use the “>” operator for values strictly greater than, or “>=” for greater than or equal to, e.g., >=2015",
                "Use the “<” operator for values strictly less than, or “<=” for less than or equal to, e.g., <=2015",
                "Or enter an exact value, e.g., 2015" 
                ],
                "Functionality" // <-- Третий аргумент, который заменит "Values"
               )},
            headerFilter: "input",
             // Подсказка для пользователя внутри поля:
                headerFilterPlaceholder: "Enter condition…", 
    
        // Кастомная логика фильтрации:
        headerFilterFunc: function(headerValue, rowValue, rowData, filterParams) {
        // Если поле пустое — показываем все строки
        if (!headerValue) return true; 
        if (!rowValue) return false;

        const val = parseFloat(rowValue) || parseInt(rowValue);
        headerValue = headerValue.trim();

        // 1. Диапазон "МЕЖДУ" (через дефис, например: 2015-2025)
        if (headerValue.includes("-")) {
            const parts = headerValue.split("-");
            const min = parseFloat(parts[0]);
            const max = parseFloat(parts[1]);
            return val >= min && val <= max;
        }
        // 2. Больше или равно (>=10)
        if (headerValue.startsWith(">=")) {
            return val >= parseFloat(headerValue.replace(">=", ""));
        }
        // 3. Меньше или равно (<=5)
        if (headerValue.startsWith("<=")) {
            return val <= parseFloat(headerValue.replace("<=", ""));
        }
        // 4. Строго больше (>10)
        if (headerValue.startsWith(">")) {
            return val > parseFloat(headerValue.replace(">", ""));
        }
        // 5. Строго меньше (<5)
        if (headerValue.startsWith("<")) {
            return val < parseFloat(headerValue.replace("<", ""));
        }

        // Если просто ввели число — ищем совпадение (как раньше)
        return String(rowValue).toLowerCase().includes(String(headerValue).toLowerCase());
    }

            },

            {title:"Major Updates", 
            field:"Major Updates",
            width: "8%", 
            minWidth: 100, 
            headerTooltip: function() {
            return createHeaderTooltip("Number of major updates, each involving substantial changes to the interface, navigation, etc. This information was identified through the EA description, publications, Google Search, and the Wayback Machine",
                [
                "Use “-” to specify a range of values, e.g., 1–3" ,
                "Use the “>” operator for values strictly greater than, or “>=” for greater than or equal to, e.g., >=3",
                "Use the “<” operator for values strictly less than, or “<=” for less than or equal to, e.g., <=3",
                "Or enter an exact value, e.g., 3" 
                ],
                "Functionality" // <-- Третий аргумент, который заменит "Values"
               )},
            headerFilter: "input",

             // Подсказка для пользователя внутри поля:
                headerFilterPlaceholder: "Enter condition…", 
    
        // Кастомная логика фильтрации:
        headerFilterFunc: function(headerValue, rowValue, rowData, filterParams) {
        // Если поле пустое — показываем все строки
        if (!headerValue) return true; 
        if (!rowValue) return false;

        const val = parseFloat(rowValue) || parseInt(rowValue);
        headerValue = headerValue.trim();

        // 1. Диапазон "МЕЖДУ" (через дефис, например: 2015-2025)
        if (headerValue.includes("-")) {
            const parts = headerValue.split("-");
            const min = parseFloat(parts[0]);
            const max = parseFloat(parts[1]);
            return val >= min && val <= max;
        }
        // 2. Больше или равно (>=10)
        if (headerValue.startsWith(">=")) {
            return val >= parseFloat(headerValue.replace(">=", ""));
        }
        // 3. Меньше или равно (<=5)
        if (headerValue.startsWith("<=")) {
            return val <= parseFloat(headerValue.replace("<=", ""));
        }
        // 4. Строго больше (>10)
        if (headerValue.startsWith(">")) {
            return val > parseFloat(headerValue.replace(">", ""));
        }
        // 5. Строго меньше (<5)
        if (headerValue.startsWith("<")) {
            return val < parseFloat(headerValue.replace("<", ""));
        }

        // Если просто ввели число — ищем совпадение (как раньше)
        return String(rowValue).toLowerCase().includes(String(headerValue).toLowerCase());
    }

            },

            {title:"Last Major Update", 
            field:"Last Major Update",
            width: "9%", 
            minWidth: 100, 
            headerTooltip: function() {
            return createHeaderTooltip("Date of the most recent major update. This information was identified through the EA description, publications, Google Search, and the Wayback Machine",
                [
                "Use “-” to specify a range of values, e.g., 1–3" ,
                "Use the “>” operator for values strictly greater than, or “>=” for greater than or equal to, e.g., >=3",
                "Use the “<” operator for values strictly less than, or “<=” for less than or equal to, e.g., <=3",
                "Or enter an exact value, e.g., 3" 
                ],
                "Functionality" // <-- Третий аргумент, который заменит "Values"
               )},
            headerFilter: "input",

             // Подсказка для пользователя внутри поля:
                headerFilterPlaceholder: "Enter condition…", 
    
        // Кастомная логика фильтрации:
        headerFilterFunc: function(headerValue, rowValue, rowData, filterParams) {
        // Если поле пустое — показываем все строки
        if (!headerValue) return true; 
        if (!rowValue) return false;

        const val = parseFloat(rowValue) || parseInt(rowValue);
        headerValue = headerValue.trim();

        // 1. Диапазон "МЕЖДУ" (через дефис, например: 2015-2025)
        if (headerValue.includes("-")) {
            const parts = headerValue.split("-");
            const min = parseFloat(parts[0]);
            const max = parseFloat(parts[1]);
            return val >= min && val <= max;
        }
        // 2. Больше или равно (>=10)
        if (headerValue.startsWith(">=")) {
            return val >= parseFloat(headerValue.replace(">=", ""));
        }
        // 3. Меньше или равно (<=5)
        if (headerValue.startsWith("<=")) {
            return val <= parseFloat(headerValue.replace("<=", ""));
        }
        // 4. Строго больше (>10)
        if (headerValue.startsWith(">")) {
            return val > parseFloat(headerValue.replace(">", ""));
        }
        // 5. Строго меньше (<5)
        if (headerValue.startsWith("<")) {
            return val < parseFloat(headerValue.replace("<", ""));
        }

        // Если просто ввели число — ищем совпадение (как раньше)
        return String(rowValue).toLowerCase().includes(String(headerValue).toLowerCase());
    }

            },

            {title:"Publisher Type", 
            field:"Publisher Type",
            width: "10%", 
            minWidth: 100,
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
                { value: "Government", desc: "Entities affiliated with government departments, including research institutes whose institutional functions involve policy regulation" },
                { value: "Organization", desc: "Non-governmental non-profit organizations" },
                { value: "Research Institution", desc: "Universities, research institutes or laboratories, that assume institutional responsibility for EA development and maintenance" },
                { value: "Private Sector", desc: "Commercial enterprises and profit-making organizations" },
                { value: "Volunteer Community", desc: "EAs developed and maintained primarily by volunteer contributors or open communities rather than by formally established organizations" },
                { value: "Individual", desc: "Individual or a small, informal group without institutional support" }
                ]);
            }, headerFilterPlaceholder: "Select value..."
        },            

            {title:"Publisher", 
            field:"Publisher",
            width: "13%", 
            minWidth: 100, 
            headerTooltip: function() {
            return createHeaderTooltip("Official name of the EA publisher. If published by a consortium, only the coordinating institution or the first few institutions are listed")},
            headerFilter: "input",
            headerFilterPlaceholder: "Enter keyword..."

        },

            {title:"Region of Publication", 
            field:"Region of Publication",
            width: "11%", 
            minWidth: 100,  
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
            }, headerFilterPlaceholder: "Select value..."
        },                 

            {title:"Place of Publication", 
            field:"Place of Publication",
            width: "10%", 
            minWidth: 100,  
            headerTooltip: function() {
            return createHeaderTooltip("Based on the location of the publisher’s headquarters. If no headquarters can be identified (e.g., for international organizations), the cell is left blank")},
            headerFilter: "input",
            headerFilterPlaceholder: "Enter keyword..."
        },

            {
                title:"International Publisher", 
                field:"International Publisher", 
                width: "9%", 
                minWidth: 100,
                headerFilter: "list",
                        headerFilterParams: { 
                            valuesLookup: "data", // Просканировать все данные для поиска уникальных строк
                            sort: "asc",          // Сортировать список по алфавиту
                            clearable: true
                        },
                headerTooltip: function() {
                return createHeaderTooltip("Publishing institution self-identifies as international")},  
                hozAlign:"center",
                formatter: tabulatorTickCrossCleanFormatter,
                headerFilterPlaceholder: "Select value..."
                },

            {title:"Type of App Developers", 
            field:"Type of App Developers",
            width: "11%", 
            minWidth: 100,  
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
                { value: "Research Institution", desc: "Universities, research institutes or laboratories, that assume institutional responsibility for EA development and maintenance" },
                { value: "Private Sector", desc: "Commercial enterprises and profit-making organizations" },
                { value: "Volunteer Community", desc: "Development is carried out by an open volunteer community, where anyone can contribute and no central research organization coordinates the project" },
                { value: "Individual", desc: "Application is developed primarily by a single individual or a small independent team" }
                ]);
            }, headerFilterPlaceholder: "Select value..."
        },                            
                            
            {title:"App Developers", 
            field:"App Developers",
            width: "12%", 
            minWidth: 100,  
            headerTooltip: function() {
                return createHeaderTooltip("Developers of the application or cartographic component. If the developer is not specified, the publishing entity is provided instead")}, 
            headerFilter: "input",
            headerFilterPlaceholder: "Enter keyword..."
        },
            
            {title:"Main Language", 
            field:"Main Language",
            width: "8%", 
            minWidth: 100, 
            headerTooltip: function() {
                return createHeaderTooltip("Primary interface language of the EA. The extent to which EA content is translated is not taken into account")},
            headerFilter: "list",
                        headerFilterParams: { 
                            valuesLookup: "data", // Просканировать все данные для поиска уникальных строк
                            sort: "asc",          // Сортировать список по алфавиту
                            clearable: true
                            },
                            headerFilterPlaceholder: "Select value..."
                        },

            {title:"Number of Languages", 
            field:"Number of Languages",
            width: "8%", 
            minWidth: 100, 
            headerTooltip: function() {
                return createHeaderTooltip("Number of the EA interface languages.The extent to which EA content is translated is not taken into account",
                 [
                "Use “-” to specify a range of values, e.g., 1–3" ,
                "Use the “>” operator for values strictly greater than, or “>=” for greater than or equal to, e.g., >=3",
                "Use the “<” operator for values strictly less than, or “<=” for less than or equal to, e.g., <=3",
                "Or enter an exact value, e.g., 3" 
                ],
                "Functionality" // <-- Третий аргумент, который заменит "Values"
               )},
            headerFilter: "input",

             // Подсказка для пользователя внутри поля:
                headerFilterPlaceholder: "Enter condition…", 
    
        // Кастомная логика фильтрации:
        headerFilterFunc: function(headerValue, rowValue, rowData, filterParams) {
        // Если поле пустое — показываем все строки
        if (!headerValue) return true; 
        if (!rowValue) return false;

        const val = parseFloat(rowValue) || parseInt(rowValue);
        headerValue = headerValue.trim();

        // 1. Диапазон "МЕЖДУ" (через дефис, например: 2015-2025)
        if (headerValue.includes("-")) {
            const parts = headerValue.split("-");
            const min = parseFloat(parts[0]);
            const max = parseFloat(parts[1]);
            return val >= min && val <= max;
        }
        // 2. Больше или равно (>=10)
        if (headerValue.startsWith(">=")) {
            return val >= parseFloat(headerValue.replace(">=", ""));
        }
        // 3. Меньше или равно (<=5)
        if (headerValue.startsWith("<=")) {
            return val <= parseFloat(headerValue.replace("<=", ""));
        }
        // 4. Строго больше (>10)
        if (headerValue.startsWith(">")) {
            return val > parseFloat(headerValue.replace(">", ""));
        }
        // 5. Строго меньше (<5)
        if (headerValue.startsWith("<")) {
            return val < parseFloat(headerValue.replace("<", ""));
        }

        // Если просто ввели число — ищем совпадение (как раньше)
        return String(rowValue).toLowerCase().includes(String(headerValue).toLowerCase());
    }

            },                                                   

            {
                title:"English", 
                field:"English", 
                width: "7%", 
                minWidth: 100,
                headerFilter: "list",
                        headerFilterParams: { 
                            valuesLookup: "data", // Просканировать все данные для поиска уникальных строк
                            sort: "asc",          // Сортировать список по алфавиту
                            clearable: true
                        },
                headerTooltip: function() {
                return createHeaderTooltip("Availability of an English localisation. The extent to which EA content is translated is not taken into account")}, 
                hozAlign:"center",
                formatter: tabulatorTickCrossCleanFormatter,
                headerFilterPlaceholder: "Select value..."
                },

            {title:"Project Type", 
            field:"Project Type",
            width: "8%", 
            minWidth: 100, 
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
            }, headerFilterPlaceholder: "Select value..."
        },                         

            {
                title:"Paper Version", 
                field:"Paper Version", 
                width: "8%", 
                minWidth: 100,
                headerFilter: "list",
                        headerFilterParams: { 
                            valuesLookup: "data", // Просканировать все данные для поиска уникальных строк
                            sort: "asc",          // Сортировать список по алфавиту
                            clearable: true
                        },
                headerTooltip: function() {
                return createHeaderTooltip("Availability of a paper atlas linked to the electronic version. It may be published before or after the EA release")}, 
                hozAlign:"center",
                formatter: tabulatorTickCrossCleanFormatter,
                headerFilterPlaceholder: "Select value..."
                },
                
            {title:"Distribution", 
            field:"Distribution",
            width: "8%", 
            minWidth: 100, 
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
            }, headerFilterPlaceholder: "Select value..."
        },                        
                            
            {title:"Access", 
            field:"Access",
            width: "8%", 
            minWidth: 100,  
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
            }, headerFilterPlaceholder: "Select value..."
        },                 
                            
            {title:"Technology Type", 
            field:"Technology Type",
            width: "10%", 
            minWidth: 100,  
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
            }, headerFilterPlaceholder: "Select value..."
        },                          
                            
            {title:"Technology", 
            field:"Technology",
            width: "10%", 
            minWidth: 100,  
            headerTooltip: function() {
                return createHeaderTooltip("Name of the technology used. Determined based on information from the developers, its visual appearance and the source code")},
            headerFilter: "input",
            headerFilterPlaceholder: "Enter keyword..."
        },
            
            {title:"Implementation Method", 
            field:"Implementation Method",
            width: "10%", 
            minWidth: 100, 
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
            }, headerFilterPlaceholder: "Select value..."
        },                       

            {
                title:"Mobile Devices", 
                field:"Mobile Devices", 
                width: "9%", 
                minWidth: 100,
                headerFilter: "list",
                        headerFilterParams: { 
                            valuesLookup: "data", // Просканировать все данные для поиска уникальных строк
                            sort: "asc",          // Сортировать список по алфавиту
                            clearable: true
                            },
            headerTooltip: function() {
                return createHeaderTooltip(
                "Ability to operate on mobile devices. The degree of interface adaptation is not taken into account",
                [
                { value: "None", desc: "EA does not open on mobile devices" },
                { value: "Limited", desc: "EA operates on mobile devices but is not adapted for convenient use" },
                { value: "Partial", desc: "Only part of the EA functionality is available on mobile devices" },
                { value: "Full", desc: "All functionality is retained on mobile devices" }
                ]);
            }, headerFilterPlaceholder: "Select value..."
        },      
            
            {title:"Date of Analysis", 
            field:"Date of Analysis",
            width: "9%", 
            minWidth: 100,  
            headerFilter: "input",
            headerFilterPlaceholder: "Enter keyword..."
        },

            {title:"URL", 
            field:"URL", 
            width: "10%", 
            minWidth: 100,
            headerFilter: "input",
            headerFilterPlaceholder: "Enter keyword..."
        }                                                                                             

        ];

            const TABLE_2_COLUMNS = [
            {
                title: "ID", 
                field: "id", 
                width: "7%", 
                minWidth: 100,  
                headerFilter: "list", 
                // Кастомная функция: преобразует значения в строки, чтобы избежать конфликта "число vs строка"
                headerFilterFunc: function(headerValue, rowValue, rowData, filterParams){
                    // Если ничего не выбрано, показываем строку
                    if(!headerValue || headerValue.length === 0) return true;
                    
                    // Переводим текущее значение ID строки в строку
                    const currentId = String(rowValue).trim();
                    
                    // Проверяем, есть ли текущий ID среди выбранных в массиве элементов
                    return headerValue.map(v => String(v).trim()).includes(currentId);
                },
                headerFilterPlaceholder: "Select multiple...",
                headerFilterParams: { 
                    valuesLookup: "data", 
                    sort: "asc",          
                    clearable: true,      
                    multiselect: true     
                }
            },
            {title:"Title", 
            field:"Title",
            width: "16%", 
            minWidth: 100,  
            cssClass: "title-column",
            frozen: true, 
            headerFilter: "input",
            formatter: function(cell, formatterParams, onRendered) {
        const data = cell.getRow().getData();
        const url = data.URL; 
        const name = cell.getValue();

        if (url) {
            // Убрали инлайн-стиль цвета, добавили класс table-link
            return `<a href="${url}" target="_blank" class="table-link">${name}</a>`;
        } else {
            return name;
        }},
        headerFilterPlaceholder: "Enter keyword..."
        },

            {title:"Status", 
            field:"Status",
            width: "7%", 
            minWidth: 100, 
            headerFilter: "list",
                        headerFilterParams: { 
                            valuesLookup: "data", // Просканировать все данные для поиска уникальных строк
                            sort: "asc",          // Сортировать список по алфавиту
                            clearable: true
                            },
                headerTooltip: function() {
                return createHeaderTooltip(
                "Current operational status of the EA, indicating whether it is actively maintained, archived, or no longer functional",
                [
                { value: "Active", desc: "EA is fully functional and is actively maintained and updated" },
                { value: "Archived", desc: "EA remains fully or partially functional but is no longer the current version and is no longer maintained or updated" },
                { value: "Inactive", desc: "EA has ceased to exist. A desktop application no longer runs on modern operating systems, or the website of an online atlas has been removed and is no longer accessible" },
                { value: "Replaced", desc: "Older version of the atlas that has been replaced by a newer version of the website, which remains active" }
                ]);
            }, headerFilterPlaceholder: "Select value..."
        },

            {title:"Content Type", 
            field:"Content Type",
            width: "9%", 
            minWidth: 100,   
            headerFilter: "list",
                        headerFilterParams: { 
                            valuesLookup: "data", // Просканировать все данные для поиска уникальных строк
                            sort: "asc",          // Сортировать список по алфавиту
                            clearable: true
                            },
            headerTooltip: function() {
                return createHeaderTooltip(
                "Each type implies specific requirements for both EA content and implementation. The type is recorded only if explicitly stated by the developers in the EA title or description",
                [{ value: "Thematic", desc: "Regular thematic EA" },
                { value: "Statistical", desc: "EA representing statistical data and typically complying with specific requirements (Schulz, 2014)" },
                { value: "National", desc: "Official national atlas, typically characterized by complex thematic coverage" }
                ]);
            }, headerFilterPlaceholder: "Select value..."
        },

            {title:"Thematic Coverage", 
            field:"Thematic Coverage",
            width: "9%", 
            minWidth: 100,  
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
            }, headerFilterPlaceholder: "Select value..."
        },

            {title:"Topic 1", 
            field:"Topic 1",
            width: "9%", 
            minWidth: 100,   
            headerFilter: "list",
                        headerFilterParams: { 
                            valuesLookup: "data", // Просканировать все данные для поиска уникальных строк
                            sort: "asc",          // Сортировать список по алфавиту
                            clearable: true
                            },
            headerTooltip: function() {
                return createHeaderTooltip(
                "Topics - generalized EA themes. The most common topics were selected. <br> <b>Topic 1 - main topic (80% of the content or more) or one of the main topics </b></br>",
                [{ value: "Economics and Trade", desc: "Economy, Trade, Finance, Agriculture, Industry, and Economic activity" },
                { value: "Environment", desc: "Ecology, Human–Environment interaction, and Environmental protection activities" },
                { value: "Healthcare", desc: "Healthcare, Public health, and Disease spread" },
                { value: "History", desc: "Historical atlases. History is commonly combined with other topics" },
                { value: "Human geography", desc: "Population Geography, Political Geography, Cultural Geography, and Social Geography" },
                { value: "Physical geography", desc: "Geomorphology, Hydrology, Climatology, etc." },
                { value: "Transport & Infrastructure", desc: "Transport, Communication Network, Technical Infrastructure (e.g., Water supply, Electricity etc.)" },
                { value: "Other", desc: "Media & Journalism, Literature, Sport, etc." }
                ]);
            }, headerFilterPlaceholder: "Select value..."
        },

             {title:"Topic 2", 
            field:"Topic 2",
            width: "9%", 
            minWidth: 100,   
            headerFilter: "list",
                        headerFilterParams: { 
                            valuesLookup: "data", // Просканировать все данные для поиска уникальных строк
                            sort: "asc",          // Сортировать список по алфавиту
                            clearable: true
                            },
            headerTooltip: function() {
                return createHeaderTooltip(
                "Topics - generalized EA themes. The most common topics were selected. <br> <b>Topic 2 - secondary or equally important topic </b></br>",
                [{ value: "Economics and Trade", desc: "Economy, Trade, Finance, Agriculture, Industry, and Economic activity" },
                { value: "Environment", desc: "Ecology, Human–Environment interaction, and Environmental protection activities" },
                { value: "Healthcare", desc: "Healthcare, Public health, and Disease spread" },
                { value: "History", desc: "Historical atlases. History is commonly combined with other topics" },
                { value: "Human geography", desc: "Population Geography, Political Geography, Cultural Geography, and Social Geography" },
                { value: "Physical geography", desc: "Geomorphology, Hydrology, Climatology, etc." },
                { value: "Transport & Infrastructure", desc: "Transport, Communication Network, Technical Infrastructure (e.g., Water supply, Electricity etc.)" },
                { value: "Other", desc: "Media & Journalism, Literature, Sport, etc." }
                ]);
            }, headerFilterPlaceholder: "Select value..."
        },

            {title:"Topic 3", 
            field:"Topic 3",
            width: "9%", 
            minWidth: 100,   
            headerFilter: "list",
                        headerFilterParams: { 
                            valuesLookup: "data", // Просканировать все данные для поиска уникальных строк
                            sort: "asc",          // Сортировать список по алфавиту
                            clearable: true
                            },
            headerTooltip: function() {
                return createHeaderTooltip(
                "Topics - generalized EA themes. The most common topics were selected. <br> <b>Topic 3 - third or equally important topic </b></br>",
                [{ value: "Economics and Trade", desc: "Economy, Trade, Finance, Agriculture, Industry, and Economic activity" },
                { value: "Environment", desc: "Ecology, Human–Environment interaction, and Environmental protection activities" },
                { value: "Healthcare", desc: "Healthcare, Public health, and Disease spread" },
                { value: "History", desc: "Historical atlases. History is commonly combined with other topics" },
                { value: "Human geography", desc: "Population Geography, Political Geography, Cultural Geography, and Social Geography" },
                { value: "Physical geography", desc: "Geomorphology, Hydrology, Climatology, etc." },
                { value: "Transport & Infrastructure", desc: "Transport, Communication Network, Technical Infrastructure (e.g., Water supply, Electricity etc.)" },
                { value: "Other", desc: "Media & Journalism, Literature, Sport, etc." }
                ]);
            }, headerFilterPlaceholder: "Select value..."
        },

            {title:"Theme", 
            field:"Theme",
            width: "11%", 
            minWidth: 100,   
            headerTooltip: function() {
                return createHeaderTooltip("Specific theme of the EA. It is usually narrower than a topic and may relate to multiple topics simultaneously. For complex EAs that characterise a territory across all major topics, the name of the territory should be specified")},
            headerFilter: "input",
            headerFilterPlaceholder: "Enter keyword..."
        },

            {title:"Spatial Ontology of Objects", 
            field:"Spatial Ontology of Objects",
            width: "11%", 
            minWidth: 100,   
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
                { value: "Fictional Objects & Phenomena of the Real World", desc: "Fictional objects and phenomena georeferenced to real-world geography" },
                { value: "Abstract Concepts", desc: "Abstract and non-material ideas and concepts" }
                ]);
            }, headerFilterPlaceholder: "Select value..."
        },

            {title:"Geospatial Reference", 
            field:"Geospatial Reference",
            width: "9%", 
            minWidth: 100, 
            headerFilter: "list",
                        headerFilterParams: { 
                            valuesLookup: "data", // Просканировать все данные для поиска уникальных строк
                            sort: "asc",          // Сортировать список по алфавиту
                            clearable: true
                            },  
            headerTooltip: function() {
                return createHeaderTooltip("Source data used to create the EA representations and visualizations are geospatially referenced")},
                hozAlign:"center",
                formatter: tabulatorTickCrossCleanFormatter,
                headerFilterPlaceholder: "Select value..."
            },

            {title:"Spatial Coverage", 
            field:"Spatial Coverage",
            width: "9%", 
            minWidth: 100,   
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
            }, headerFilterPlaceholder: "Select value..."
        },

            {title:"Region", 
            field:"Region",
            width: "10%", 
            minWidth: 100,   
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
            }, headerFilterPlaceholder: "Select value..."
        },

            {title:"Content Spatiality", 
            field:"Content Spatiality",
            width: "10%", 
            minWidth: 100,   
            headerFilter: "list",
                        headerFilterParams: { 
                            valuesLookup: "data", // Просканировать все данные для поиска уникальных строк
                            sort: "asc",          // Сортировать список по алфавиту
                            clearable: true
                            },
            headerTooltip: function() {
                return createHeaderTooltip(
                "Classification of EAs based on the combination of the Geospatial Reference attribute and the predominant form (unit) of content representation",
                [{ value: "Cartographic", desc: "Maps and map-like representations constitute the primary content of the EA and are based on geospatially referenced data" },
                { value: "Geospatial", desc: "Mixed georeferenced content predominates, which is neither cartographic nor graphical" },
                { value: "Spatial", desc: "Maps and spatial visualizations constitute the primary content of the EA but are based on non-spatial data ('non-geographic constructed spaces' (Kinberger, 2010))" },
                { value: "Graphical", desc: "Graphical content (e.g., charts and diagrams) predominates in the atlas. The geospatial reference of the underlying data is not taken into account" }
                ]);
            }, headerFilterPlaceholder: "Select value..."
        },

            {title:"Temporal Scope", 
            field:"Temporal scope",
            width: "10%", 
            minWidth: 100,   
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
            }, headerFilterPlaceholder: "Select value..."
        },

            {
                title:"AI-generated Content", 
                field:"AI-generated Content", 
                width: "9%", 
                minWidth: 100, 
                headerFilter: "list",
                        headerFilterParams: { 
                            valuesLookup: "data", // Просканировать все данные для поиска уникальных строк
                            sort: "asc",          // Сортировать список по алфавиту
                            clearable: true
                        },
                headerTooltip: function() {
                return createHeaderTooltip("Presence of any AI-generated content, regardless of its proportion")}, 
                hozAlign:"center",
                formatter: tabulatorTickCrossCleanFormatter,
                headerFilterPlaceholder: "Select value..."
                },

             {
                title:"Regular Updates", 
                field:"Regular Updates", 
                width: "9%", 
                minWidth: 100, 
                headerFilter: "list",
                        headerFilterParams: { 
                            valuesLookup: "data", // Просканировать все данные для поиска уникальных строк
                            sort: "asc",          // Сортировать список по алфавиту
                            clearable: true
                        },
                headerTooltip: function() {
                return createHeaderTooltip("EA content is continuously updated or planned for future updates")}, 
                hozAlign:"center",
                formatter: tabulatorTickCrossCleanFormatter,
                headerFilterPlaceholder: "Select value..."
                },

            {
                title:"Data Catalogue", 
                field:"Data Catalogue", 
                width: "9%", 
                minWidth: 100, 
                headerFilter: "list",
                        headerFilterParams: { 
                            valuesLookup: "data", // Просканировать все данные для поиска уникальных строк
                            sort: "asc",          // Сортировать список по алфавиту
                            clearable: true
                        },
                headerTooltip: function() {
                return createHeaderTooltip("Presence of a local data directory or data directory separated into a distinct section. The catalogue should be in the form of an attribute table or an interactive interface, and the data should be available for download")}, 
                hozAlign:"center",
                formatter: tabulatorTickCrossCleanFormatter,
                headerFilterPlaceholder: "Select value..."
                },

             {
                title:"Story-centred Content", 
                field:"Story-centred Content", 
                width: "9%", 
                minWidth: 100, 
                headerFilter: "list",
                        headerFilterParams: { 
                            valuesLookup: "data", // Просканировать все данные для поиска уникальных строк
                            sort: "asc",          // Сортировать список по алфавиту
                            clearable: true
                        },
                headerTooltip: function() {
                return createHeaderTooltip("All components of the EA serving to unfold or analyse (explicit) stories")}, 
                hozAlign:"center",
                formatter: tabulatorTickCrossCleanFormatter,
                headerFilterPlaceholder: "Select value..."
                }            
        ]; 

        const TABLE_3_COLUMNS = [
            {
                title: "ID", 
                field: "id", 
                width: "7%", 
                minWidth: 100, 
                headerFilter: "list", 
                // Кастомная функция: преобразует значения в строки, чтобы избежать конфликта "число vs строка"
                headerFilterFunc: function(headerValue, rowValue, rowData, filterParams){
                    // Если ничего не выбрано, показываем строку
                    if(!headerValue || headerValue.length === 0) return true;
                    
                    // Переводим текущее значение ID строки в строку
                    const currentId = String(rowValue).trim();
                    
                    // Проверяем, есть ли текущий ID среди выбранных в массиве элементов
                    return headerValue.map(v => String(v).trim()).includes(currentId);
                },
                headerFilterPlaceholder: "Select multiple...",
                headerFilterParams: { 
                    valuesLookup: "data", 
                    sort: "asc",          
                    clearable: true,      
                    multiselect: true     
                }
            },
            {title:"Title", 
            field:"Title",
            width: "16%", 
            minWidth: 100, 
            cssClass: "title-column",
            frozen: true, 
            headerFilter: "input",
            formatter: function(cell, formatterParams, onRendered) {
        const data = cell.getRow().getData();
        const url = data.URL; 
        const name = cell.getValue();

        if (url) {
            // Убрали инлайн-стиль цвета, добавили класс table-link
            return `<a href="${url}" target="_blank" class="table-link">${name}</a>`;
        } else {
            return name;
        }},
        headerFilterPlaceholder: "Enter keyword..."
        },

        {
                title:"General Information", cssClass: "column-general",
                columns:[

        {title:"Status", 
            field:"Status",
            cssClass: "column-general",
            width: "7%", 
            minWidth: 100,
            headerFilter: "list",
                        headerFilterParams: { 
                            valuesLookup: "data", // Просканировать все данные для поиска уникальных строк
                            sort: "asc",          // Сортировать список по алфавиту
                            clearable: true
                            },
                headerTooltip: function() {
                return createHeaderTooltip(
                "Current operational status of the EA, indicating whether it is actively maintained, archived, or no longer functional",
                [
                { value: "Active", desc: "EA is fully functional and is actively maintained and updated" },
                { value: "Archived", desc: "EA remains fully or partially functional but is no longer the current version and is no longer maintained or updated" },
                { value: "Inactive", desc: "EA has ceased to exist. A desktop application no longer runs on modern operating systems, or the website of an online atlas has been removed and is no longer accessible" },
                { value: "Replaced", desc: "Older version of the atlas that has been replaced by a newer version of the website, which remains active" }
                ]);
            }, headerFilterPlaceholder: "Select value..."
        },

        {title:"Metaconcept", 
            field:"Metaconcept",
            cssClass: "column-general",
            width: "10%", 
            minWidth: 100,  
            headerFilter: "list",
                        headerFilterParams: { 
                            valuesLookup: "data", // Просканировать все данные для поиска уникальных строк
                            sort: "asc",          // Сортировать список по алфавиту
                            clearable: true
                            },
            headerTooltip: function() {
                return createHeaderTooltip(
                "Name of the EA metaconcept. A metaconcept is defined by one or more characteristics or functions that, together with a specific implementation of the interface, navigation, content representation, and functionality, form the distinctive overall appearance of EAs and their usage style",
                [{ value: "Electronic reproduction", desc: "Websites or applications that reproduce the content and concept of paper atlases in a digital form" },
                { value: "Collection of maps/modules", desc: "Multi-page websites or applications in which maps or representation modules are presented on separate pages" },
                { value: "Cartographic atlas application", desc: "Single-page or pseudo-single-page applications with a single map-based interface. Their purpose is to visually explore territories and themes through maps with a focus on traditional cartographic principles" },
                { value: "Visualization atlas", desc: "Multi-page websites or single-page applications “aimed at explaining and supporting exploration of data about a dedicated topic through data, visualisations and narration” (Wang et al., 2025, p. 437)" },
                { value: "Narrative atlas", desc: "Websites or applications that tell spatially referenced stories or systematically present themes in a story format" },
                { value: "Encyclopedia", desc: "Multi-page websites composed of a collection of articles or profiles" },
                { value: "Organizational mechanism", desc: "Websites or applications that organise and link heterogeneous content through a centralised map interface" },
                { value: "Geoportal", desc: "Collections of tools and services designed for the rapid search, viewing, download, and management of geospatial (meta)data" },
                { value: "Map viewer", desc: "Single-page applications with a single map-based interface designed for user-driven search, viewing, and combining layers to “produce maps”" }
                ]);
            }, headerFilterPlaceholder: "Select value..."
        },

            {title:"Metaconcept Type", 
            field:"Metaconcept Type",
            cssClass: "column-general",
            width: "10%", 
            minWidth: 100,  
            headerFilter: "list",
                        headerFilterParams: { 
                            valuesLookup: "data", // Просканировать все данные для поиска уникальных строк
                            sort: "asc",          // Сортировать список по алфавиту
                            clearable: true
                            },
            headerTooltip: function() {
                return createHeaderTooltip(
                "Type of the EA within a specific metaconcept",
                [{ value: "Facsimile", desc: "Display digitised pages of paper atlases within a multimedia shell" },
                { value: "Static HTML", desc: "Collection of static HTML pages whose layout and structure replicate paper atlases. The content is presented in the form of articles, where the map often occupies only a small portion of the space" },
                { value: "Set of Maps", desc: "Mechanical collection of non-coherent maps that share only a common theme " },
                { value: "Compilation of Maps", desc: "Feature a coherent map language and visual design, with their content presented as a series of maps or modules" },
                { value: "Combination of Maps", desc: "Emphasises close connectivity between maps or modules, achieved through network organisation and/or contextual navigation" },
                { value: "Data Visualizer", desc: "Encompass single-page applications, where maps and interactive visualisations are the primary types of data visualisation. The availability of attribute data tables, charts and/or diagrams, and data sorting and filtering functionality is critical " },
                { value: "Compendium of Vis. Modules", desc: "Multi-page websites or applications that consist of a multitude of visualisation modules in which maps are not the dominant visualisation type. Each module has a nonlinear navigation metamodel and interactive content" },
                { value: "Collection of Profiles", desc: "Multi-page websites composed of profiles or reports (Wang et al., 2025). All profiles are uniform in terms of layout, structure, and content representation. They repeatedly characterise different territories according to fixed indicators. Each profile is structured as a sequence of diagrams, tables, and other interactive visualisations" },
                { value: "Collection of Articles", desc: "Multi-page websites where separate articles serve as the primary type of representation. Maps and other media are embedded" },
                { value: "Storypedia", desc: "Multi-page applications that feature a sequential scroller-based structure to explore each theme through a combination of text with maps or infographics. Storypaedias are distinguished by their embedded layout, the non-mandatory presence of maps, longform page presentation, and storytelling techniques" },
                { value: "Directory", desc: "Websites designed for browsing a hierarchy, searching, and retrieving metadata or summary information about objects or phenomena of a given class (i.e., instances of the EA’s primary object). The retrieved objects are characterised by profiles with brief technical descriptions, classification tables, and maps used solely for localisation" }
                ]);
            }, headerFilterPlaceholder: "Select value..."
        },

            {title:"Metaconcept 2", 
            field:"Metaconcept 2",
            cssClass: "column-general",
            width: "10%", 
            minWidth: 100,  
            headerFilter: "list",
                        headerFilterParams: { 
                            valuesLookup: "data", // Просканировать все данные для поиска уникальных строк
                            sort: "asc",          // Сортировать список по алфавиту
                            clearable: true
                            },
            headerTooltip: function() {
                return createHeaderTooltip(
                "Name of the second metaconcept. The second metaconcept can be identified within multi-page EAs comprising various sections",
                [{ value: "Electronic reproduction", desc: "Websites or applications that reproduce the content and concept of paper atlases in a digital form" },
                { value: "Collection of maps/modules", desc: "Multi-page websites or applications in which maps or representation modules are presented on separate pages" },
                { value: "Cartographic atlas application", desc: "Single-page or pseudo-single-page applications with a single map-based interface. Their purpose is to visually explore territories and themes through maps with a focus on traditional cartographic principles" },
                { value: "Visualization atlas", desc: "Multi-page websites or single-page applications “aimed at explaining and supporting exploration of data about a dedicated topic through data, visualisations and narration” (Wang et al., 2025, p. 437)" },
                { value: "Narrative atlas", desc: "Websites or applications that tell spatially referenced stories or systematically present themes in a story format" },
                { value: "Encyclopedia", desc: "Multi-page websites composed of a collection of articles or profiles" },
                { value: "Organizational mechanism", desc: "Websites or applications that organise and link heterogeneous content through a centralised map interface" },
                { value: "Geoportal", desc: "Collections of tools and services designed for the rapid search, viewing, download, and management of geospatial (meta)data" },
                { value: "Map viewer", desc: "Single-page applications with a single map-based interface designed for user-driven search, viewing, and combining layers to “produce maps”" }
                ]);
            }, headerFilterPlaceholder: "Select value..."
        },

             {title:"Metaconcept 2 Type", 
            field:"Metaconcept 2 Type",
            cssClass: "column-general",
            width: "10%", 
            minWidth: 100,  
            headerFilter: "list",
                        headerFilterParams: { 
                            valuesLookup: "data", // Просканировать все данные для поиска уникальных строк
                            sort: "asc",          // Сортировать список по алфавиту
                            clearable: true
                            },
            headerTooltip: function() {
                return createHeaderTooltip(
                "Type of the EA within the second metaconcept",
                [{ value: "Facsimile", desc: "Display digitised pages of paper atlases within a multimedia shell" },
                { value: "Static HTML", desc: "Collection of static HTML pages whose layout and structure replicate paper atlases. The content is presented in the form of articles, where the map often occupies only a small portion of the space" },
                { value: "Set of Maps", desc: "Mechanical collection of non-coherent maps that share only a common theme " },
                { value: "Compilation of Maps", desc: "Feature a coherent map language and visual design, with their content presented as a series of maps or modules" },
                { value: "Combination of Maps", desc: "Emphasises close connectivity between maps or modules, achieved through network organisation and/or contextual navigation" },
                { value: "Data Visualizer", desc: "Encompass single-page applications, where maps and interactive visualisations are the primary types of data visualisation. The availability of attribute data tables, charts and/or diagrams, and data sorting and filtering functionality is critical " },
                { value: "Compendium of Vis. Modules", desc: "Multi-page websites or applications that consist of a multitude of visualisation modules in which maps are not the dominant visualisation type. Each module has a nonlinear navigation metamodel and interactive content" },
                { value: "Collection of Profiles", desc: "Multi-page websites composed of profiles or reports (Wang et al., 2025). All profiles are uniform in terms of layout, structure, and content representation. They repeatedly characterise different territories according to fixed indicators. Each profile is structured as a sequence of diagrams, tables, and other interactive visualisations" },
                { value: "Collection of Articles", desc: "Multi-page websites where separate articles serve as the primary type of representation. Maps and other media are embedded" },
                { value: "Storypedia", desc: "Multi-page applications that feature a sequential scroller-based structure to explore each theme through a combination of text with maps or infographics. Storypaedias are distinguished by their embedded layout, the non-mandatory presence of maps, longform page presentation, and storytelling techniques" },
                { value: "Directory", desc: "Websites designed for browsing a hierarchy, searching, and retrieving metadata or summary information about objects or phenomena of a given class (i.e., instances of the EA’s primary object). The retrieved objects are characterised by profiles with brief technical descriptions, classification tables, and maps used solely for localisation" }
                ]);
            }, headerFilterPlaceholder: "Select value..."
        },

            {title:"Method of Page Presentation", 
            field:"Method of Page Presentation",
            cssClass: "column-general",
            width: "11%", 
            minWidth: 100,  
            headerFilter: "list",
                        headerFilterParams: { 
                            valuesLookup: "data", // Просканировать все данные для поиска уникальных строк
                            sort: "asc",          // Сортировать список по алфавиту
                            clearable: true
                            },
            headerTooltip: function() {
                return createHeaderTooltip(
                "Number and types of screens and pages used to present all sections of the EA",
                [{ value: "Single-page", desc: "EAs consist of a single screen and function on a single webpage, which does not reload during the entire session" },
                { value: "Pseudo-single-page", desc: "EAs may comprise multiple screens and pages; however, EAs still display the core thematic content within a single screen. In addition, single-screen EAs whose pages reload" },
                { value: "Multi-page", desc: "Multi-page EAs distribute content across distinct pages, a characteristic they share with paper atlases" }
                ]);
            }, headerFilterPlaceholder: "Select value..."
        },

            {title:"Map-Vis Section Implementation", 
            field:"Map-Vis Section Implementation",
            cssClass: "column-general",
            width: "11%", 
            minWidth: 100,  
            headerFilter: "list",
                        headerFilterParams: { 
                            valuesLookup: "data", // Просканировать все данные для поиска уникальных строк
                            sort: "asc",          // Сортировать список по алфавиту
                            clearable: true
                            },
            headerTooltip: function() {
                return createHeaderTooltip(
                "Classification of EAs by the composition of non-cartographic and map-based/visualisation sections",
                [{ value: "Map-Vis Section", desc: "EA consists of a single map-based or visualisation interface, or a set of uniform pages containing maps, map modules, or visualisations" },
                { value: "Several Map-Vis Sections", desc: "EA consists of multiple map-based/visualisation interfaces (screens)" },
                { value: "Non-Map Sections", desc: "EA consists of pages in which maps or visualisations are not the dominant type of representation (embedded map layout only)" },
                { value: "Non-Map Sections+One Map-Vis Section", desc: "EA combines pages in which maps or visualisations are not the dominant type of representation with a single map-based/visualisation section" },
                { value: "Non-Map Sections+Several Map-Vis Sections", desc: "EA combines pages in which maps or visualisations are not the dominant type of representation with multiple map-based/visualisation sections" }
                ]);
            }, headerFilterPlaceholder: "Select value..."
        },

            {title:"Atlas Focus", 
            field:"Atlas Focus",
            cssClass: "column-general",
            width: "8%", 
            minWidth: 100,  
            headerFilter: "list",
                        headerFilterParams: { 
                            valuesLookup: "data", // Просканировать все данные для поиска уникальных строк
                            sort: "asc",          // Сортировать список по алфавиту
                            clearable: true
                            },
            headerTooltip: function() {
                return createHeaderTooltip(
                "Central focus of the EA, which influences the design of all other components",
                [{ value: "Data", desc: "Data analysis and/or the provision of statistical information are central to the EA. Maps and visualisations serve an instrumental role by simplifying the understanding of key patterns in data distribution or acting as an interface to the data and supplementary visualisations" },
                { value: "Theme", desc: "EA is focused on representation and on complex thematic plots, emphasizing the explanation of facts, memorable visual imagery, storytelling, a synthesis of topography and thematic content, and multimedia. Attribute information plays a supporting role" }
                ]);
            }, headerFilterPlaceholder: "Select value..."
        },

            {title:"Usage style", 
            field:"Usage style",
            cssClass: "column-general",
            width: "10%", 
            minWidth: 100,  
            headerFilter: "list",
                        headerFilterParams: { 
                            valuesLookup: "data", // Просканировать все данные для поиска уникальных строк
                            sort: "asc",          // Сортировать список по алфавиту
                            clearable: true
                            },
            headerTooltip: function() {
                return createHeaderTooltip(
                "Characteristic manner by which the EA is intended to be employed, reflecting patterns of interaction",
                [{ value: "Reading & Localization", desc: "EA is designed for gradual reading of the content. Maps are not the primary type of representation and are generally used to localize phenomena described in the text or story. The interactivity of the content is low" },
                { value: "Viewing & Comparison", desc: "Spatial component (maps) is the main focus. EAs of this type are designed for the visual analysis and comparison of maps and geovisualisations without advanced interactive functions" },
                { value: "Interaction & Analysis", desc: "These EAs involve more active user participation in manipulating the content by selecting attributes, applying filters, and changing the symbolisation" }
                ]);
            }, headerFilterPlaceholder: "Select value..."
        },

            {title:"Target Audience", 
            field:"Target Audience",
            cssClass: "column-general",
            width: "10%", 
            minWidth: 100,  
            headerFilter: "list",
                        headerFilterParams: { 
                            valuesLookup: "data", // Просканировать все данные для поиска уникальных строк
                            sort: "asc",          // Сортировать список по алфавиту
                            clearable: true
                            },
            headerTooltip: function() {
                return createHeaderTooltip(
                "Determined according to the maximum functionality provided, as each EA may potentially target multiple user groups. Thematic complexity is assessed based on the complexity of the theme, the terminology used, and the depth of thematic coverage",
                [{ value: "General Public", desc: "Users without specialized knowledge" },
                { value: "GIS-literate Amateurs", desc: "Users possessing GIS skills or basic GIS literacy" },
                { value: "Domain Specialists", desc: "Specialists in the thematic domain without substantial GIS knowledge" },
                { value: "Domain Specialists with GIS Skills", desc: "Specialists in the thematic domain with advanced GIS skills" }
                ]);
            }, headerFilterPlaceholder: "Select value..."
        },

            {title:"Inclusiveness", 
            field:"Inclusiveness",
            cssClass: "column-general",
            width: "8%", 
            minWidth: 100,  
            headerFilter: "list",
                        headerFilterParams: { 
                            valuesLookup: "data", // Просканировать все данные для поиска уникальных строк
                            sort: "asc",          // Сортировать список по алфавиту
                            clearable: true
                            },
            headerTooltip: function() {
                return createHeaderTooltip(
                "Degree of support for users with disabilities",
                [{ value: "None", desc: "EA does not provide inclusive support options" },
                { value: "Partial", desc: "EA includes certain inclusive options" },
                { value: "Full", desc: "EA supports users with visual impairments and physical disabilities" }
                ]);
            }, headerFilterPlaceholder: "Select value..."
        },

            {title:"User Guidance", 
            field:"User Guidance",
            cssClass: "column-general",
            width: "9%", 
            minWidth: 100,  
            headerFilter: "list",
                        headerFilterParams: { 
                            valuesLookup: "data", // Просканировать все данные для поиска уникальных строк
                            sort: "asc",          // Сортировать список по алфавиту
                            clearable: true
                            },
            headerTooltip: function() {
                return createHeaderTooltip(
                "Availability of materials and tools that help users learn how to use the EA. EA descriptions and methodological materials are not counted",
                [{ value: "None", desc: "No help or guidance materials" },
                { value: "Help Document", desc: "Help in the form of a separate article or document, which may contain illustrations" },
                { value: "Video Tutorials", desc: "One or a series of instructional videos" },
                { value: "Guided Tour", desc: "Interactive introduction to the interface and its main functions" },
                { value: "Hybrid", desc: "Combination of two or more help and guidance methods" }
                ]);
            }, headerFilterPlaceholder: "Select value..."
        },
            ],},

            {
                title:"Іnterface", cssClass: "column-interface",
                columns:[

            {
                title:"Interface Responsiveness", 
                field:"Interface Responsiveness",
                cssClass: "column-interface",
                width: "10%", 
                minWidth: 100,  
                headerFilter: "list",
                        headerFilterParams: { 
                            valuesLookup: "data", // Просканировать все данные для поиска уникальных строк
                            sort: "asc",          // Сортировать список по алфавиту
                            clearable: true
                        },
                headerTooltip: function() {
                return createHeaderTooltip(
                "Adaptation of the EA interface to mobile devices and various screen sizes",
                [{ value: "None", desc: "Not adapted for convenient use" },
                { value: "Partial", desc: "Some interface elements or pages are adapted, but the layout remains inconvenient on certain screens or sections" },
                { value: "Full", desc: "Layout and interface elements are fully adapted for mobile devices, providing a convenient user experience across screen sizes" }
                ]);
            }, headerFilterPlaceholder: "Select value..."
        },

            {
                title:"Layout Template", 
                field:"Layout Template",
                cssClass: "column-interface", 
                width: "9%", 
                minWidth: 100,
                headerFilter: "list",
                        headerFilterParams: { 
                            valuesLookup: "data", // Просканировать все данные для поиска уникальных строк
                            sort: "asc",          // Сортировать список по алфавиту
                            clearable: true
                        },
                headerTooltip: function() {
                return createHeaderTooltip("Thematic content is presented in a single, uniform (template-based) screen")}, 
                hozAlign:"center",
                formatter: tabulatorTickCrossCleanFormatter,
                headerFilterPlaceholder: "Select value..."
                },

                {
                title:"Layout Pattern (Atlas Level)", 
                field:"Layout Pattern (Atlas Level)",
                cssClass: "column-interface",
                width: "11%", 
                minWidth: 100,  
                headerFilter: "list",
                        headerFilterParams: { 
                            valuesLookup: "data", // Просканировать все данные для поиска уникальных строк
                            sort: "asc",          // Сортировать список по алфавиту
                            clearable: true
                        },
                headerTooltip: function() {
                return createHeaderTooltip(
                "Layout pattern for thematic content",
                [{ value: "No map", desc: "EA or non-cartographic section does not contain maps" },
                { value: "Fullmap", desc: "Map fills the entire screen" },
                { value: "Fragmented fixed", desc: "Screen is divided into frames/windows containing different content. The boundaries between the areas are clearly defined" },
                { value: "Fragmented floating", desc: "Screen is divided into frames/windows. The boundaries of the areas are blurred" },
                { value: "Embedded map", desc: "Map is embedded in the page. It does not dominate the interface, and its functionality is limited" }
                ]);
               }, headerFilterPlaceholder: "Select value..."
        },

                {
                title:"Layout Pattern (Map-Vis Level)", 
                field:"Layout Pattern (Map-Vis Level)",
                cssClass: "column-interface",
                width: "11%", 
                minWidth: 100,  
                headerFilter: "list",
                        headerFilterParams: { 
                            valuesLookup: "data", // Просканировать все данные для поиска уникальных строк
                            sort: "asc",          // Сортировать список по алфавиту
                            clearable: true
                        },
                headerTooltip: function() {
                return createHeaderTooltip(
                "Layout pattern for a separate map-based/visualisation section (if available)",
                [{ value: "Fullmap", desc: "Map fills the entire screen" },
                { value: "Fragmented fixed", desc: "Screen is divided into frames/windows containing different content. The boundaries between the areas are clearly defined" },
                { value: "Fragmented floating", desc: "Screen is divided into frames/windows. The boundaries of the areas are blurred" },
                { value: "Embedded map", desc: "Map is embedded in the page. It does not dominate the interface, and its functionality is limited" }
                ]);
                }, headerFilterPlaceholder: "Select value..."
        },

                {
                title:"Map Area Ratio (Atlas Level)", 
                field:"Map Area Ratio (Atlas Level)",
                cssClass: "column-interface",
                width: "11%", 
                minWidth: 100,  
                headerFilter: "list",
                        headerFilterParams: { 
                            valuesLookup: "data", // Просканировать все данные для поиска уникальных строк
                            sort: "asc",          // Сортировать список по алфавиту
                            clearable: true
                        },
                headerTooltip: function() {
                return createHeaderTooltip(
                "Proportion of screen space occupied by the map in thematic sections",
                [{ value: "No map", desc: "EA or non-cartographic section does not contain maps" },
                { value: "Low", desc: "Map occupies less than 40% of the screen" },
                { value: "Moderate", desc: "Map occupies 40-60% of the screen" },
                { value: "Substantial", desc: "Map occupies 61-90% of the screen" },
                { value: "Full", desc: "Map occupies more than 90% of the screen" }
                ]);
                }, headerFilterPlaceholder: "Select value..."
        },

                {
                title:"Map Area Ratio (Map-Vis Level)", 
                field:"Map Area Ratio (Map-Vis Level)",
                cssClass: "column-interface",
                width: "11%", 
                minWidth: 100,  
                headerFilter: "list",
                        headerFilterParams: { 
                            valuesLookup: "data", // Просканировать все данные для поиска уникальных строк
                            sort: "asc",          // Сортировать список по алфавиту
                            clearable: true
                        },
                headerTooltip: function() {
                return createHeaderTooltip(
                "Proportion of screen space occupied by the map in separate map-based/visualisation section (if available)",
                [ { value: "Low", desc: "Map occupies less than 40% of the screen" },
                { value: "Moderate", desc: "Map occupies 40-60% of the screen" },
                { value: "Substantial", desc: "Map occupies 61-90% of the screen" },
                { value: "Full", desc: "Map occupies more than 90% of the screen" }
                ]);
                }, headerFilterPlaceholder: "Select value..."
        },

                {
                title:"Layout Flexibility", 
                field:"Layout Flexibility",
                cssClass: "column-interface",
                width: "9%", 
                minWidth: 100,  
                headerFilter: "list",
                        headerFilterParams: { 
                            valuesLookup: "data", // Просканировать все данные для поиска уникальных строк
                            sort: "asc",          // Сортировать список по алфавиту
                            clearable: true
                        },
                headerTooltip: function() {
                return createHeaderTooltip(
                "Level of layout customisation available. Determined by the Map-Vis section (based on the maximum implementation)",
                [ { value: "None", desc: "No layout options" },
                { value: "Basic", desc: "Expansion/collapse of panels, sidebars, and windows" },
                { value: "Intermediate", desc: "At least some interface elements — primarily information panels, legend windows, or tables — can be moved and resized" },
                { value: "Advanced", desc: "Full layout recomposition is possible, including moving and locking all interface elements, as well as adding or removing windows" },
                { value: "Full", desc: "Every interface element can be customized" }
                ]);
                }, headerFilterPlaceholder: "Select value..."
        },

                {
                title:"Thematic Design", 
                field:"Thematic Design",
                cssClass: "column-interface",
                width: "9%", 
                minWidth: 100,  
                headerFilter: "list",
                        headerFilterParams: { 
                            valuesLookup: "data", // Просканировать все данные для поиска уникальных строк
                            sort: "asc",          // Сортировать список по алфавиту
                            clearable: true
                        },
                headerTooltip: function() {
                return createHeaderTooltip(
                "Degree to which the interface design corresponds to the EA theme",
                [ { value: "None", desc: "No thematic design" },
                { value: "Partial", desc: "Color palette, header, and background elements are adapted to the EA theme" },
                { value: "Full", desc: "Specially designed interface with thematic stylization applied to most interface elements" }
                ]);
                }, headerFilterPlaceholder: "Select value..."
        },
                ],
            },

            {
                title:"Information Architecture & Navigation", cssClass: "column-navigation",
                columns:[

                {
                title:"Main Information Unit", 
                field:"Main Information Unit",
                cssClass: "column-navigation",
                width: "10%", 
                minWidth: 100, 
                headerFilter: "list",
                        headerFilterParams: { 
                            valuesLookup: "data", // Просканировать все данные для поиска уникальных строк
                            sort: "asc",          // Сортировать список по алфавиту
                            clearable: true
                        },
                headerTooltip: function() {
                return createHeaderTooltip(
                "Information unit used to represent the primary EA representation type ",
                [ { value: "Layer/Indicator", desc: "Single-page interface in which information is organized into separate analytical layers/indicators" },
                { value: "Map-Vis", desc: "Single-page interface presenting ready-made maps/visualizations, or a multi-page atlas in which all thematic pages are occupied by ready-made maps/visualizations" },
                { value: "Page", desc: "EA consists of multiple pages with diverse content" }
                ]);
                }, headerFilterPlaceholder: "Select value..."
        },

                {
                title:"Number of Content Pages", 
                field:"Number of Content Pages",
                cssClass: "column-navigation",
                width: "10%", 
                minWidth: 100,  
                headerTooltip: function() {
            return createHeaderTooltip(
            "Navigational and landing or introductory pages are not included",
              [
                "Use “-” to specify a range of values, e.g., 1–3" ,
                "Use the “>” operator for values strictly greater than, or “>=” for greater than or equal to, e.g., >=3",
                "Use the “<” operator for values strictly less than, or “<=” for less than or equal to, e.g., <=3",
                "Or enter an exact value, e.g., 3" 
                ],
                "Functionality" // <-- Третий аргумент, который заменит "Values"
               )},
            headerFilter: "input",

             // Подсказка для пользователя внутри поля:
                headerFilterPlaceholder: "Enter condition…", 
    
        // Кастомная логика фильтрации:
        headerFilterFunc: function(headerValue, rowValue, rowData, filterParams) {
        // Если поле пустое — показываем все строки
        if (!headerValue) return true; 
        if (!rowValue) return false;

        const val = parseFloat(rowValue) || parseInt(rowValue);
        headerValue = headerValue.trim();

        // 1. Диапазон "МЕЖДУ" (через дефис, например: 2015-2025)
        if (headerValue.includes("-")) {
            const parts = headerValue.split("-");
            const min = parseFloat(parts[0]);
            const max = parseFloat(parts[1]);
            return val >= min && val <= max;
        }
        // 2. Больше или равно (>=10)
        if (headerValue.startsWith(">=")) {
            return val >= parseFloat(headerValue.replace(">=", ""));
        }
        // 3. Меньше или равно (<=5)
        if (headerValue.startsWith("<=")) {
            return val <= parseFloat(headerValue.replace("<=", ""));
        }
        // 4. Строго больше (>10)
        if (headerValue.startsWith(">")) {
            return val > parseFloat(headerValue.replace(">", ""));
        }
        // 5. Строго меньше (<5)
        if (headerValue.startsWith("<")) {
            return val < parseFloat(headerValue.replace("<", ""));
        }

        // Если просто ввели число — ищем совпадение (как раньше)
        return String(rowValue).toLowerCase().includes(String(headerValue).toLowerCase());
    }

            },

                {
                title:"Content Hierarchy (Atlas Level)", 
                field:"Content Hierarchy (Atlas Level)",
                cssClass: "column-navigation",
                width: "11%", 
                minWidth: 100,  
                headerFilter: "list",
                        headerFilterParams: { 
                            valuesLookup: "data", // Просканировать все данные для поиска уникальных строк
                            sort: "asc",          // Сортировать список по алфавиту
                            clearable: true
                        },
                headerTooltip: function() {
                return createHeaderTooltip(
                "Depth of the information architecture of the thematic content (number of hierarchical levels). <br> <b>Counted from the homepage </b></br> ",
                [ { value: "Shallow", desc: "1-2 levels" },
                { value: "Deep", desc: "More than 2 levels" }
                ]);
                }, headerFilterPlaceholder: "Select value..."
        },

                {
                title:"Content Hierarchy (Map-Vis Level)", 
                field:"Content Hierarchy (Map-Vis Level)",
                cssClass: "column-navigation",
                width: "11%", 
                minWidth: 100,  
                headerFilter: "list",
                        headerFilterParams: { 
                            valuesLookup: "data", // Просканировать все данные для поиска уникальных строк
                            sort: "asc",          // Сортировать список по алфавиту
                            clearable: true
                        },
                headerTooltip: function() {
                return createHeaderTooltip(
                "Depth of the information architecture of the thematic content (number of hierarchical levels). <br> <b> Counted by the map/visualisation section (if available) </b> </br> ",
                [ { value: "Shallow", desc: "1-2 levels" },
                { value: "Deep", desc: "More than 2 levels" }
                ]);
                }, headerFilterPlaceholder: "Select value..."
        },

                {
                title:"Content Classifications", 
                field:"Content Classifications",
                cssClass: "column-navigation",
                width: "11%", 
                minWidth: 100,  
                headerFilter: "list",
                        headerFilterParams: { 
                            valuesLookup: "data", // Просканировать все данные для поиска уникальных строк
                            sort: "asc",          // Сортировать список по алфавиту
                            clearable: true
                        },
                headerTooltip: function() {
                return createHeaderTooltip(
                "Number of supported content classifications. Map or Content Index are not counted ",
                [ { value: "One Classification", desc: "Only one content classification is used" },
                { value: "One Classification+Filter", desc: "One content classification supplemented with sorting and/or filtering functions" },
                { value: "Several Classifications", desc: "Multiple classification for organizing the same content are used" },
                { value: "Several Classifications+Filter", desc: "Multiple content classifications supplemented with sorting and/or filtering functions" }
                ]);
                }, headerFilterPlaceholder: "Select value..."
        },

                {
                title:"Subjective Organisation Scheme", 
                field:"Subjective Organisation Scheme",
                cssClass: "column-navigation", 
                width: "9%", 
                minWidth: 100,
                headerFilter: "list",
                        headerFilterParams: { 
                            valuesLookup: "data", // Просканировать все данные для поиска уникальных строк
                            sort: "asc",          // Сортировать список по алфавиту
                            clearable: true
                        },
                headerTooltip: function() {
                return createHeaderTooltip("Thematic content is classified according to subjective criteria (Rosenfeld et al., 2015). An objective scheme is based on alphabetical order or geographical area")}, 
                hozAlign:"center",
                formatter: tabulatorTickCrossCleanFormatter,
                headerFilterPlaceholder: "Select value..."
                },

                {
                title:"Organisational Structure (Atlas Level)", 
                field:"Organisational Structure (Atlas Level)",
                cssClass: "column-navigation",
                width: "11%", 
                minWidth: 100,  
                headerFilter: "list",
                        headerFilterParams: { 
                            valuesLookup: "data", // Просканировать все данные для поиска уникальных строк
                            sort: "asc",          // Сортировать список по алфавиту
                            clearable: true
                        },
                headerTooltip: function() {
                return createHeaderTooltip(
                "Defines the method of organization and relationships between the main information units of the EA. <br> <b>Counted from the homepage </b></br>",
                [ { value: "Sequential", desc: "Content unfolds step-by-step, with each subsequent topic building upon the previous one" },
                { value: "Horizontal", desc: "All content elements are placed at the one hierarchical level (no hierarchy)" },
                { value: "Hub & Spoke", desc: "Several independent sequential nodes extend from a common center (hub), usually represented by the homepage" },
                { value: "Hierarchical", desc: "Content is divided into several hierarchical nodes with parent–child relationships" },
                { value: "Polyhierarchical", desc: "Type of hierarchical structure in which one node may have multiple parent nodes, allowing it to simultaneously belong to several sections/subsections" },
                { value: "Matrix", desc: "Connections between nodes are organized along at least two dimensions. Suitable for representing parallel narratives" },
                { value: "Network", desc: "Set of interconnected nodes without fixed levels or sequence. Each node may have any number of connections" },
                { value: "Hybrid", desc: "Combination of several organizational structures in which identifying a primary structure is not achievable" }
                ]);
                }, headerFilterPlaceholder: "Select value..."
        },

                {
                title:"Organisational Structure (Map-Vis Level)", 
                field:"Organisational Structure (Map-Vis Level)",
                cssClass: "column-navigation",
                width: "11%", 
                minWidth: 100,  
                headerFilter: "list",
                        headerFilterParams: { 
                            valuesLookup: "data", // Просканировать все данные для поиска уникальных строк
                            sort: "asc",          // Сортировать список по алфавиту
                            clearable: true
                        },
                headerTooltip: function() {
                return createHeaderTooltip(
                "Defines the method of organization and relationships between the main information units of the EA. <br> <b> Counted by the map/visualisation section (if available) </b> </br>",
                [ { value: "Sequential", desc: "Content unfolds step-by-step, with each subsequent topic building upon the previous one" },
                { value: "Horizontal", desc: "All content elements are placed at the one hierarchical level (no hierarchy)" },
                { value: "Hub & Spoke", desc: "Several independent sequential nodes extend from a common center (hub), usually represented by the homepage" },
                { value: "Hierarchical", desc: "Content is divided into several hierarchical nodes with parent–child relationships" },
                { value: "Polyhierarchical", desc: "Type of hierarchical structure in which one node may have multiple parent nodes, allowing it to simultaneously belong to several sections/subsections" },
                { value: "Matrix", desc: "Connections between nodes are organized along at least two dimensions. Suitable for representing parallel narratives" },
                { value: "Network", desc: "Set of interconnected nodes without fixed levels or sequence. Each node may have any number of connections" },
                { value: "Hybrid", desc: "Combination of several organizational structures in which identifying a primary structure is not achievable" }
                ]);
                }, headerFilterPlaceholder: "Select value..."
        },

                {
                title:"Navigation Metamodel", 
                field:"Navigation Metamodel",
                cssClass: "column-navigation",
                width: "10%", 
                minWidth: 100,  
                headerFilter: "list",
                        headerFilterParams: { 
                            valuesLookup: "data", // Просканировать все данные для поиска уникальных строк
                            sort: "asc",          // Сортировать список по алфавиту
                            clearable: true
                        },
                headerTooltip: function() {
                return createHeaderTooltip(
                "Metamodel for organizing transitions between EA information units (content) ",
                [ { value: "User-driven (Non-linear)", desc: "User should select the information unit (content) to view independently" },
                { value: "Author-driven (Linear)", desc: "Transitions between information units (content) is exclusively linear, with the sequence determined by the EA authors" },
                { value: "Hybrid", desc: "Combination of both navigation metamodels" }
                ]);
                }, headerFilterPlaceholder: "Select value..."
        },

                {
                title:"Contextual Navigation", 
                field:"Contextual Navigation",
                cssClass: "column-navigation", 
                width: "9%", 
                minWidth: 100,
                headerFilter: "list",
                        headerFilterParams: { 
                            valuesLookup: "data", // Просканировать все данные для поиска уникальных строк
                            sort: "asc",          // Сортировать список по алфавиту
                            clearable: true
                        },
                headerTooltip: function() {
                return createHeaderTooltip("Connects related information units regardless of their position within the organizational structure of the EA. Implemented through internal, external, and inter-links")}, 
                hozAlign:"center",
                formatter: tabulatorTickCrossCleanFormatter,
                headerFilterPlaceholder: "Select value..."
                },

                {
                title:"Inter-content Navigation", 
                field:"Inter-content Navigation",
                cssClass: "column-navigation", 
                width: "9%", 
                minWidth: 100,
                headerFilter: "list",
                        headerFilterParams: { 
                            valuesLookup: "data", // Просканировать все данные для поиска уникальных строк
                            sort: "asc",          // Сортировать список по алфавиту
                            clearable: true
                        },
                headerTooltip: function() {
                return createHeaderTooltip("Type of contextual navigation. It involves links to other related elements of the EA content (other maps, articles, etc.)")}, 
                hozAlign:"center",
                formatter: tabulatorTickCrossCleanFormatter,
                headerFilterPlaceholder: "Select value..."
                },

                {
                title:"Detached Navigation", 
                field:"Detached Navigation",
                cssClass: "column-navigation", 
                width: "9%", 
                minWidth: 100,
                headerFilter: "list",
                        headerFilterParams: { 
                            valuesLookup: "data", // Просканировать все данные для поиска уникальных строк
                            sort: "asc",          // Сортировать список по алфавиту
                            clearable: true
                        },
                headerTooltip: function() {
                return createHeaderTooltip("Completely independent of content pages and provides overview and/or access to any (top-level) node in the EA. Usually placed on separate navigation pages")}, 
                hozAlign:"center",
                formatter: tabulatorTickCrossCleanFormatter,
                headerFilterPlaceholder: "Select value..."
                },

                {
                title:"Main Navigation Mechanism (Atlas Level)", 
                field:"Main Navigation Mechanism (Atlas Level)",
                cssClass: "column-navigation",
                width: "11%", 
                minWidth: 100,  
                headerFilter: "list",
                        headerFilterParams: { 
                            valuesLookup: "data", // Просканировать все данные для поиска уникальных строк
                            sort: "asc",          // Сортировать список по алфавиту
                            clearable: true
                        },
                headerTooltip: function() {
                return createHeaderTooltip(
                "Set of links and interface elements that provide access to information units (thematic content)",
                [ { value: "Slide/Scroll", desc: "Horizontal scrolling or a slider" },
                { value: "Linear Wizard", desc: "Multi-step user interface that forces a user to complete sequential steps in a strictly rigid order. Usually involves selecting a number of attributes from drop-down lists" },
                { value: "Hierarchical lists", desc: "Lists with one or more hierarchical levels" },
                { value: "Tree menu", desc: "Hierarchical navigation interface with expandable/collapsible nodes and parent–child relationships that enables interactive exploration of nested content" },
                { value: "Menu bar/Tabs", desc: "Series of aligned buttons (with drop-down menus)" },
                { value: "Site map", desc: "Visual scheme and/or structured list of all sections and subsections of the EA, providing an overview of its full content organization" },
                { value: "Graphic menu", desc: "Interactive access interface where the EA content is represented as a graphical visualization (e.g., sunburst, circular treemap, etc.)" },
                { value: "Map", desc: "Map functions as the primary gateway to the content" },
                { value: "Image grid", desc: "Grid-based collection of image thumbnails with captions, where each item provides access to a specific information unit (content element)" }
                ]);
                }, headerFilterPlaceholder: "Select value..."
        },

            {
                title:"Main Navigation Mechanism (Map-Vis Level)", 
                field:"Main Navigation Mechanism (Map-Vis Level)",
                cssClass: "column-navigation",
                width: "11%", 
                minWidth: 100,  
                headerFilter: "list",
                        headerFilterParams: { 
                            valuesLookup: "data", // Просканировать все данные для поиска уникальных строк
                            sort: "asc",          // Сортировать список по алфавиту
                            clearable: true
                        },
                headerTooltip: function() {
                return createHeaderTooltip(
                "Set of links and interface elements that provide access to information units (thematic content) within detached map/visualization sections (if available)",
                [ { value: "Slide/Scroll", desc: "Horizontal scrolling or a slider" },
                { value: "Linear Wizard", desc: "Multi-step user interface that forces a user to complete sequential steps in a strictly rigid order. Usually involves selecting a number of attributes from drop-down lists" },
                { value: "Hierarchical lists", desc: "Lists with one or more hierarchical levels" },
                { value: "Tree menu", desc: "Hierarchical navigation interface with expandable/collapsible nodes and parent–child relationships that enables interactive exploration of nested content" },
                { value: "Menu bar/Tabs", desc: "Series of aligned buttons (with drop-down menus)" },
                { value: "Site map", desc: "Visual scheme and/or structured list of all sections and subsections of the EA, providing an overview of its full content organization" },
                { value: "Graphic menu", desc: "Interactive access interface where the EA content is represented as a graphical visualization (e.g., sunburst, circular treemap, etc.)" },
                { value: "Map", desc: "Map functions as the primary gateway to the content" },
                { value: "Image grid", desc: "Grid-based collection of image thumbnails with captions, where each item provides access to a specific information unit (content element)" }
                ]);
                }, headerFilterPlaceholder: "Select value..."
        },

                {
                title:"Structure Overview on Any Screen", 
                field:"Structure Overview on Any Screen",
                cssClass: "column-navigation", 
                width: "10%", 
                minWidth: 100,
                headerFilter: "list",
                        headerFilterParams: { 
                            valuesLookup: "data", // Просканировать все данные для поиска уникальных строк
                            sort: "asc",          // Сортировать список по алфавиту
                            clearable: true
                        },
                headerTooltip: function() {
                return createHeaderTooltip("Each page includes a global navigation menu showing at least two levels of hierarchy (or a top-level in cases of EAs with shallow content hierarchy). In single-page EAs, top-level content hierarchy should be accessible in every view")}, 
                hozAlign:"center",
                formatter: tabulatorTickCrossCleanFormatter,
                headerFilterPlaceholder: "Select value..."
                },

                {
                title:"Content Search", 
                field:"Content Search",
                cssClass: "column-navigation", 
                width: "9%", 
                minWidth: 100,
                headerFilter: "list",
                        headerFilterParams: { 
                            valuesLookup: "data", // Просканировать все данные для поиска уникальных строк
                            sort: "asc",          // Сортировать список по алфавиту
                            clearable: true
                        },
                headerTooltip: function() {
                return createHeaderTooltip("Global search across EA content or search within the table of contents")}, 
                hozAlign:"center",
                formatter: tabulatorTickCrossCleanFormatter,
                headerFilterPlaceholder: "Select value..."
                },

                {
                title:"Search on Map", 
                field:"Search on Map",
                cssClass: "column-navigation", 
                width: "9%", 
                minWidth: 100,
                headerFilter: "list",
                        headerFilterParams: { 
                            valuesLookup: "data", // Просканировать все данные для поиска уникальных строк
                            sort: "asc",          // Сортировать список по алфавиту
                            clearable: true
                        },
                headerTooltip: function() {
                return createHeaderTooltip("Geographic or thematic search on map")}, 
                hozAlign:"center",
                formatter: tabulatorTickCrossCleanFormatter,
                headerFilterPlaceholder: "Select value..."
                }                
                ],},

                {
                title:"Content Representation", cssClass: "column-represent",
                columns:[

                {
                title:"Main Representation Type", 
                field:"Main Representation Type",
                cssClass: "column-represent",
                width: "11%", 
                minWidth: 100,  
                headerFilter: "list",
                        headerFilterParams: { 
                            valuesLookup: "data", // Просканировать все данные для поиска уникальных строк
                            sort: "asc",          // Сортировать список по алфавиту
                            clearable: true
                        },
                headerTooltip: function() {
                return createHeaderTooltip(
                "Primary (predominant) type of representation in the EA. A type of representation is a composition of representational units (individual texts, graphs, maps, etc.)",
                [ { value: "Articles", desc: "Text prevails, and the content is designed for reading. Articles may be text-only or include multimedia and embedded maps" },
                { value: "Maps/Map Modules", desc: "Maps or representation modules in which the map is the primary unit of representation" },
                { value: "Infographics", desc: "Graphic representations and diagrams combined with text predominate. Content interactivity is low or absent" },
                { value: "Interactive Visualisations", desc: "Interactive graphics, diagrams, and other non-geospatial visualisations predominate" },
                { value: "Profiles", desc: "All profiles are uniform in their layout, structure, and content representation. They repeatedly characterise different territories or atlas main objects according to fixed indicators" },
                { value: "Multimedia Collections", desc: "Content largely includes images, audio, and video" }
                ]);
                }, headerFilterPlaceholder: "Select value..."
        },

                {
                title:"Static Paper Atlas Content", 
                field:"Static Paper Atlas Content",
                cssClass: "column-represent", 
                width: "10%", 
                minWidth: 100,
                headerFilter: "list",
                        headerFilterParams: { 
                            valuesLookup: "data", // Просканировать все данные для поиска уникальных строк
                            sort: "asc",          // Сортировать список по алфавиту
                            clearable: true
                        },
                headerTooltip: function() {
                return createHeaderTooltip("Content from the associated paper atlas is used in the form of static raster images")}, 
                hozAlign:"center",
                formatter: tabulatorTickCrossCleanFormatter,
                headerFilterPlaceholder: "Select value..."
                },

                {
                title:"Scroll-based Representation", 
                field:"Scroll-based Representation",
                cssClass: "column-represent", 
                width: "10%", 
                minWidth: 100,
                headerFilter: "list",
                        headerFilterParams: { 
                            valuesLookup: "data", // Просканировать все данные для поиска уникальных строк
                            sort: "asc",          // Сортировать список по алфавиту
                            clearable: true
                        },
                headerTooltip: function() {
                return createHeaderTooltip("Scrollable pages are the main form of EA content presentation")}, 
                hozAlign:"center",
                formatter: tabulatorTickCrossCleanFormatter,
                headerFilterPlaceholder: "Select value..."
                },

                {
                title:"Storytelling Techniques", 
                field:"Storytelling Techniques",
                cssClass: "column-represent", 
                width: "10%", 
                minWidth: 100,
                headerFilter: "list",
                        headerFilterParams: { 
                            valuesLookup: "data", // Просканировать все данные для поиска уникальных строк
                            sort: "asc",          // Сортировать список по алфавиту
                            clearable: true
                        },
                headerTooltip: function() {
                return createHeaderTooltip("At least two of the four storytelling techniques (Roth, 2021) – Mood, Attention, Metaphor and Voice – should be used. These techniques distinguish the traditional style from the narrative style")}, 
                hozAlign:"center",
                formatter: tabulatorTickCrossCleanFormatter,
                headerFilterPlaceholder: "Select value..."
                },

                {
                title:"Only Map-Linked Content", 
                field:"Only Map-Linked Content",
                cssClass: "column-represent", 
                width: "10%", 
                minWidth: 100,
                headerFilter: "list",
                        headerFilterParams: { 
                            valuesLookup: "data", // Просканировать все данные для поиска уникальных строк
                            sort: "asc",          // Сортировать список по алфавиту
                            clearable: true
                        },
                headerTooltip: function() {
                return createHeaderTooltip("All non-cartographic content is linked exclusively to maps or to map modules")}, 
                hozAlign:"center",
                formatter: tabulatorTickCrossCleanFormatter,
                headerFilterPlaceholder: "Select value..."
                },

                {
                title:"Combination of Representation Units", 
                field:"Combination of Representation Units",
                cssClass: "column-represent", 
                width: "10%", 
                minWidth: 100,
                headerFilter: "list",
                        headerFilterParams: { 
                            valuesLookup: "data", // Просканировать все данные для поиска уникальных строк
                            sort: "asc",          // Сортировать список по алфавиту
                            clearable: true
                        },
                headerTooltip: function() {
                return createHeaderTooltip("Several representation units are displayed on a single screen and at the same interface level. Content in popup windows is not taken into account")}, 
                hozAlign:"center",
                formatter: tabulatorTickCrossCleanFormatter,
                headerFilterPlaceholder: "Select value..."
                },

                {
                title:"Narrative Texts", 
                field:"Narrative Texts",
                cssClass: "column-represent", 
                width: "8%", 
                minWidth: 100,
                headerFilter: "list",
                        headerFilterParams: { 
                            valuesLookup: "data", // Просканировать все данные для поиска уникальных строк
                            sort: "asc",          // Сортировать список по алфавиту
                            clearable: true
                        },
                headerTooltip: function() {
                return createHeaderTooltip("Presence of comprehensive texts that explain and supplement the representations or are independent units. Brief formal descriptions of indicators are not counted")}, 
                hozAlign:"center",
                formatter: tabulatorTickCrossCleanFormatter,
                headerFilterPlaceholder: "Select value..."
                },

                {
                title:"Interactive Tables", 
                field:"Interactive Tables",
                cssClass: "column-represent", 
                width: "9%", 
                minWidth: 100,
                headerFilter: "list",
                        headerFilterParams: { 
                            valuesLookup: "data", // Просканировать все данные для поиска уникальных строк
                            sort: "asc",          // Сортировать список по алфавиту
                            clearable: true
                        },
                headerTooltip: function() {
                return createHeaderTooltip("Presence of interactive tables")}, 
                hozAlign:"center",
                formatter:"tickCross", 
                formatter: tabulatorTickCrossCleanFormatter,
                headerFilterPlaceholder: "Select value..."
                },

                {
                title:"Charts and Diagrams", 
                field:"Charts and Diagrams",
                cssClass: "column-represent", 
                width: "9%", 
                minWidth: 100,
                headerFilter: "list",
                        headerFilterParams: { 
                            valuesLookup: "data", // Просканировать все данные для поиска уникальных строк
                            sort: "asc",          // Сортировать список по алфавиту
                            clearable: true
                        },
                headerTooltip: function() {
                return createHeaderTooltip("Presence of both static and interactive. Charts/diagrams as elements of map methods is not taken into account")}, 
                hozAlign:"center",
                formatter:"tickCross", 
                formatter: tabulatorTickCrossCleanFormatter,
                headerFilterPlaceholder: "Select value..."
                },

                {
                title:"Images", 
                field:"Images",
                cssClass: "column-represent", 
                width: "8%", 
                minWidth: 100,
                headerFilter: "list",
                        headerFilterParams: { 
                            valuesLookup: "data", // Просканировать все данные для поиска уникальных строк
                            sort: "asc",          // Сортировать список по алфавиту
                            clearable: true
                        },
                headerTooltip: function() {
                return createHeaderTooltip("Raster static maps are not counted as images")}, 
                hozAlign:"center",
                formatter:"tickCross", 
                formatter: tabulatorTickCrossCleanFormatter,
                headerFilterPlaceholder: "Select value..."
                },

                {
                title:"Audio", 
                field:"Audio",
                cssClass: "column-represent", 
                width: "8%", 
                minWidth: 100,
                headerFilter: "list",
                        headerFilterParams: { 
                            valuesLookup: "data", // Просканировать все данные для поиска уникальных строк
                            sort: "asc",          // Сортировать список по алфавиту
                            clearable: true
                        },
                headerTooltip: function() {
                return createHeaderTooltip("Abstract sounds, soundscapes, music, speech")}, 
                hozAlign:"center",
                formatter:"tickCross", 
                formatter: tabulatorTickCrossCleanFormatter,
                headerFilterPlaceholder: "Select value..."
                },

                {
                title:"Video", 
                field:"Video",
                cssClass: "column-represent", 
                width: "8%", 
                minWidth: 100,
                headerFilter: "list",
                        headerFilterParams: { 
                            valuesLookup: "data", // Просканировать все данные для поиска уникальных строк
                            sort: "asc",          // Сортировать список по алфавиту
                            clearable: true
                        },
                headerTooltip: function() {
                return createHeaderTooltip("Embedded YouTube videos count. Tutorial videos do not count")}, 
                hozAlign:"center",
                formatter:"tickCross", 
                formatter: tabulatorTickCrossCleanFormatter,
                headerFilterPlaceholder: "Select value..."
                },

                {
                title:"Animation", 
                field:"Animation",
                cssClass: "column-represent", 
                width: "8%", 
                minWidth: 100,
                headerFilter: "list",
                        headerFilterParams: { 
                            valuesLookup: "data", // Просканировать все данные для поиска уникальных строк
                            sort: "asc",          // Сортировать список по алфавиту
                            clearable: true
                        },
                headerTooltip: function() {
                return createHeaderTooltip("Ordered sequence of frames that is automatically and sequentially played to create the perception of movement and/or change for the user. Decorative animation іs not taken into account")}, 
                hozAlign:"center",
                formatter:"tickCross", 
                formatter: tabulatorTickCrossCleanFormatter,
                headerFilterPlaceholder: "Select value..."
                },

                {
                title:"Map Concept", 
                field:"Map Concept",
                cssClass: "column-represent",
                width: "9%", 
                minWidth: 100, 
                headerFilter: "list",
                        headerFilterParams: { 
                            valuesLookup: "data", // Просканировать все данные для поиска уникальных строк
                            sort: "asc",          // Сортировать список по алфавиту
                            clearable: true
                        },
                headerTooltip: function() {
                return createHeaderTooltip(
                "EA’s primary concept of cartographic information presentation. Follows the framework proposed by Resch & Jordan (2001). Determined by the map/visualization sections (if available)",
                [ { value: "Restricted", desc: "Only one map can be viewed on a single screen (page). Maps are usually ready-made" },
                { value: "Restricted Flexible", desc: "Cartographic information is organised by maps. However, it is possible to combine specific maps or map layers" },
                { value: "Flexible", desc: "Cartographic information is organised into layers that can be combined and superimposed in any number on a shared basemap" },
                { value: "Hybrid", desc: "Separate set of maps and a separate set of layers are provided" }
                ]);
                }, headerFilterPlaceholder: "Select value..."
            },

                {
                title:"Map as Interface", 
                field:"Map as Interface",
                cssClass: "column-represent", 
                width: "8%", 
                minWidth: 100,
                headerFilter: "list",
                        headerFilterParams: { 
                            valuesLookup: "data", // Просканировать все данные для поиска уникальных строк
                            sort: "asc",          // Сортировать список по алфавиту
                            clearable: true
                        },
                headerTooltip: function() {
                return createHeaderTooltip("Map functions as an access mechanism to other content or to detailed information")}, 
                hozAlign:"center",
                formatter:"tickCross", 
                formatter: tabulatorTickCrossCleanFormatter,
                headerFilterPlaceholder: "Select value..."
                },

                {
                title:"Map for Localisation Only", 
                field:"Map for Localisation Only",
                cssClass: "column-represent", 
                width: "9%", 
                minWidth: 100,
                headerFilter: "list",
                        headerFilterParams: { 
                            valuesLookup: "data", // Просканировать все данные для поиска уникальных строк
                            sort: "asc",          // Сортировать список по алфавиту
                            clearable: true
                        },
                headerTooltip: function() {
                return createHeaderTooltip("Map is used only for the localisation of objects or phenomena. Also includes EAs whose maps depict the same indicator (typically for Profiles)")}, 
                hozAlign:"center",
                formatter: tabulatorTickCrossCleanFormatter,
                headerFilterPlaceholder: "Select value..."
                },

                {
                title:"Interactive Maps", 
                field:"Interactive Maps",
                cssClass: "column-represent",
                width: "9%", 
                minWidth: 100,  
                headerFilter: "list",
                        headerFilterParams: { 
                            valuesLookup: "data", // Просканировать все данные для поиска уникальных строк
                            sort: "asc",          // Сортировать список по алфавиту
                            clearable: true
                        },
                headerTooltip: function() {
                return createHeaderTooltip(
                "Proportion of interactive maps in the EA",
                [ { value: "None", desc: "No interactive maps" },
                { value: "Partial", desc: "Interactive maps are combined with static maps" },
                { value: "Full", desc: "All maps are interactive" }
                ]);
                }, headerFilterPlaceholder: "Select value..."
            },

                {
                title:"Multi-layer Maps", 
                field:"Multi-layer Maps",
                cssClass: "column-represent", 
                width: "9%", 
                minWidth: 100,
                headerFilter: "list",
                        headerFilterParams: { 
                            valuesLookup: "data", // Просканировать все данные для поиска уникальных строк
                            sort: "asc",          // Сортировать список по алфавиту
                            clearable: true
                        },
                headerTooltip: function() {
                return createHeaderTooltip("Presence of ready-made interactive maps consisting of a set of layers with a toggle (overlay) function. <br> <b> Left blank for non-interactive maps </b> </br>")}, 
                hozAlign:"center",
                formatter: tabulatorTickCrossCleanFormatter,
                headerFilterPlaceholder: "Select value..."
                },

                {
                title:"Main Style of Maps", 
                field:"Main Style of Maps",
                cssClass: "column-represent",
                width: "9%", 
                minWidth: 100,  
                headerFilter: "list",
                        headerFilterParams: { 
                            valuesLookup: "data", // Просканировать все данные для поиска уникальных строк
                            sort: "asc",          // Сортировать список по алфавиту
                            clearable: true
                        },
                headerTooltip: function() {
                return createHeaderTooltip(
                "Specifc manner of cartographic expression. Cohesive set of design characteristics and qualities of map. Map style is visually intuitive and immediately perceived by users",
                [ { value: "Traditional", desc: "Traditional style is based on the cartographic rules and techniques established in textbooks. The colour palettes are well-balanced, and the overall design is refined, academic, or authoritative (Muehlenhaus, 2014). The basemap and map labels are included" },
                { value: "Laconic", desc: "A limited number of map symbols. Balanced, low-contrast colour palettes. A grey or minimalistic basemap" },
                { value: "Expressive", desc: "Eye-catching, vivid symbolisation. Based on a traditional style" },
                { value: "Visualizational", desc: "Visualisation style is characterised by unprocessed GIS visualisations and visualisations that do not adhere to cartographic conventions. Among cartographically sound maps, at least two of the following requirements must be met: 1) the predominance of grid or raster methods, 2) a high-contrast colour palette, 3) exclusively choropleth maps, and 4) the absence of a basemap or the use of a contour map" },
                { value: "Antique", desc: "Style of ancient maps or the direct use of old maps" },
                { value: "Artistic", desc: "Original authorial expression. High level of decorativeness" }
                ]);
                }, headerFilterPlaceholder: "Select value..."
            },

                {
                title:"Web Mercator Projection Only", 
                field:"Web Mercator Projection Only",
                cssClass: "column-represent", 
                width: "9%", 
                minWidth: 100,
                headerFilter: "list",
                        headerFilterParams: { 
                            valuesLookup: "data", // Просканировать все данные для поиска уникальных строк
                            sort: "asc",          // Сортировать список по алфавиту
                            clearable: true
                        },
                headerTooltip: function() {
                return createHeaderTooltip("Only Web Mercator projection is used. If the projection cannot be determined, it is not specified")}, 
                hozAlign:"center",
                formatter: tabulatorTickCrossCleanFormatter,
                headerFilterPlaceholder: "Select value..."
                },

                {
                title:"Globe", 
                field:"Globe",
                cssClass: "column-represent", 
                width: "7%", 
                minWidth: 100,
                headerFilter: "list",
                        headerFilterParams: { 
                            valuesLookup: "data", // Просканировать все данные для поиска уникальных строк
                            sort: "asc",          // Сортировать список по алфавиту
                            clearable: true
                        },
                headerTooltip: function() {
                return createHeaderTooltip("Presence of a globe in any section and in any function")}, 
                hozAlign:"center",
                formatter: tabulatorTickCrossCleanFormatter,
                headerFilterPlaceholder: "Select value..."
                },

                {
                title:"Multi-scale Maps", 
                field:"Multi-scale Maps",
                cssClass: "column-represent", 
                width: "9%", 
                minWidth: 100,
                headerFilter: "list",
                        headerFilterParams: { 
                            valuesLookup: "data", // Просканировать все данные для поиска уникальных строк
                            sort: "asc",          // Сортировать список по алфавиту
                            clearable: true
                        },
                headerTooltip: function() {
                return createHeaderTooltip("Presence of interactive maps with multiple generalization levels (scales). <br> <b> Left blank for non-interactive maps </b> </br>")}, 
                hozAlign:"center",
                formatter: tabulatorTickCrossCleanFormatter,
                headerFilterPlaceholder: "Select value..."
                },

                {
                title:"In-house Basemap", 
                field:"In-house Basemap",
                cssClass: "column-represent", 
                width: "9%", 
                minWidth: 100,
                headerFilter: "list",
                        headerFilterParams: { 
                            valuesLookup: "data", // Просканировать все данные для поиска уникальных строк
                            sort: "asc",          // Сортировать список по алфавиту
                            clearable: true
                        },
                headerTooltip: function() {
                return createHeaderTooltip("Presence of basemaps created by the EA authors or created in the developers’ country. <br> <b> Left blank for non-interactive maps </b> </br>")}, 
                hozAlign:"center",
                formatter: tabulatorTickCrossCleanFormatter,
                headerFilterPlaceholder: "Select value..."
                },

                {
                title:"Basemap Implementation", 
                field:"Basemap Implementation",
                cssClass: "column-represent",
                width: "10%", 
                minWidth: 100,  
                headerFilter: "list",
                        headerFilterParams: { 
                            valuesLookup: "data", // Просканировать все данные для поиска уникальных строк
                            sort: "asc",          // Сортировать список по алфавиту
                            clearable: true
                        },
                headerTooltip: function() {
                return createHeaderTooltip(
                "Method of implementing the EA basemaps. <br> <b> Left blank for non-interactive maps </b> </br>",
                [ { value: "None", desc: "No basemap is used" },
                { value: "Basemap only", desc: "Basemap consists exclusively of ready-made basemaps" },
                { value: "Baselayers only", desc: "Basemap consists of individual base layers that the user can overlay" },
                { value: "Hybrid", desc: "Combination of ready-made basemaps and individual base layers" }
                ]);
                }, headerFilterPlaceholder: "Select value..."
            },

                {
                title:"Main Basemap Content", 
                field:"Main Basemap Content",
                cssClass: "column-represent",
                width: "10%", 
                minWidth: 100,  
                headerFilter: "list",
                        headerFilterParams: { 
                            valuesLookup: "data", // Просканировать все данные для поиска уникальных строк
                            sort: "asc",          // Сортировать список по алфавиту
                            clearable: true
                        },
                headerTooltip: function() {
                return createHeaderTooltip(
                "Level of detail and/or type of the primary EA basemap",
                [ { value: "None", desc: "No basemap is used" },
                { value: "Contour map", desc: "Only the outlines of land and/or administrative boundaries are represented" },
                { value: "Several geoelements", desc: "Represents 2-3 natural or artificial features, typically relief, hydrography and settlements" },
                { value: "Simplified Topographic Map", desc: "Relief, hydrography, settlements, transport routes, administrative boundaries are represented, but they are more selectively chosen and more generalised than on regular topographic maps" },
                { value: "Topographic map", desc: "" },
                { value: "Satellite Imagery", desc: "" }
                ]);
                }, headerFilterPlaceholder: "Select value..."
            },

                {
                title:"Multivariate Maps", 
                field:"Multivariate Maps",
                cssClass: "column-represent", 
                width: "9%", 
                minWidth: 100,
                headerFilter: "list",
                        headerFilterParams: { 
                            valuesLookup: "data", // Просканировать все данные для поиска уникальных строк
                            sort: "asc",          // Сортировать список по алфавиту
                            clearable: true
                        },
                headerTooltip: function() {
                return createHeaderTooltip("Presence of ready-made maps that represents two or more indicators on a single map by combining different map methods")}, 
                hozAlign:"center",
                formatter: tabulatorTickCrossCleanFormatter,
                headerFilterPlaceholder: "Select value..."
                },

                {
                title:"Monotonous Symbolisation", 
                field:"Monotonous Symbolisation",
                cssClass: "column-represent", 
                width: "10%", 
                minWidth: 100,
                headerFilter: "list",
                        headerFilterParams: { 
                            valuesLookup: "data", // Просканировать все данные для поиска уникальных строк
                            sort: "asc",          // Сортировать список по алфавиту
                            clearable: true
                        },
                headerTooltip: function() {
                return createHeaderTooltip("Fewer than five mapping methods are used. The exception is the variety of visualisations within a single method.  The mapping methods are based on the Soviet tradition (Krakovskyi, 2025), which is closely aligned with the German-speaking cartographic school (Freitag, 1992): (Proportional) Symbol Maps, Localised Diagram Maps, Line Maps, Flow Maps, Isoline Maps, Dot Density Maps, Area Maps, Qualitative Chorochromatic maps, Quantitative Chorochromatic maps, Grid maps, Area Diagram Maps, Choropleth Maps, Dasymetric Maps, Cartograms, Bivariate Maps")}, 
                hozAlign:"center",
                formatter: tabulatorTickCrossCleanFormatter,
                headerFilterPlaceholder: "Select value..."
                },

                {
                title:"Legend Adaptability", 
                field:"Legend Adaptability",
                cssClass: "column-represent",
                width: "9%", 
                minWidth: 100,  
                headerFilter: "list",
                        headerFilterParams: { 
                            valuesLookup: "data", // Просканировать все данные для поиска уникальных строк
                            sort: "asc",          // Сортировать список по алфавиту
                            clearable: true
                        },
                headerTooltip: function() {
                return createHeaderTooltip(
                "Legend content is automatically updated by the system to match the current map view. <br> <b> Left blank for non-interactive maps </b> </br>",
                [ { value: "None", desc: "Static legend" },
                { value: "Quantitative", desc: "Number of legend indicators automatically changes according to the current map view" },
                { value: "Graphical", desc: "Graphical properties of legend symbols (e.g., transparency, size) automatically change according to the current map view" },
                { value: "Hybrid", desc: "Combination of quantitative and graphical adaptability" }
                ]);
                }, headerFilterPlaceholder: "Select value..."
            },

                {
                title:"Map Labels", 
                field:"Map Labels",
                cssClass: "column-represent",
                width: "9%", 
                minWidth: 100,  
                headerFilter: "list",
                        headerFilterParams: { 
                            valuesLookup: "data", // Просканировать все данные для поиска уникальных строк
                            sort: "asc",          // Сортировать список по алфавиту
                            clearable: true
                        },
                headerTooltip: function() {
                return createHeaderTooltip(
                "Presence of map labels. Labels that appear as a result of interactions are not counted. <br> <b> Left blank for non-interactive maps </b> </br>",
                [ { value: "None", desc: "No labels are present" },
                { value: "Embedded in the Basemap", desc: "Labels are embedded in the ready-made basemap" },
                { value: "Individual layers", desc: "Labels are presented as separate layers that users can overlay" },
                { value: "Hybrid", desc: "Combination of embedded labels and individual layers" }
                ]);
                }, headerFilterPlaceholder: "Select value..."
            },

                {
                title:"Map Comparison", 
                field:"Map Comparison",
                cssClass: "column-represent",
                width: "9%", 
                minWidth: 100,  
                headerFilter: "list",
                        headerFilterParams: { 
                            valuesLookup: "data", // Просканировать все данные для поиска уникальных строк
                            sort: "asc",          // Сортировать список по алфавиту
                            clearable: true
                        },
                headerTooltip: function() {
                return createHeaderTooltip(
                "Available methods of map comparison",
                [ { value: "None", desc: "Map comparison is not available" },
                { value: "Internal", desc: "Comparison of maps/layers within a single map (single visualization window) using overlay and transparency and/or vertical or horizontal sliders" },
                { value: "External", desc: "Comparison of separate maps placed side by side in the table of contents and updated asynchronously, simulating an animation effect. Animation also falls into this category" },
                { value: "Separate Windows", desc: "Comparison of separate maps displayed in different visualization windows on the same screen" },
                { value: "Internal & External", desc: "Combination of internal and external comparison methods" },
                { value: "Internal & Separate Windows", desc: "Combination of internal comparison methods and separate windows mode" },
                { value: "External & Separate Windows", desc: "Combination of external comparison methods and separate windows mode" },
                { value: "Hybrid", desc: "Combination of all three comparison methods" }
                ]);
                }, headerFilterPlaceholder: "Select value..."
            },
                ],},

                {
                title:"Functionality", cssClass: "column-func",
                columns:[

                {
                title:"Fully Functional", 
                field:"Fully Functional",
                cssClass: "column-func", 
                width: "8%", 
                minWidth: 100,
                headerFilter: "list",
                        headerFilterParams: { 
                            valuesLookup: "data", // Просканировать все данные для поиска уникальных строк
                            sort: "asc",          // Сортировать список по алфавиту
                            clearable: true
                        },
                headerTooltip: function() {
                return createHeaderTooltip("All content elements can be opened. All interactive functions work properly")}, 
                hozAlign:"center",
                formatter: tabulatorTickCrossCleanFormatter,
                headerFilterPlaceholder: "Select value..."
                },

                {
                title:"Authorization", 
                field:"Authorization",
                cssClass: "column-func", 
                width: "8%", 
                minWidth: 100,
                headerFilter: "list",
                        headerFilterParams: { 
                            valuesLookup: "data", // Просканировать все данные для поиска уникальных строк
                            sort: "asc",          // Сортировать список по алфавиту
                            clearable: true
                        },
                headerTooltip: function() {
                return createHeaderTooltip("Possibility to create an account")}, 
                hozAlign:"center",
                formatter: tabulatorTickCrossCleanFormatter,
                headerFilterPlaceholder: "Select value..."
                },

                {
                title:"Main Map-Vis Interactivity", 
                field:"Main Map-Vis Interactivity",
                cssClass: "column-func",
                width: "10%", 
                minWidth: 100,  
                headerFilter: "list",
                        headerFilterParams: { 
                            valuesLookup: "data", // Просканировать все данные для поиска уникальных строк
                            sort: "asc",          // Сортировать список по алфавиту
                            clearable: true
                        },
                headerTooltip: function() {
                return createHeaderTooltip(
                "Interactivity of maps and visualisations is determined by 13 work interaction operators defined by Roth (2011, 2017): Pan, Zoom, Retrieve, Filter, Search, Calculate, Overlay, Underlay, Resymbolize, Reproject, Reexpress, Sequence, Arrangement. For EAs whose content consists exclusively of interactive visualisations, interactivity is determined by the following 10 operators: Pan, Zoom, Retrieve, Selection, Filter, Search, Resymbolize, Reexpress, Sequence, Arrangement. <br> <b>The most common interactivity is specified </b> </br>",
                [ { value: "None", desc: "0 operators" },
                { value: "Basic", desc: "0-4 operators (0-2 for interactive visualisations)" },
                { value: "Intermediate", desc: "5-7 operators (3-5 for interactive visualisations)" },
                { value: "Advanced", desc: "8-11 operators (5-8 for interactive visualisations)" },
                { value: "Full", desc: "12-13 operators (8-10 for interactive visualisations)" }
                ]);
                }, headerFilterPlaceholder: "Select value..."
            },

                {
                title:"Max Map-Vis Interactivity", 
                field:"Max Map-Vis Interactivity",
                cssClass: "column-func",
                width: "10%", 
                minWidth: 100,  
                headerFilter: "list",
                        headerFilterParams: { 
                            valuesLookup: "data", // Просканировать все данные для поиска уникальных строк
                            sort: "asc",          // Сортировать список по алфавиту
                            clearable: true
                        },
                headerTooltip: function() {
                return createHeaderTooltip(
                "Interactivity of maps and visualisations is determined by 13 work interaction operators defined by Roth (2011, 2017): Pan, Zoom, Retrieve, Filter, Search, Calculate, Overlay, Underlay, Resymbolize, Reproject, Reexpress, Sequence, Arrangement. For EAs whose content consists exclusively of interactive visualisations, interactivity is determined by the following 10 operators: Pan, Zoom, Retrieve, Selection, Filter, Search, Resymbolize, Reexpress, Sequence, Arrangement. <br> <b>The maximum recorded interactivity is specified </b> </br>",
                [ { value: "None", desc: "0 operators" },
                { value: "Basic", desc: "0-4 operators (0-2 for interactive visualisations)" },
                { value: "Intermediate", desc: "5-7 operators (3-5 for interactive visualisations)" },
                { value: "Advanced", desc: "8-11 operators (5-8 for interactive visualisations)" },
                { value: "Full", desc: "12-13 operators (8-10 for interactive visualisations)" }
                ]);
                }, headerFilterPlaceholder: "Select value..."
            },

                {
                title:"Map Legend Interactivity", 
                field:"Map Legend Interactivity",
                cssClass: "column-func",
                width: "10%", 
                minWidth: 100,  
                headerFilter: "list",
                        headerFilterParams: { 
                            valuesLookup: "data", // Просканировать все данные для поиска уникальных строк
                            sort: "asc",          // Сортировать список по алфавиту
                            clearable: true
                        },
                headerTooltip: function() {
                return createHeaderTooltip(
                "Type of legend interactivity. <br> <b> Left blank for non-interactive maps </b> </br> ",
                [ { value: "None", desc: "All legends are non-interactive" },
                { value: "Internal", desc: "Interactivity within the legend window (e.g., tooltips)" },
                { value: "External Unidirectional", desc: "Results of actions (e.g., filtering) in the legend are reflected on the map" },
                { value: "External Bidirectional", desc: "Interaction with map objects changes the legend display (e.g., highlighting the corresponding indicator class in the legend)" },
                { value: "Hybrid", desc: "Combination of several types of interactivity" }
                ]);
                }, headerFilterPlaceholder: "Select value..."
            },

                {
                title:"Modification of Map Symbolization", 
                field:"Modification of Map Symbolization",
                cssClass: "column-func", 
                width: "10%", 
                minWidth: 100,
                headerFilter: "list",
                        headerFilterParams: { 
                            valuesLookup: "data", // Просканировать все данные для поиска уникальных строк
                            sort: "asc",          // Сортировать список по алфавиту
                            clearable: true
                        },
                headerTooltip: function() {
                return createHeaderTooltip("Users can change the map symbology (Resymbolize operator). Changes in transparency are not included. <br> <b> Left blank for non-interactive maps </b> </br>")}, 
                hozAlign:"center",
                formatter: tabulatorTickCrossCleanFormatter,
                headerFilterPlaceholder: "Select value..."
                },

                 {
                title:"Modification of Map Methods", 
                field:"Modification of Map Methods",
                cssClass: "column-func", 
                width: "10%", 
                minWidth: 100,
                headerFilter: "list",
                        headerFilterParams: { 
                            valuesLookup: "data", // Просканировать все данные для поиска уникальных строк
                            sort: "asc",          // Сортировать список по алфавиту
                            clearable: true
                        },
                headerTooltip: function() {
                return createHeaderTooltip("Users can change the map methods (Reexpress operator). <br> <b> Left blank for non-interactive maps </b> </br>")}, 
                hozAlign:"center",
                formatter: tabulatorTickCrossCleanFormatter,
                headerFilterPlaceholder: "Select value..."
                },

                {
                title:"Content Import", 
                field:"Content Import",
                cssClass: "column-func", 
                width: "8%", 
                minWidth: 100,
                headerFilter: "list",
                        headerFilterParams: { 
                            valuesLookup: "data", // Просканировать все данные для поиска уникальных строк
                            sort: "asc",          // Сортировать список по алфавиту
                            clearable: true
                        },
                headerTooltip: function() {
                return createHeaderTooltip("Users can upload their own content or data")}, 
                hozAlign:"center",
                formatter: tabulatorTickCrossCleanFormatter,
                headerFilterPlaceholder: "Select value..."
                },

                {
                title:"Content Export", 
                field:"Content Export",
                cssClass: "column-func", 
                width: "8%", 
                minWidth: 100,
                headerFilter: "list",
                        headerFilterParams: { 
                            valuesLookup: "data", // Просканировать все данные для поиска уникальных строк
                            sort: "asc",          // Сортировать список по алфавиту
                            clearable: true
                        },
                headerTooltip: function() {
                return createHeaderTooltip("Users can download content or data")}, 
                hozAlign:"center",
                formatter: tabulatorTickCrossCleanFormatter,
                headerFilterPlaceholder: "Select value..."
                },

                {
                title:"Print Map", 
                field:"Print Map",
                cssClass: "column-func", 
                width: "7%", 
                minWidth: 100,
                headerFilter: "list",
                        headerFilterParams: { 
                            valuesLookup: "data", // Просканировать все данные для поиска уникальных строк
                            sort: "asc",          // Сортировать список по алфавиту
                            clearable: true
                        },
                headerTooltip: function() {
                return createHeaderTooltip("Presence of Print Map function. The method and quality of implementation are not taken into account")}, 
                hozAlign:"center",
                formatter: tabulatorTickCrossCleanFormatter,
                headerFilterPlaceholder: "Select value..."
                }    
                ],}  

        ]



