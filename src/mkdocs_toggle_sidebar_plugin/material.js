const setCombinedVisibility = (showNavigation, showTOC) => {
    let style = `
.mkdocs-toggle-sidebar-button {
    cursor: pointer;
    margin-right: 5px;
    margin-left: 1rem;
}

/*
Hide the button when on mobile (and menu us shown as hamburger menu anyways).
The exact max-width is taken from the styling of the 'body > header > nav > a' element
*/

@media screen and (max-width: 76.1875em) {
    .mkdocs-toggle-sidebar-button {
        display: none;
    }
}
`;
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
    const toggleBtn = createDefaultToggleButton(toggleNavigation, toggleTOC);
    toggleBtn.classList.add("md-icon");
  
    const titleElement = document.querySelector(".md-header__title");
    if (titleElement) {
        titleElement.parentNode.insertBefore(toggleBtn, titleElement.nextSibling);  
    } else {
        console.warn(TOGGLE_BUTTON_REFERENCE_ELEMENT_NOT_FOUND_WARNING);
    }
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
