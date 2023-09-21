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
