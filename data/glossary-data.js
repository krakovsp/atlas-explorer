const GLOSSARY_DATA = [
    // ТИП 4: Заголовок секции (есть number, и маркер isSection)
    { number: "1", term: "Bibliographic Attributes", isSection: true },
    
    // ТИП 1 и 2: Одиночные строки (номер пишется вручную)
    { 
        number: "1.1",
        term: "Title", 
        definition: "Official atlas title in English. If an English localization is missing, the original title is used. All initial articles have been removed for search convenience. Diacritical marks have also been removed (applies to all text fields in the table)" 
    },
    { 
        number: "1.2",
        term: "Status",
        definition: "Current operational status of the EA, indicating whether it is actively maintained, archived, or no longer functional",
        nested: [
            { term: "", category: "Active", definition: "EA is fully functional and is actively maintained and updated" },
            { term: "", category: "Archived", definition: "EA remains fully or partially functional but is no longer the current version and is no longer maintained or updated" },
            { term: "", category: "Inactive", definition: "EA has ceased to exist. A desktop application no longer runs on modern operating systems, or the website of an online atlas has been removed and is no longer accessible" },
            { term: "", category: "Replaced", definition: "Older version of the atlas that has been replaced by a newer version of the website, which remains active" }
        ] 
    },

    { 
        number: "1.3",
        term: "Publication Date", 
        definition: "Date of the first launch of the EA using the same distribution method. The website address may have changed since then. This information was identified through the EA description, publications, Google Search, and the Wayback Machine" 
    },
    { 
        number: "1.4",
        term: "Last Update", 
        definition: "Date of the most recent EA update. An update is defined as any change to the content or to the media-cartographic components of the EA, as determined from author statements and the dating of content elements" 
    },
    { 
        number: "1.5",
        term: "Major Updates", 
        definition: "Number of major updates, each involving substantial changes to the interface, navigation, etc. This information was identified through the EA description, publications, Google Search, and the Wayback Machine" 
    },
    { 
        number: "1.6",
        term: "Last Major Update", 
        definition: "Date of the most recent major update. This information was identified through the EA description, publications, Google Search, and the Wayback Machine" 
    },
    { 
        number: "1.7",
        term: "Publisher Type",
        definition: "Type of entity responsible for publishing the EA. The publisher and the developer of the EA may not coincide",
        nested: [
            { term: "", category: "Government", definition: "Entities affiliated with government departments, including research institutes whose institutional functions involve policy regulation within a given field" },
            { term: "", category: "Organization", definition: "Non-governmental non-profit organizations" },
            { term: "", category: "Research Institution", definition: "Universities, research institutes or laboratories, that assume institutional responsibility for EA development and maintenance" },
            { term: "", category: "Private Sector", definition: "Commercial enterprises and profit-making organizations" },
            { term: "", category: "Volunteer Community", definition: "EAs developed and maintained primarily by volunteer contributors or open communities rather than by formally established organizations" },
            { term: "", category: "Individual", definition: "Individual or a small, informal group without institutional support" }
        ] 
    },
    { 
        number: "1.8",
        term: "Publisher", 
        definition: "Official name of the EA publisher. If published by a consortium, only the coordinating institution or the first few institutions are listed. Different entities are separated by “and”" 
    },
    { 
        number: "1.9",
        term: "Region of Publication",
        definition: "Based on the location of the publisher’s headquarters. If no headquarters can be identified (e.g., for international organizations), the cell is left blank. Classification of regions and countries according to the UNSD Standard Country or Area Codes for Statistical Use (M49)",
        nested: [
            { term: "", category: "Africa", definition: "" },
            { term: "", category: "North America", definition: "" },
            { term: "", category: "Latin America and the Caribbean", definition: "" },
            { term: "", category: "Asia", definition: "" },
            { term: "", category: "Europe", definition: "" },
            { term: "", category: "Oceania", definition: "" }
        ] 
    },
     { 
        number: "1.10",
        term: "Place of Publication", 
        definition: "Based on the location of the publisher’s headquarters. If no headquarters can be identified (e.g., for international organizations), the cell is left blank" 
    },
     { 
        number: "1.11",
        term: "International Publisher",
        category: "Yes/No", 
        definition: "Publishing institution self-identifies as international" 
    },
    { 
        number: "1.12",
        term: "Type of App Developer",
        definition: "Developers of the application or cartographic component. If individual authors are listed but affiliated with a specific entity, that entity type is indicated. If the developer is not specified, the type of the publishing entity is provided instead",
        nested: [
            { term: "", category: "Government", definition: "Entities affiliated with government departments, including research institutes whose institutional functions involve policy regulation within a given field" },
            { term: "", category: "Organization", definition: "Non-governmental non-profit organizations" },
            { term: "", category: "Research Institution", definition: "Universities, research institutes or laboratories, that assume institutional responsibility for EA development and maintenance" },
            { term: "", category: "Private Sector", definition: "Commercial enterprises and profit-making organizations" },
            { term: "", category: "Volunteer Community", definition: "Development is carried out by an open volunteer community, where anyone can contribute and no central research organization coordinates the project" },
            { term: "", category: "Individual", definition: "Application is developed primarily by a single individual or a small independent team" }
        ] 
    },
     { 
        number: "1.13",
        term: "App Developer", 
        definition: "Developers of the application or cartographic component. If the developer is not specified, the publishing entity is provided instead. Different entities are separated by “and”" 
    },
    { 
        number: "1.14",
        term: "Main Language", 
        definition: "Primary interface language of the EA. The extent to which EA content is translated is not taken into account" 
    },
    { 
        number: "1.15",
        term: "Number of Languages", 
        definition: "Number of the EA interface languages.The extent to which EA content is translated is not taken into account" 
    },
    { 
        number: "1.16",
        term: "English", 
        category: "Yes/No",
        definition: "Availability of an English localisation. The extent to which EA content is translated is not taken into account" 
    },
    { 
        number: "1.17",
        term: "Project Type",
        definition: "Number of atlas formats for which the atlas project provides development and maintenance",
        nested: [
            { term: "", category: "Standalone", definition: "EA only" },
            { term: "", category: "Dual", definition: "Both paper and electronic versions" }
        ] 
    },
    { 
        number: "1.18",
        term: "Paper Version", 
        category: "Yes/No",
        definition: "Availability of a paper atlas linked to the electronic version. It may be published before or after the EA release" 
    },
    { 
        number: "1.19",
        term: "Distribution",
        definition: "Method of EA distribution or type of client–server scenario",
        nested: [
            { term: "", category: "Desktop", definition: "EA requires installation on the user’s computer or mobile device. No internet connection is required for operation" },
            { term: "", category: "Online", definition: "EA is available only via a web browser" },
            { term: "", category: "Hybrid (Native)", definition: "EA requires installation on the user’s computer or mobile device. However, part of its data is stored in the cloud and requires a continuous internet connection" },
            { term: "", category: "Hybrid (Sync)", definition: "EA requires installation on the user’s computer or mobile device. Requires a periodic internet connection only to download offline map packages and sync updates" },
            { term: "", category: "Hybrid (PWA)", definition: "EA is available online, but can be installed on the user's computer. Requires a continuous internet connection to load mapping data dynamically from the cloud. PWA leverages browser caching to store the interface shell locally, ensuring faster load times, reduced server requests, and basic functionality even during temporary connection losses" }
        ] 
    },
    { 
        number: "1.20",
        term: "Access",
        definition: "Access conditions for EA content",
        nested: [
            { term: "", category: "Public (Free)", definition: "Free and unrestricted access" },
            { term: "", category: "Public (Paid)", definition: "Access to EA content requires payment" },
            { term: "", category: "Public (Freemium)", definition: "Part of the EA content requires payment" },
            { term: "", category: "Public (Registered)", definition: "Access to EA content is free but requires registration" },
            { term: "", category: "Restricted", definition: "Access is restricted" }
        ] 
    },
    { 
        number: "1.21",
        term: "Technology Type",
        definition: "Type of technology used to implement the entire atlas application or cartographic representation. The technology must be suitable for repeated use. Software solutions for implementing other content elements should not be taken into account. Solutions at a higher level in the hierarchy should be specified",
        nested: [
            { term: "", category: "None", definition: "Cartographic or atlas technology is absent" },
            { term: "", category: "Map-oriented", definition: "Library or solution intended for creating maps or spatial visualisations" },
            { term: "", category: "App-oriented", definition: "Platform, framework or solution intended for creating ready-made applications in the field of cartography and geovisualisation but not specifically designed for producing EAs" },
            { term: "", category: "Atlas platform/framework", definition: "Platform or framework specifically designed for the repeated creation of EAs. The platform/framework may be determined at your discretion if there are several identical atlas applications that differ only in terms of content" }
        ] 
    },
     { 
        number: "1.22",
        term: "Technology",
        definition: "Name of the technology used. Determined based on information from the developers, its visual appearance and the source code"
    },
      { 
        number: "1.23",
        term: "Implementation Method",
        definition: "Method of EA implementation from the perspective of navigational integrity",
        nested: [
            { term: "", category: "Standalone", definition: "EA is implemented as a standalone website or application" },
            { term: "", category: "Embedded", definition: "EA is embedded within a website or geoportal. The main page corresponds to the website or geoportal homepage" },
            { term: "", category: "Separated", definition: "EA sections are navigationally isolated and open on separate pages without a unified global navigation system" }
        ] 
    },
     { 
        number: "1.24",
        term: "Mobile Devices", 
        definition: "Ability to operate on mobile devices. The degree of interface adaptation is not taken into account",
        nested: [
            { term: "", category: "None", definition: "EA does not open on mobile devices" },
            { term: "", category: "Limited", definition: "EA operates on mobile devices but is not adapted for convenient use" },
            { term: "", category: "Partial", definition: "Only part of the EA functionality is available on mobile devices" },
            { term: "", category: "Full", definition: "All functionality is retained on mobile devices" }
        ] 
    },
     { 
        number: "1.25",
        term: "Date of Analysis",
        definition: "Date of analysis"
    },
    { 
        number: "1.26",
        term: "URL",
        definition: "Web address of the online atlas or the official website of the desktop EA and its developers"
    },

    { number: "2", term: "Content Attributes", isSection: true, group: "content" },

    { 
        number: "2.1",
        term: "Status",
        definition: "Current operational status of the EA, indicating whether it is actively maintained, archived, or no longer functional",
        nested: [
            { term: "", category: "Active", definition: "EA is fully functional and is actively maintained and updated" },
            { term: "", category: "Archived", definition: "EA remains fully or partially functional but is no longer the current version and is no longer maintained or updated" },
            { term: "", category: "Inactive", definition: "EA has ceased to exist. A desktop application no longer runs on modern operating systems, or the website of an online atlas has been removed and is no longer accessible" },
            { term: "", category: "Replaced", definition: "Older version of the atlas that has been replaced by a newer version of the website, which remains active" }
        ] 
    },

    { 
        number: "2.2",
        term: "Content Type",
        definition: "Each type implies specific requirements for both EA content and implementation. The type is recorded only if explicitly stated by the developers in the EA title or description",
        nested: [
            { term: "", category: "Thematic", definition: "Regular thematic EA" },
            { term: "", category: "Statistical", definition: "EA representing statistical data and typically complying with specific requirements (Schulz, 2014)" },
            { term: "", category: "National", definition: "Official national atlas, typically characterized by complex thematic coverage" }
        ] 
    },

    { 
        number: "2.3",
        term: "Thematic Coverage",
        definition: "Number and diversity of topics represented in the EA",
        nested: [
            { term: "", category: "Monothematic", definition: "One dominant topic prevails (80% of the content or more)" },
            { term: "", category: "Polythematic", definition: "Two or more topics are represented. History is not counted as a separate topic" },
            { term: "", category: "Complex", definition: "Comprehensive representation of a theme or territory according to the interpretation of Salichtchev (1976). The EA must include at least Nature, Environment, Society, and Economy. The level of detail is not considered" }
        ] 
    },
    { 
        number: "2.4",
        term: "Topic",
        definition: "Generalized EA themes. The most common topics were selected",
        nested: [
            { term: "", category: "Economy and Trade", definition: "Economy, Trade, Finance, Agriculture, Industry, and Economic activity" },
            { term: "", category: "Environment", definition: "Ecology, Natural hazards, Human–environment interaction, and Environmental protection activities" },
            { term: "", category: "Healthcare", definition: "Healthcare, Public health, and Disease spread" },
            { term: "", category: "History", definition: "Historical atlases. History is commonly combined with other topics" },
            { term: "", category: "Nature", definition: "Geology, Geomorphology, Hydrology, Climatology, Glaciology, Oceanography, Soil geography, Flora and Fauna, etc. Nature is the primary focus; human–nature interaction is secondary, unlike in the Environment category" },
            { term: "", category: "Society", definition: "Administrative Divisions, Elections and Voting, Population, Migration, Settlements and Urbanism, Housing, Living conditions, Culture, Language, Religion, Education, etc." },
            { term: "", category: "Transport & Infrastructure", definition: "Transport, Communication Network, Technical Infrastructure (e.g., Water supply, Electricity etc.)" },
            { term: "", category: "Other", definition: "Media & Journalism, Literature, Sport, etc." }
        ] 
    },
    { 
        number: "2.5",
        term: "Topic 1",
        definition: "Main topic (80% of the content or more) or one of the main topics"
    },
    { 
        number: "2.6",
        term: "Topic 2",
        definition: "Secondary or equally important topic"
    },
    { 
        number: "2.7",
        term: "Topic 3",
        definition: "Third or equally important topic"
    },
    { 
        number: "2.8",
        term: "Theme",
        definition: "Specific theme of the EA. It is usually narrower than a topic and may relate to multiple topics simultaneously. For complex or polythematic EAs that characterise a territory across all major topics, the name of the territory should be specified"
    },
    { 
        number: "2.9",
        term: "Spatial Ontology of Objects",
        definition: "Origin and nature of the objects and phenomena constituting the EA's main content",
        nested: [
            { term: "", category: "Earth Objects & Phenomena", definition: "Real-world Earth objects and phenomena" },
            { term: "", category: "Space Objects & Phenomena", definition: "Real-world space (extraterrestrial) objects and phenomena" },
            { term: "", category: "Fictional World Objects & Phenomena", definition: "Objects and phenomena belonging to fictional worlds" },
            { term: "", category: "Fictional Objects & Phenomena of the Real World", definition: "Fictional objects and phenomena georeferenced to real-world geography" },
            { term: "", category: "Abstract Concepts", definition: "Abstract and non-material ideas and concepts" }
        ] 
    },
    { 
        number: "2.10",
        term: "Geospatial Reference",
        definition: "Source data used to create the EA representations and visualizations are geospatially referenced"
    },
     { 
        number: "2.11",
        term: "Spatial Coverage",
        definition: "Spatial coverage level of the EA thematic content. For countries and their administrative units, classification is based on political boundaries rather than area size. This field is only used for Earth Objects & Phenomena",
        nested: [
            { term: "", category: "World", definition: "" },
            { term: "", category: "Continental/Oceanic", definition: "Antarctica, Arctic, Asia, Africa, Australia and Oceania, Europe, North America, South America" },
            { term: "", category: "Regional", definition: "Territories of several countries of any size" },
            { term: "", category: "Country/Sea", definition: "" },
            { term: "", category: "Sub-regional", definition: "Regions of countries (NUTS-1)" },
            { term: "", category: "Local", definition: "Provinces and districts of countries (NUTS-2 and NUTS-3)" },
            { term: "", category: "Municipal/Site-specific", definition: "Individual cities and agglomerations, and all other smaller objects" }
        ] 
    },
    { 
        number: "2.12",
        term: "Region",
        definition: "Spatial coverage of the EA thematic content. This field is only used for Earth Objects & Phenomena",
        nested: [
            { term: "", category: "World", definition: "" },
            { term: "", category: "Antarctica", definition: "" },
            { term: "", category: "Africa", definition: "" },
            { term: "", category: "North America", definition: "" },
            { term: "", category: "Latin America and the Caribbean", definition: "" },
            { term: "", category: "Asia", definition: "" },
            { term: "", category: "Europe", definition: "" },
            { term: "", category: "Oceania", definition: "" },
            { term: "", category: "Arctic Ocean", definition: "" },
            { term: "", category: "Atlantic Ocean", definition: "" },
            { term: "", category: "Indian Ocean", definition: "" },
            { term: "", category: "Pacific Ocean", definition: "" },
            { term: "", category: "Southern Ocean", definition: "" },
            { term: "", category: "Multiple regions", definition: "Covers more than one region and cannot be assigned to a single regional category" }

        ] 
    },
    { 
        number: "2.13",
        term: "Territory",
        definition: "Name of the specific geographic or administrative area covered by the atlas"
    },
      { 
        number: "2.14",
        term: "Content Spatiality",
        definition: "Classification of EAs based on the combination of the Geospatial Reference attribute and the predominant form (unit) of content representation",
        nested: [
            { term: "", category: "Cartographic", definition: "Maps and map-like representations constitute the primary content of the EA and are based on geospatially referenced data" },
            { term: "", category: "Geospatial", definition: "Mixed georeferenced content predominates, which is neither cartographic nor graphical" },
            { term: "", category: "Spatial", definition: "Maps and spatial visualizations constitute the primary content of the EA but are based on non-spatial data ('non-geographic constructed spaces' (Kinberger, 2010))" },
            { term: "", category: "Graphical", definition: "Graphical content (e.g., charts and diagrams) predominates in the atlas. The geospatial reference of the underlying data is not taken into account" }
        ] 
    },
    { 
        number: "2.15",
        term: "Temporal Scope",
        definition: "Temporal scope of the EA content",
        nested: [
            { term: "", category: "Current", definition: "Data for 2000–2025 only" },
            { term: "", category: "Historical", definition: "Includes pre-2000 data and historical dynamics" },
            { term: "", category: "Forecast", definition: "Includes post-2025 or forecast data" },
            { term: "", category: "Current & Historical", definition: "Combination of current and historical content" },
            { term: "", category: "Current & Forecast", definition: "Combination of current and forecast data" },
            { term: "", category: "Multi-temporal", definition: "Includes all three temporal dimensions" }
        ] 
    },
    { 
        number: "2.16",
        term: "AI-generated Content",
        category: "Yes/No",
        definition: "Presence of any AI-generated content, regardless of its proportion"
    },
    { 
        number: "2.17",
        term: "Regular Updates",
        category: "Yes/No",
        definition: "EA provides for regular content updates. Infrequent releases (less than once a year) do not count"
    },
    { 
        number: "2.18",
        term: "Data Catalogue",
        category: "Yes/No",
        definition: "Presence of a local data directory or data directory separated into a distinct section. The catalogue should be in the form of an attribute table or an interactive interface, and the data must be available for direct download from the EA"
    },
    { 
        number: "2.19",
        term: "Story-centred Content",
        category: "Yes/No",
        definition: "All components of the EA serving to unfold or analyse (explicit) stories"
    },

    { number: "3", term: "Media-Cartographic Attributes", isSection: true },
    { number: "3.1", term: "General Information", isSection: true, group: "general" },

    { 
        number: "3.1.1",
        term: "Status",
        definition: "Current operational status of the EA, indicating whether it is actively maintained, archived, or no longer functional",
        nested: [
            { term: "", category: "Active", definition: "EA is fully functional and is actively maintained and updated" },
            { term: "", category: "Archived", definition: "EA remains fully or partially functional but is no longer the current version and is no longer maintained or updated" },
            { term: "", category: "Inactive", definition: "EA has ceased to exist. A desktop application no longer runs on modern operating systems, or the website of an online atlas has been removed and is no longer accessible" },
            { term: "", category: "Replaced", definition: "Older version of the atlas that has been replaced by a newer version of the website, which remains active" }
        ] 
    },

    { 
        number: "3.1.2",
        term: "Metaconcept ",
        definition: "Name of the EA metaconcept. A metaconcept is defined by one or more characteristics or functions that, together with a specific implementation of the interface, navigation, content representation, and functionality, form the distinctive overall appearance of EAs and their usage style",
        nested: [
            { term: "", category: "Electronic reproduction", definition: "Websites or applications that reproduce the content and concept of PAs in a digital form" },
            { term: "", category: "Collection of maps/modules", definition: "Multi-page websites or applications in which maps or representation modules are presented on separate pages" },
            { term: "", category: "Cartographic atlas application", definition: "Single-page or pseudo-single-page applications with a single map-based interface. Their purpose is to visually explore territories and themes through maps with a focus on traditional cartographic principles" },
            { term: "", category: "Visualization atlas", definition: "Multi-page websites or single-page applications “aimed at explaining and supporting exploration of data about a dedicated topic through data, visualisations and narration” (Wang et al., 2025, p. 437)" },
            { term: "", category: "Narrative atlas", definition: "Websites or applications that tell spatially referenced stories or systematically present themes in a story format" },
            { term: "", category: "Encyclopedia", definition: "Multi-page websites composed of a collection of articles or profiles" },
            { term: "", category: "Organizational mechanism", definition: "Websites or applications that organise and link heterogeneous content through a centralised map interface" },
            { term: "", category: "Geoportal", definition: "Collections of tools and services designed for the rapid search, viewing, download, and management of geospatial (meta)data" },
            { term: "", category: "Map viewer", definition: "Single-page applications with a single map-based interface designed for user-driven search, viewing, and combining layers to “produce maps”" }
        ] 
    },

    { 
        number: "3.1.3",
        term: "Metaconcept Type",
        definition: "Type of the EA within a specific metaconcept. A metaconcept is defined by one or more characteristics or functions that, together with a specific implementation of the interface, navigation, content representation, and functionality, form the distinctive overall appearance of EAs and their usage style",
        nested: [
            { term: "", category: "Facsimile", definition: "Display digitised pages of paper atlases within a multimedia shell" },
            { term: "", category: "Static HTML", definition: "Collection of static HTML pages whose layout and structure replicate paper atlases. The content is presented in the form of articles, where the map often occupies only a small portion of the space" },
            { term: "", category: "Set of Maps", definition: "Mechanical collection of non-coherent maps that share only a common theme " },
            { term: "", category: "Compilation of Maps", definition: "Feature a coherent map language and visual design, with their content presented as a series of maps or modules" },
            { term: "", category: "Combination of Maps", definition: "Emphasises close connectivity between maps or modules, achieved through network organisation and/or contextual navigation" },
            { term: "", category: "Data Visualizer", definition: "Encompass single-page applications, where maps and interactive visualisations are the primary types of data visualisation. The availability of attribute data tables, charts and/or diagrams, and data sorting and filtering functionality is critical" },
            { term: "", category: "Compendium of Vis. Modules", definition: "Multi-page websites or applications that consist of a multitude of visualisation modules in which maps are not the dominant visualisation type. Each module has a nonlinear navigation metamodel and interactive content" },
            { term: "", category: "Collection of Profiles", definition: "Multi-page websites composed of profiles or reports (Wang et al., 2025). All profiles are uniform in terms of layout, structure, and content representation. They repeatedly characterise different territories according to fixed indicators. Each profile is structured as a sequence of diagrams, tables, and other interactive" },
            { term: "", category: "Collection of Articles", definition: "Multi-page websites where separate articles serve as the primary type of representation. Maps and other media are embedded" },
            { term: "", category: "Storypedia", definition: "Multi-page applications that feature a sequential scroller-based structure to explore each theme through a combination of text with maps or infographics. Storypaedias are distinguished by their embedded layout, the non-mandatory presence of maps, longform page presentation, and storytelling techniques" },
            { term: "", category: "Directory", definition: "Websites designed for browsing a hierarchy, searching, and retrieving metadata or summary information about objects or phenomena of a given class (i.e., instances of the EA’s primary object). The retrieved objects are characterised by profiles with brief technical descriptions, classification tables, and maps used" }
        ] 
    },

     { 
        number: "3.1.4",
        term: "Metaconcept 2",
        definition: "Name of the second metaconcept. The second metaconcept can be identified within multi-page EAs comprising various sections "
    },
    { 
        number: "3.1.5",
        term: "Metaconcept 2 Type",
        definition: "Type of the EA within the second metaconcept"
    },
    { 
        number: "3.1.6",
        term: "Method of Page Presentation",
        definition: "Method of page presentation (Krakovskyi & Kurach, 2025)",
        nested: [
            { term: "", category: "Single-page", definition: "EAs consist of a single screen and function on a single webpage, which does not reload during the entire session" },
            { term: "", category: "Pseudo-single-page", definition: "EAs may comprise multiple screens and pages; however, EAs still display the core thematic content within a single screen. In addition, single-screen EAs whose pages reload" },
            { term: "", category: "Multi-page", definition: "Multi-page EAs distribute content across distinct pages, a characteristic they share with paper atlases" }
        ] 
    },
     { 
        number: "3.1.7",
        term: "Map-Vis Section Implementation",
        definition: "Classification of EAs by the composition of non-cartographic and map-based/visualisation sections",
        nested: [
            { term: "", category: "Map-Vis Section", definition: "EA consists of a single map-based or visualisation interface, or a set of uniform pages containing maps, map modules, or visualisations" },
            { term: "", category: "Several Map-Vis Sections", definition: "EA consists of multiple map-based/visualisation interfaces (screens)" },
            { term: "", category: "Non-Map Sections", definition: "EA consists of pages in which maps or visualisations are not the dominant type of representation" },
            { term: "", category: "Non-Map Sections+One Map-Vis Section", definition: "EA combines pages in which maps or visualisations are not the dominant type of representation with a single map-based/visualisation section" },
            { term: "", category: "Non-Map Sections+Several Map-Vis Sections", definition: "EA combines pages in which maps or visualisations are not the dominant type of representation with multiple map-based/visualisation sections" }
        ] 
    },
    { 
        number: "3.1.8",
        term: "Atlas Focus",
        definition: "Central focus of the EA, which influences the design of all other components",
        nested: [
            { term: "", category: "Theme", definition: "EA is focused on representation and on complex thematic plots, emphasizing the explanation of facts, memorable visual imagery, storytelling, a synthesis of topography and thematic content, and multimedia. Attribute information plays a supporting role" },
            { term: "", category: "Data", definition: "Data analysis and/or the provision of statistical information are central to an EA. Maps and visualizations serve an instrumental role by simplifying the understanding of key patterns in data distribution or acting as an interface to the data and supplementary visualizations. This group also includes EAs whose cartographic representation is limited to a monotonous visualization of datasets"}
        ] 
    },

    { 
        number: "3.1.9",
        term: "Usage Style",
        definition: "Characteristic manner by which the EA is intended to be employed, reflecting patterns of interaction",
        nested: [
            { term: "", category: "Reading & Localization", definition: "EA is designed for gradual reading of the content. Maps are not the primary type of representation and are generally used to localize phenomena described in the text or story. The interactivity of the content is low" },
            { term: "", category: "Viewing & Comparison", definition: "Spatial component (maps) is the main focus. EAs of this type are designed for the visual analysis and comparison of maps and geovisualisations without advanced interactive functions" },
            { term: "", category: "Interaction & Analysis", definition: "These EAs involve more active user participation in manipulating the content by selecting attributes, applying filters, and changing the symbolisation"}
        ] 
    },

    { 
        number: "3.1.10",
        term: "Target Audience",
        definition: "Determined according to the maximum functionality provided, as each EA may potentially target multiple user groups. Thematic complexity is assessed based on the complexity of the theme, the terminology used, and the depth of thematic coverage",
        nested: [
            { term: "", category: "General Public", definition: "Users without specialized knowledge" },
            { term: "", category: "GIS-literate Amateurs", definition: "Users possessing GIS skills or basic GIS literacy" },
            { term: "", category: "Domain Specialists", definition: "Specialists in the thematic domain without substantial GIS knowledge" },
            { term: "", category: "Domain Specialists with GIS Skills", definition: "Specialists in the thematic domain with advanced GIS skills"}
        ] 
    },

    { 
        number: "3.1.11",
        term: "Inclusiveness",
        definition: "Degree of EA support for users with disabilities",
        nested: [
            { term: "", category: "None", definition: "EA does not provide inclusive support options" },
            { term: "", category: "Partial", definition: "EA includes certain inclusive options" },
            { term: "", category: "Full", definition: "EA supports users with visual impairments and physical disabilities"}
        ] 
    },

    { 
        number: "3.1.12",
        term: "User Guidance",
        definition: "Availability of materials and tools that help users learn how to use the EA. EA descriptions and methodological materials are not counted",
        nested: [
            { term: "", category: "None", definition: "No help or guidance materials" },
            { term: "", category: "Help Document", definition: "Help in the form of a separate article or document, which may contain illustrations" },
            { term: "", category: "Video Tutorials", definition: "One or a series of instructional videos" },
            { term: "", category: "Guided Tour", definition: "Interactive introduction to the interface and its main functions" },
            { term: "", category: "Hybrid", definition: "Combination of two or more help and guidance methods"}
        ] 
    },

    { number: "3.2", term: "Interface", isSection: true, group: "interface" },

    { 
        number: "3.2.1",
        term: "Interface Responsiveness",
        definition: "Adaptation of the EA interface to mobile devices and various screen sizes",
        nested: [
            { term: "", category: "None", definition: "Not adapted for convenient use" },
            { term: "", category: "Partial", definition: "Some interface elements or pages are adapted, but the layout remains inconvenient on certain screens or sections" },
            { term: "", category: "Full", definition: "Layout and interface elements are fully adapted for mobile devices, providing a convenient user experience across screen sizes"}
        ] 
    },

    { 
        number: "3.2.2",
        term: "Layout Template",
        category: "Yes/No",
        definition: "One or several standardized, repetitive (template-based) layouts are used for thematic content representation"
    },

      { 
        number: "3.2.3",
        term: "Layout Pattern (Atlas Level)",
        definition: "Layout pattern for thematic content",
        nested: [
            { term: "", category: "No map", definition: "EA or non-cartographic section does not contain maps" },
            { term: "", category: "Fullmap", definition: "Map fills the entire screen" },
            { term: "", category: "Fragmented fixed", definition: "Screen is divided into frames/windows containing different content. The boundaries between the areas are clearly defined" },
            { term: "", category: "Fragmented floating", definition: "Screen is divided into frames/windows. The boundaries of the areas are blurred" },
            { term: "", category: "Embedded map", definition: "Map is embedded in the page. It does not dominate the interface, and its functionality is limited"}
        ] 
    },
    { 
        number: "3.2.4",
        term: "Layout Pattern (Map-Vis Level)",
        definition: "Layout pattern for a separate map-based/visualisation section (if available)",
        nested: [
            { term: "", category: "Fullmap", definition: "Map fills the entire screen" },
            { term: "", category: "Fragmented fixed", definition: "Screen is divided into frames/windows containing different content. The boundaries between the areas are clearly defined" },
            { term: "", category: "Fragmented floating", definition: "Screen is divided into frames/windows. The boundaries of the areas are blurred" },
            { term: "", category: "Embedded map", definition: "Map is embedded in the page. It does not dominate the interface, and its functionality is limited"}
        ] 
    },
    { 
        number: "3.2.5",
        term: "Map Area Ratio (Atlas Level)",
        definition: "Proportion of screen space occupied by the map in thematic sections",
        nested: [
            { term: "", category: "No map", definition: "EA or non-cartographic section does not contain maps" },
            { term: "", category: "Low", definition: "Map occupies less than 40% of the screen" },
            { term: "", category: "Moderate", definition: "Map occupies 40-60% of the screen" },
            { term: "", category: "Substantial", definition: "Map occupies 61-90% of the screen" },
            { term: "", category: "Full", definition: "Map occupies more than 90% of the screen"}
        ] 
    },
    { 
        number: "3.2.6",
        term: "Map Area Ratio (Map-Vis Level)",
        definition: "Proportion of screen space occupied by the map in separate map-based/visualisation section (if available)",
        nested: [
            { term: "", category: "Low", definition: "Map occupies less than 40% of the screen" },
            { term: "", category: "Moderate", definition: "Map occupies 40-60% of the screen" },
            { term: "", category: "Substantial", definition: "Map occupies 61-90% of the screen" },
            { term: "", category: "Full", definition: "Map occupies more than 90% of the screen"}
        ] 
    },
    { 
        number: "3.2.7",
        term: "Layout Flexibility",
        definition: "Level of layout customisation available. Determined by the Map-Vis section (based on the maximum implementation)",
        nested: [
            { term: "", category: "None", definition: "No layout options" },
            { term: "", category: "Basic", definition: "Expansion/collapse of panels, sidebars, and windows" },
            { term: "", category: "Intermediate", definition: "At least some interface elements — primarily information panels, legend windows, or tables — can be moved and resized" },
            { term: "", category: "Advanced", definition: "Full layout recomposition is possible, including moving and locking all interface elements, as well as adding or removing windows" },
            { term: "", category: "Full", definition: "Every interface element can be customized"}
        ] 
    },

    { 
        number: "3.2.8",
        term: "Thematic Design",
        definition: "Degree to which the interface design corresponds to the EA theme",
        nested: [
            { term: "", category: "None", definition: "No thematic design" },
            { term: "", category: "Partial", definition: "Color palette, header, and background elements are adapted to the EA theme" },
            { term: "", category: "Full", definition: "Specially designed interface with thematic stylization applied to most interface elements"}
        ] 
    },

    { number: "3.3", term: "Information Architecture & Navigation", isSection: true, group: "navigation" },

    { 
        number: "3.3.1",
        term: "Main Information Unit",
        definition: "Information unit used to represent the primary EA representation type",
        nested: [
            { term: "", category: "Layer/Indicator", definition: "Single-page interface in which information is organized into separate analytical layers/indicators" },
            { term: "", category: "Map-Vis", definition: "Single-page interface presenting ready-made maps/visualizations, or a multi-page atlas in which all thematic pages are occupied by ready-made maps/visualizations" },
            { term: "", category: "Page", definition: "EA consists of multiple pages with diverse content"}
        ] 
    },
    { 
        number: "3.3.2",
        term: "Number of Content Pages",
        definition: "Number of pages containing unique thematic content. Navigational and landing or introductory pages are not included"
    },
    { 
        number: "3.3.3",
        term: "Content Hierarchy (Atlas Level)",
        definition: "Depth of the information architecture of the thematic content (number of hierarchical levels). Counted from the homepage. The content hierarchy of map-vis sections with a single-page interface in multi-page atlases is counted as one level",
        nested: [
            { term: "", category: "Shallow", definition: "1-2 levels" },
            { term: "", category: "Deep", definition: "More than 2 levels" }
        ] 
    },
     { 
        number: "3.3.4",
        term: "Content Hierarchy (Map-Vis Level)",
        definition: "Depth of the information architecture of the thematic content (number of hierarchical levels). Counted by the map/visualisation section (if available)",
        nested: [
            { term: "", category: "Shallow", definition: "1-2 levels" },
            { term: "", category: "Deep", definition: "More than 2 levels" }
        ] 
    },
    { 
        number: "3.3.5",
        term: "Content Classifications",
        definition: "Number of supported content classifications. Map or Content Index are not counted",
        nested: [
            { term: "", category: "One Classification", definition: "Only one content classification is used" },
            { term: "", category: "One Classification+Filter", definition: "One content classification supplemented with sorting and/or filtering functions" },
            { term: "", category: "Several Classifications", definition: "Multiple classification for organizing the same content are used" },
            { term: "", category: "Several Classifications+Filter", definition: "Multiple content classifications supplemented with sorting and/or filtering functions" }
        ] 
    },
    { 
        number: "3.3.6",
        term: "Subjective Organisation Scheme",
        category: "Yes/No",
        definition: "Thematic content is classified according to subjective criteria (Rosenfeld et al., 2015). An objective scheme is based on alphabetical order or geographical area"
    },

    { 
        number: "3.3.7",
        term: "Organisational Structure (Atlas Level)",
        definition: "Defines the method of organization and relationships between the main information units of the EA. Counted from the homepage",
        nested: [
            { term: "", category: "Sequential", definition: "Content unfolds step-by-step, with each subsequent topic building upon the previous one" },
            { term: "", category: "Horizontal", definition: "All content elements are placed at the one hierarchical level (no hierarchy)" },
            { term: "", category: "Hub & Spoke", definition: "Several independent sequential nodes extend from a common center (hub), usually represented by the homepage" },
            { term: "", category: "Hierarchical", definition: "Content is divided into several hierarchical nodes with parent–child relationships" },
            { term: "", category: "Polyhierarchical", definition: "Type of hierarchical structure in which one node may have multiple parent nodes, allowing it to simultaneously belong to several sections/subsections" },
            { term: "", category: "Matrix", definition: "Connections between nodes are organized along at least two dimensions. Suitable for representing parallel narratives" },
            { term: "", category: "Network", definition: "Set of interconnected nodes without fixed levels or sequence. Each node may have any number of connections" },
            { term: "", category: "Hybrid", definition: "Combination of several organizational structures in which identifying a primary structure is not achievable" }
        ] 
    },
     { 
        number: "3.3.8",
        term: "Organisational Structure (Map-Vis Level)",
        definition: "Defines the method of organization and relationships between the main information units of the EA. Counted by the map/visualisation section (if available)",
        nested: [
            { term: "", category: "Sequential", definition: "Content unfolds step-by-step, with each subsequent topic building upon the previous one" },
            { term: "", category: "Horizontal", definition: "All content elements are placed at the one hierarchical level (no hierarchy)" },
            { term: "", category: "Hub & Spoke", definition: "Several independent sequential nodes extend from a common center (hub), usually represented by the homepage" },
            { term: "", category: "Hierarchical", definition: "Content is divided into several hierarchical nodes with parent–child relationships" },
            { term: "", category: "Polyhierarchical", definition: "Type of hierarchical structure in which one node may have multiple parent nodes, allowing it to simultaneously belong to several sections/subsections" },
            { term: "", category: "Matrix", definition: "Connections between nodes are organized along at least two dimensions. Suitable for representing parallel narratives" },
            { term: "", category: "Network", definition: "Set of interconnected nodes without fixed levels or sequence. Each node may have any number of connections" },
            { term: "", category: "Hybrid", definition: "Combination of several organizational structures in which identifying a primary structure is not achievable" }
        ] 
    },

    { 
        number: "3.3.9",
        term: "Navigation Metamodel",
        definition: "Metamodel for organizing transitions between EA information units (content)",
        nested: [
            { term: "", category: "User-driven (Non-linear)", definition: "User should select the information unit (content) to view independently" },
            { term: "", category: "Author-driven (Linear)", definition: "Transitions between information units (content) is exclusively linear, with the sequence determined by the EA authors" },
            { term: "", category: "Hybrid", definition: "Combination of both navigation metamodels" }
        ] 
    },
    { 
        number: "3.3.10",
        term: "Contextual Navigation",
        category: "Yes/No",
        definition: "Connects related information units regardless of their position within the organizational structure of the EA. Implemented through internal, external, and inter-links"
    },
    { 
        number: "3.3.11",
        term: "Inter-content Navigation",
        category: "Yes/No",
        definition: "Type of contextual navigation. It involves links to other related elements of the EA content (other maps, articles, etc.)"
    },
    { 
        number: "3.3.12",
        term: "Detached Navigation",
        definition: "Detached navigation is independent of the primary navigation model and is typically located on a dedicated navigation page. It provides an overview of the EA structure and/or alternative access to its information units",
        nested: [
            { term: "", category: "None", definition: "" },
            { term: "", category: "Index", definition: "Alphabetical or geographical list of links to a defined set of information units (e.g., indicators, geographic features, authors, terms, keywords, or tags)" },
            { term: "", category: "Catalog", definition: "List of links in which information unit is characterized by several attributes and can be sorted and/or filtered by those attributes" },
            { term: "", category: "Sitemap", definition: "Provides an overview of and/or access to top-level EA nodes (typically within the first one to three hierarchy levels). It may be located in a navigation page, a modal window, a mega menu, or the footer" },
            { term: "", category: "Map", definition: "Map functions as the alternative gateway to the content" },
            { term: "", category: "TOC", definition: "Provides an overview of and/or access to top-level content sections of the EA (typically within the first one to three hierarchy levels). It may be located in a navigation page, a modal window, a mega menu, or the footer" },
            { term: "", category: "Hybrid", definition: "Combination of several detached navigation models" }
        ] 
    },
    { 
        number: "3.3.13",
        term: "Main Navigation Mechanism (Atlas Level)",
        definition: "Set of links and interface elements that provide access to information units (thematic content). Corresponds to global navigation",
        nested: [
            { term: "", category: "Slide/Scroll", definition: "Horizontal scrolling or a slider" },
            { term: "", category: "Linear Wizard", definition: "Multi-step user interface that forces a user to complete sequential steps in a strictly rigid order. Usually involves selecting a number of attributes from drop-down lists" },
            { term: "", category: "Hierarchical lists", definition: "Lists with one or more hierarchical levels" },
            { term: "", category: "Tree menu", definition: "Hierarchical navigation interface with expandable/collapsible nodes and parent–child relationships that enables interactive exploration of nested content" },
            { term: "", category: "Menu bar/Tabs", definition: "Series of aligned buttons (with drop-down menus)" },
            { term: "", category: "Index", definition: "Alphabetical or geographical list of links to a defined set of information units (e.g., indicators, geographic features, authors, terms, keywords, or tags)" },
            { term: "", category: "Graphic menu", definition: "Interactive access interface where the EA content is represented as a graphical visualization (e.g., sunburst, circular treemap, etc.)" },
            { term: "", category: "Map", definition: "Map functions as the primary gateway to the content" },
            { term: "", category: "Image grid", definition: "Grid-based collection of image thumbnails with captions, where each item provides access to a specific information unit (content element)" }
        ] 
    },
    { 
        number: "3.3.14",
        term: "Main Navigation Mechanism (Map-Vis Level)",
        definition: "Set of links and interface elements that provide access to information units (thematic content) within detached map/visualization sections (if available)",
        nested: [
            { term: "", category: "Slide/Scroll", definition: "Horizontal scrolling or a slider" },
            { term: "", category: "Linear Wizard", definition: "Multi-step user interface that forces a user to complete sequential steps in a strictly rigid order. Usually involves selecting a number of attributes from drop-down lists" },
            { term: "", category: "Hierarchical lists", definition: "Lists with one or more hierarchical levels" },
            { term: "", category: "Tree menu", definition: "Hierarchical navigation interface with expandable/collapsible nodes and parent–child relationships that enables interactive exploration of nested content" },
            { term: "", category: "Menu bar/Tabs", definition: "Series of aligned buttons (with drop-down menus)" },
            { term: "", category: "Graphic menu", definition: "Interactive access interface where the EA content is represented as a graphical visualization (e.g., sunburst, circular treemap, etc.)" },
            { term: "", category: "Map", definition: "Map functions as the primary gateway to the content" },
            { term: "", category: "Image grid", definition: "Grid-based collection of image thumbnails with captions, where each item provides access to a specific information unit (content element)" }
        ] 
    },
    { 
        number: "3.3.15",
        term: "Structure Overview on Any Screen",
        category: "Yes/No",
        definition: "Each page includes a global navigation menu showing at least two levels of hierarchy (or a top-level in cases of EAs with shallow content hierarchy). In single-page EAs, top-level content hierarchy should be accessible in every view"
    },
     { 
        number: "3.3.16",
        term: "Content Search",
        category: "Yes/No",
        definition: "Global search across EA content or search within the table of contents"
    },
    { 
        number: "3.3.17",
        term: "Search on Map",
        category: "Yes/No",
        definition: "Geographic or thematic search on map"
    },

    { number: "3.4", term: "Content Representation", isSection: true, group: "representation" },

    { 
        number: "3.4.1",
        term: "Main Representation Type",
        definition: "Primary (predominant) type of representation in the EA. A type of representation is a composition of representational units (individual texts, graphs, maps, etc.)",
        nested: [
            { term: "", category: "Articles", definition: "Text prevails, and the content is designed for reading. Articles may be text-only or include multimedia and embedded maps" },
            { term: "", category: "Maps/Map Modules", definition: "Maps or representation modules in which the map is the primary unit of representation" },
            { term: "", category: "Infographics", definition: "Graphic representations and diagrams combined with text predominate. Content interactivity is low or absent" },
            { term: "", category: "Interactive Visualisations", definition: "Interactive graphics, diagrams, and other non-geospatial visualisations predominate" },
            { term: "", category: "Profiles", definition: "All profiles are uniform in their layout, structure, and content representation. They repeatedly characterise different territories or atlas main objects according to fixed indicators" },
            { term: "", category: "Multimedia Collections", definition: "Content largely includes images, audio, and video" }
        ] 
    },
    { 
        number: "3.4.2",
        term: "Static Paper Atlas Content",
        category: "Yes/No",
        definition: "Content from the associated paper atlas is used in the form of static raster images"
    },
    { 
        number: "3.4.3",
        term: "Scroll-based Representation",
        category: "Yes/No",
        definition: "Scrollable pages are the main form of EA content presentation"
    },
    { 
        number: "3.4.4",
        term: "Storytelling Techniques",
        category: "Yes/No",
        definition: "At least two of the four storytelling techniques (Roth, 2021) – Mood, Attention, Metaphor and Voice – should be used. These techniques distinguish the traditional style from the narrative style"
    },
    { 
        number: "3.4.5",
        term: "Only Map-Linked Content",
        category: "Yes/No",
        definition: "All non-cartographic content is linked exclusively to maps or to map modules"
    },
    { 
        number: "3.4.6",
        term: "Combination of Representation Units",
        category: "Yes/No",
        definition: "Several representation units are displayed on a single screen and at the same interface level. Content in popup windows is not taken into account"
    },
    { 
        number: "3.4.7",
        term: "Narrative Texts",
        category: "Yes/No",
        definition: "Presence of comprehensive texts that explain and supplement the representations or are independent units. Brief formal descriptions of indicators are not counted"
    },
    { 
        number: "3.4.8",
        term: "Interactive Tables",
        category: "Yes/No",
        definition: "Presence of interactive tables"
    },
    { 
        number: "3.4.9",
        term: "Charts and Diagrams",
        category: "Yes/No",
        definition: "Presence of both static and interactive. Charts/diagrams as elements of map methods is not taken into account"
    },
    { 
        number: "3.4.10",
        term: "Images",
        category: "Yes/No",
        definition: "Raster static maps used for illustrative purposes are excluded from the image count. Interface icons, logos, background and other decorative interface images are not counted"
    },
    { 
        number: "3.4.11",
        term: "Audio",
        category: "Yes/No",
        definition: "Raster static maps are not counted as images"
    },
    { 
        number: "3.4.12",
        term: "Video",
        category: "Yes/No",
        definition: "Embedded YouTube videos count. Tutorial videos and intro videos do not count"
    },
    { 
        number: "3.4.13",
        term: "Animation",
        category: "Yes/No",
        definition: "Ordered sequence of frames that is automatically and sequentially played to create the perception of movement and/or change for the user. Camera movement animations (e.g. Fly-Through) are also counted. Decorative animation іs not taken into account"
    },
    { 
        number: "3.4.14",
        term: "Map Concept",
        category: "Yes/No",
        definition: "EA’s primary concept of cartographic information presentation. Follows the framework proposed by Resch & Jordan (2001). Determined by the map/visualization sections (if available)"
    },
    { 
        number: "3.4.15",
        term: "Map Concept",
        definition: "EA’s primary concept of cartographic information presentation. Follows the framework proposed by Resch & Jordan (2001). Determined by the map/visualization sections (if available)",
        nested: [
            { term: "", category: "Restricted", definition: "Only one map can be viewed on a single screen (page). Maps are usually ready-made" },
            { term: "", category: "Restricted Flexible", definition: "Cartographic information is organised by maps. However, it is possible to combine specific maps or map layers" },
            { term: "", category: "Flexible", definition: "Cartographic information is organised into layers that can be combined and superimposed in any number on a shared basemap" },
            { term: "", category: "Hybrid", definition: "Separate set of maps and a separate set of layers are provided" }
        ] 
    },
    { 
        number: "3.4.15",
        term: "Map as Interface",
        category: "Yes/No",
        definition: "Map functions as an access mechanism to other content or to detailed information"
    },
    { 
        number: "3.4.16",
        term: "Map for Localisation Only",
        category: "Yes/No",
        definition: "Map is used only for the localisation of objects or phenomena. Also includes EAs whose maps depict the same indicator (typically for Profiles)"
    },
    { 
        number: "3.4.17",
        term: "Interactive Maps",
        definition: "Proportion of interactive maps in the EA",
        nested: [
            { term: "", category: "None", definition: "No interactive maps" },
            { term: "", category: "Partial", definition: "Interactive maps are combined with static maps" },
            { term: "", category: "Full", definition: "All maps are interactive"}
        ] 
    },
    { 
        number: "3.4.18",
        term: "Multi-layer Maps",
        category: "Yes/No",
        definition: "Presence of ready-made interactive maps consisting of a set of layers with a toggle (overlay) function. Left blank for non-interactive maps"
    },
    { 
        number: "3.4.19",
        term: "Main Style of Maps",
        definition: "Specifc manner of cartographic expression. Cohesive set of design characteristics and qualities of map. Map style is visually intuitive and immediately perceived by users",
        nested: [
            { term: "", category: "Traditional", definition: "Traditional style is based on the cartographic rules and techniques established in textbooks. The colour palettes are well-balanced, and the overall design is refined, academic, or authoritative (Muehlenhaus, 2014). The basemap and map labels are included" },
            { term: "", category: "Laconic", definition: "A limited number of map symbols. Balanced, low-contrast colour palettes. A grey or minimalistic basemap" },
            { term: "", category: "Expressive", definition: "Eye-catching, vivid symbolisation. Based on a traditional style" },
            { term: "", category: "Visualizational", definition: "Visualisation style is characterised by unprocessed GIS visualisations and visualisations that do not adhere to cartographic conventions. Among cartographically sound maps, at least two of the following requirements must be met: 1) the predominance of grid or raster methods, 2) a high-contrast colour palette, 3) exclusively choropleth maps, and 4) the absence of a basemap or the use of a contour map" },
            { term: "", category: "Antique", definition: "Style of ancient maps or the direct use of old maps" },
            { term: "", category: "Artistic", definition: "Original authorial expression. High level of decorativeness"}
        ] 
    },
    { 
        number: "3.4.20",
        term: "Web Mercator Projection Only",
        category: "Yes/No",
        definition: "Only Web Mercator projection is used. If the projection cannot be determined, it is not specified"
    },
    { 
        number: "3.4.21",
        term: "Globe",
        category: "Yes/No",
        definition: "Presence of a globe in any section and in any function"
    },
    { 
        number: "3.4.22",
        term: "Multi-scale Maps",
        category: "Yes/No",
        definition: "Presence of interactive maps with multiple generalization levels (scales). Left blank for non-interactive maps"
    },
    { 
        number: "3.4.23",
        term: "In-house Basemap",
        category: "Yes/No",
        definition: "Presence of basemaps created by the EA authors or created in the developers’ country. Left blank for non-interactive maps"
    },
    { 
        number: "3.4.24",
        term: "Basemap Implementation",
        definition: "Method of implementing the EA basemaps. Left blank for non-interactive maps",
        nested: [
            { term: "", category: "None", definition: "No basemap is used" },
            { term: "", category: "Basemap only", definition: "Basemap consists exclusively of ready-made basemaps" },
             { term: "", category: "Baselayers only", definition: "Basemap consists of individual base layers that the user can overlay" },
            { term: "", category: "Hybrid", definition: "Combination of ready-made basemaps and individual base layers"}
        ] 
    },
        { 
        number: "3.4.25",
        term: "Main Basemap Content",
        definition: "Level of detail and/or type of the primary EA basemap",
        nested: [
            { term: "", category: "None", definition: "No basemap is used" },
            { term: "", category: "Contour map", definition: "Only the outlines of land and/or administrative boundaries are represented" },
            { term: "", category: "Several geoelements", definition: "Represents 2-3 natural or artificial features, typically relief, hydrography and settlements" },
            { term: "", category: "Simplified Topographic Map", definition: "Relief, hydrography, settlements, transport routes, administrative boundaries are represented, but they are more selectively chosen and more generalised than on regular topographic maps" },
            { term: "", category: "Topographic map", definition: "" },
            { term: "", category: "Satellite Imagery", definition: ""}
        ] 
    },
    { 
        number: "3.4.26",
        term: "Multivariate Maps",
        category: "Yes/No",
        definition: "Presence of ready-made maps that represents two or more indicators on a single map by combining different map methods"
    },
    { 
        number: "3.4.27",
        term: "Monotonous Symbolisation",
        category: "Yes/No",
        definition: "Fewer than five mapping methods are used. The exception is the variety of visualisations within a single method.  The mapping methods are based on the Soviet tradition (Krakovskyi, 2025), which is closely aligned with the German-speaking cartographic school (Freitag, 1992): (Proportional) Symbol Maps, Localised Diagram Maps, Line Maps, Flow Maps, Isoline Maps, Dot Density Maps, Area Maps, Qualitative Chorochromatic maps, Quantitative Chorochromatic maps, Grid maps, Area Diagram Maps, Choropleth Maps, Dasymetric Maps, Cartograms, Bivariate Maps"
    },
    { 
        number: "3.4.28",
        term: "Legend Adaptability",
        definition: "Legend content is automatically updated by the system to match the current map view. Left blank for non-interactive maps",
        nested: [
            { term: "", category: "None", definition: "Static legend" },
            { term: "", category: "Quantitative", definition: "Number of legend indicators automatically changes according to the current map view" },
            { term: "", category: "Graphical", definition: "Graphical properties of legend symbols (e.g., transparency, size) automatically change according to the current map view" },
            { term: "", category: "Hybrid", definition: "Combination of quantitative and graphical adaptability"}
        ] 
    },
    { 
        number: "3.4.29",
        term: "Map Labels",
        definition: "Presence of map labels. Labels that appear as a result of interactions are not counted. Left blank for non-interactive maps",
        nested: [
            { term: "", category: "None", definition: "No labels are present" },
            { term: "", category: "Embedded in the Basemap", definition: "Labels are embedded in the ready-made basemap" },
            { term: "", category: "Individual layers", definition: "Labels are presented as separate layers that users can overlay" },
            { term: "", category: "Hybrid", definition: "Combination of embedded labels and individual layers"}
        ] 
    },
        { 
        number: "3.4.30",
        term: "Map Comparison",
        definition: "Available methods of map comparison",
        nested: [
            { term: "", category: "None", definition: "Map comparison is not available" },
            { term: "", category: "Internal", definition: "Comparison of maps/layers within a single map (single visualization window) using overlay and transparency and/or vertical or horizontal sliders" },
            { term: "", category: "External", definition: "Comparison of separate maps placed side by side in the table of contents and updated asynchronously, simulating an animation effect. Animation also falls into this category" },
            { term: "", category: "Separate Windows", definition: "Comparison of separate maps displayed in different visualization windows on the same screen" },
            { term: "", category: "Internal & External", definition: "Combination of internal and external comparison methods" },
            { term: "", category: "Internal & Separate Windows", definition: "Combination of internal comparison methods and separate windows mode" },
            { term: "", category: "External & Separate Windows", definition: "Combination of external comparison methods and separate windows mode" },
            { term: "", category: "Hybrid", definition: "Combination of all three comparison methods"}
        ] 
    },


    { number: "3.5", term: "Functionality", isSection: true, group: "functionality"  },

    { 
        number: "3.5.1",
        term: "Fully Functional",
        category: "Yes/No",
        definition: "All content elements can be opened. All interactive functions work properly"
    },
    { 
        number: "3.5.2",
        term: "Authorization",
        category: "Yes/No",
        definition: "Ability for regular users to create an account. Subscribing to notifications alone is not considered. Registration must provide users with additional functionality"
    },
    { 
        number: "3.5.3",
        term: "Main Map-Vis Interactivity",
        definition: "Interactivity of maps and visualisations is determined by 13 work interaction operators defined by Roth (2011, 2017): Pan, Zoom, Retrieve, Filter, Search, Calculate, Overlay, Underlay, Resymbolize, Reproject, Reexpress, Sequence, Arrangement. For EAs whose content consists exclusively of interactive visualisations, interactivity is determined by the following 10 operators: Pan, Zoom, Retrieve, Selection, Filter, Search, Resymbolize, Reexpress, Sequence, Arrangement. The most common interactivity is specified",
        nested: [
            { term: "", category: "None", definition: "0 operators" },
            { term: "", category: "Basic", definition: "0-4 operators (0-2 for interactive visualisations)" },
            { term: "", category: "Intermediate", definition: "5-7 operators (3-5 for interactive visualisations)" },
            { term: "", category: "Advanced", definition: "8-11 operators (5-8 for interactive visualisations)" },
            { term: "", category: "Full", definition: "12-13 operators (8-10 for interactive visualisations)"}
        ] 
    },
    { 
        number: "3.5.4",
        term: "Max Map-Vis Interactivity",
        definition: "Interactivity of maps and visualisations is determined by 13 work interaction operators defined by Roth (2011, 2017): Pan, Zoom, Retrieve, Filter, Search, Calculate, Overlay, Underlay, Resymbolize, Reproject, Reexpress, Sequence, Arrangement. For EAs whose content consists exclusively of interactive visualisations, interactivity is determined by the following 10 operators: Pan, Zoom, Retrieve, Selection, Filter, Search, Resymbolize, Reexpress, Sequence, Arrangement. The maximum recorded interactivity is specified",
        nested: [
            { term: "", category: "None", definition: "0 operators" },
            { term: "", category: "Basic", definition: "0-4 operators (0-2 for interactive visualisations)" },
            { term: "", category: "Intermediate", definition: "5-7 operators (3-5 for interactive visualisations)" },
            { term: "", category: "Advanced", definition: "8-11 operators (5-8 for interactive visualisations)" },
            { term: "", category: "Full", definition: "12-13 operators (8-10 for interactive visualisations)"}
        ] 
    },
    { 
        number: "3.5.5",
        term: "Map Legend Interactivity",
        definition: "Type of legend interactivity. Left blank for non-interactive maps",
        nested: [
            { term: "", category: "None", definition: "All legends are non-interactive" },
            { term: "", category: "Internal", definition: "Interactivity within the legend window (e.g., tooltips)" },
            { term: "", category: "External Unidirectional", definition: "Results of actions (e.g., filtering) in the legend are reflected on the map" },
            { term: "", category: "External Bidirectional", definition: "Interaction with map objects changes the legend display (e.g., highlighting the corresponding indicator class in the legend)" },
            { term: "", category: "Hybrid", definition: "Combination of several types of interactivity"}
        ] 
    },
    { 
        number: "3.5.6",
        term: "Modification of Map Symbolization. Left blank for non-interactive maps",
        category: "Yes/No",
        definition: "Users can change the map symbology (Resymbolize operator). Changes in transparency are not included"
    },
    { 
        number: "3.5.7",
        term: "Modification of Map Methods. Left blank for non-interactive maps",
        category: "Yes/No",
        definition: "Users can change the map methods (Reexpress operator)"
    },
    { 
        number: "3.5.8",
        term: "Content Import",
        category: "Yes/No",
        definition: "Users can upload their own content or data"
    },
    { 
        number: "3.5.9",
        term: "Content Export",
        category: "Yes/No",
        definition: "Users can download content or data"
    },
    { 
        number: "3.5.10",
        term: "Print Map",
        category: "Yes/No",
        definition: "Presence of Print Map function. The method and quality of implementation are not taken into account"
    }

];