const setCombinedVisibility = (showNavigation, showTOC) => {
    let style = "";
    if (!showTOC) {
        style += `
div.md-sidebar.md-sidebar--secondary {
    display: none;
}
`;
    }

    if (!showNavigation) {
        style += `
div.md-sidebar.md-sidebar--primary {
    display: none;
}
`
    }

    return style;
}

const addToggleButton = (toggleNavigation, toggleTOC) => {
    const toggleBtn = document.createElement("div");
    toggleBtn.className = "mkdocs-toggle-sidebar-button md-icon";
    toggleBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M3 6h18v2H3V6m0 5h18v2H3v-2m0 5h18v2H3v-2Z"></path></svg>`;
    toggleBtn.title = "Toggle sidebar";
    toggleBtn.style = "cursor: pointer; margin-right: 5px; margin-left: 1rem;";
    toggleBtn.addEventListener("click", () => toggleVisibility(toggleNavigation, toggleTOC));
  
    const titleElement = document.querySelector(".md-header__title");
    titleElement.parentNode.insertBefore(toggleBtn, titleElement.nextSibling);  
}

const registerKeyboardEventHandler = () => {
    // Custom key handlers: SEE https://squidfunk.github.io/mkdocs-material/setup/setting-up-navigation/?h=key+bind#docsjavascriptsshortcutsjs
    keyboard$.subscribe(key => {
        if (key.mode === "global") {
            if (coreEventListenerLogic(key.type)) {
                // event handled, stop propagation
                key.claim();
            }
        }
    });
}
