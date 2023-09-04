(function() {
    const defaultToc = TOC_DEFAULT_PLACEHOLDER;
    const defaultNavigation = NAVIGATION_DEFAULT_PLACEHOLDER;

    console.log(defaultToc, defaultNavigation);

    const toggleVisibility = (query_string, display_mode = "block") => {
        for (let element of document.querySelectorAll(query_string)) {
            if (element.style.display != "none") {
                element.style.display = "none"
            } else {
                element.style.display = display_mode
            }
        }
    }

    const toggleNavigation = () => {
        console.debug("Toggling navigation sitebar")
        toggleVisibility("div.md-sidebar.md-sidebar--primary", "block");
    }

    const toggleTableOfContents = () => {
        console.debug("Toggling table-of-contents sitebar")
        toggleVisibility("div.md-sidebar.md-sidebar--secondary", "block");
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
    })
}());
