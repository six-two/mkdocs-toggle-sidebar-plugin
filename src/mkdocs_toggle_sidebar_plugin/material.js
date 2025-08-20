const setCombinedVisibility = (showNavigation, showTOC) => {
    // Hide the button when on mobile (and menu us shown as hamburger menu anyways).
    // Uses the 60em threshold that is used for hiding the TOC, search bar, repo info (name + stars), etc

    let style = `
.mkdocs-toggle-sidebar-button {
    cursor: pointer;
    margin-right: 5px;
    margin-left: 1rem;
}

@media screen and (max-width: 60em) {
    .mkdocs-toggle-sidebar-button {
        display: none;
    }
}
`;
// The TOC has a different break point than the navigation.
// It can be seen on the nav.md-nav--secondary:nth-child(1) element (60em)
// If the screen is smaller, it is shown in the navigation section if you click the nested hamburger menu
if (!showTOC) {
    style += `
@media screen and (min-width: 60em) {
    div.md-sidebar.md-sidebar--secondary {
        display: none;
    }
}
`;
        }
        
    // We always have to show the navigation in mobile view, otherwise the hamburger menu is broken
    // In material for mkdocs's blog mode, navigation's class is '.md-sidebar--post', see #9
    // The exact width (76.1875em) is taken from the styling of the 'body > header > nav > a' element, I think
    if (!showNavigation) {
        style += `
@media screen and (min-width: 76.1875em) {
    div.md-sidebar.md-sidebar--primary, div.md-sidebar.md-sidebar--post {
        display: none;
    }
}
`;
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
