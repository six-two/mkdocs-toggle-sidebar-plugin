const setVisibility = (query_string, show) => {
    for (let element of document.querySelectorAll(query_string)) {
        element.style.display = show ? "block" : "none";
    }
}

const setTocVisibility = (visible) => {
    setVisibility("div.md-sidebar.md-sidebar--secondary", visible);
}

const setNavigationVisibility = (visible) => {
    setVisibility("div.md-sidebar.md-sidebar--primary", visible);
}

const registerKeyboardEventHandler = () => {
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
}
