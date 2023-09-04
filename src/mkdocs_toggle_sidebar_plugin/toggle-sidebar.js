(function() {
    const setVisibility = (query_string, show) => {
        for (let element of document.querySelectorAll(query_string)) {
            element.style.display = show ? "block" : "none";
        }
    }

    const loadBool = (name, default_value) => {
        const value = localStorage.getItem(`TOGGLE_SIDEBAR_${name}`);
        if (value == null) {
            return default_value;
        } else {
            return value == "1";
        }
    }

    const saveBool = (name, value) => {
        localStorage.setItem(`TOGGLE_SIDEBAR_${name}`, value ? "1" : "0");
    }

    const setTocVisibility = (visible) => {
        setVisibility("div.md-sidebar.md-sidebar--secondary", visible);
        saveBool("TOC", visible);
    }
    
    const setNavigationVisibility = (visible) => {
        setVisibility("div.md-sidebar.md-sidebar--primary", visible);
        saveBool("NAVIGATION", visible);
    }

    const toggleTableOfContents = () => {
        const isShown = loadBool("TOC", TOC_DEFAULT_PLACEHOLDER);
        setTocVisibility(!isShown)
    }

    const toggleNavigation = () => {
        console.debug("Toggling table-of-contents sitebar");
        const isShown = loadBool("NAVIGATION", NAVIGATION_DEFAULT_PLACEHOLDER);
        setNavigationVisibility(!isShown);
    }

    // Custom key handlers: SEE https://squidfunk.github.io/mkdocs-material/setup/setting-up-navigation/?h=key+bind#docsjavascriptsshortcutsjs
    keyboard$.subscribe(key => {
        if (key.mode === "global") {
            if (key.type === "t") {
                key.claim();
                toggleTableOfContents();
            } else if (key.type === "m") {
                key.claim();
                toggleNavigation();
            } else if (key.type === "b") {
                key.claim();
                toggleNavigation();
                toggleTableOfContents();
            }
        }
    });

    setTocVisibility(loadBool("TOC", TOC_DEFAULT_PLACEHOLDER));
    setNavigationVisibility(loadBool("NAVIGATION", NAVIGATION_DEFAULT_PLACEHOLDER));
}());
