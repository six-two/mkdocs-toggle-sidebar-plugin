const setCombinedVisibility = (showNavigation, showTOC) => {
    // Hide the button when everything it toggles is hidden anyways (and the menu is shown as hamburger menu).
    // The navigation sidebar collapses into the drawer (with the theme's own hamburger button) below 76.1875em.
    // The TOC column stays visible down to the 60em threshold (also used for hiding the search bar,
    // repo info (name + stars), etc), unless the theme's 'toc.integrate' feature moves the TOC inside
    // the navigation sidebar - then it collapses together with the navigation at 76.1875em.
    const toggleButtonMode = "TOGGLE_BUTTON_PLACEHOLDER";
    const tocIsIntegrated = TOC_IS_INTEGRATED_PLACEHOLDER;
    const canToggleTocColumn = (toggleButtonMode == "toc" || toggleButtonMode == "all") && !tocIsIntegrated;
    const buttonHideBreakpoint = canToggleTocColumn ? "60em" : "76.1875em";

    let style = `
.mkdocs-toggle-sidebar-button {
    cursor: pointer;
    margin-right: 5px;
    margin-left: 1rem;
}

@media screen and (max-width: ${buttonHideBreakpoint}) {
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
