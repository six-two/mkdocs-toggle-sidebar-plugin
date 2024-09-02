const setCombinedVisibility = (showNavigation, showTOC) => {
    // Navigation and TOC are merged so we just pick one of the values and trust them
    // @TODO: add support for combined bars in toggle-sidebar.js?
    let style = `
.mkdocs-toggle-sidebar-button {
    cursor: pointer;
    width: 1em;
    fill: darkgray;
    display: flex;
    margin-right: 5px;
}

/* Hide toggle button in mobile view */
@media screen and (max-width: 768px) {
    .wy-breadcrumbs > li.mkdocs-toggle-sidebar-container {
        display: none;
    }
}
`;
    if (!showNavigation) {
        // We can not hide the contents in mobile view, since then the hamburger menu would be empty
        style += `
@media screen and (min-width: 768px) {
    section.wy-nav-content-wrap {
        margin-left: 0px;
    }

    nav.wy-nav-side, div.rst-versions {
        display: none;
    }

    div.wy-nav-content {
        max-width: 1100px;
    }
}
`;
    }

    return style;
    
}

const addToggleButton = (toggleNavigation, toggleTOC) => {
    const toggleBtn = createDefaultToggleButton(toggleNavigation, toggleTOC);
    toggleBtn.title = "Toggle Navigation"; // There is only one real sidebar, so we use this name for consistency
    const li = document.createElement("li");
    li.className = "mkdocs-toggle-sidebar-container";
    li.append(toggleBtn);

    const titleElement = document.querySelector("ul.wy-breadcrumbs");
    if (titleElement) {
        titleElement.insertBefore(li, titleElement.firstChild);  
    } else {
        console.warn(TOGGLE_BUTTON_REFERENCE_ELEMENT_NOT_FOUND_WARNING);
    }
}

const registerKeyboardEventHandler = () => {
    // Native HTML key event handling
    document.addEventListener("keydown", (event => {
        if (coreEventListenerLogic(event.key)) {
            // event handled, stop propagation
            event.preventDefault();
            event.stopPropagation();
        }
    }));
}
