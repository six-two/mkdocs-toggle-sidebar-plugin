const setCombinedVisibility = (showNavigation, showTOC) => {
    let style = `
.mkdocs-toggle-sidebar-container {
    margin: auto 0;
}

.mkdocs-toggle-sidebar-button {
    cursor: pointer;
    width: 1.5em;
    padding-bottom: 2px;
}

.mkdocs-toggle-sidebar-button svg {
    fill: white;
}
`;

    if (!showTOC) {
        style += `
div.col-md-3 {
    display: none;
}

div.col-md-9 {
    max-width: 100%;
    flex-basis: 100%;
}
`;
    }

    if (!showNavigation) {
        style += `
ul.navbar-nav:nth-child(1) {
    display: none;
}
`
    }

    return style;
}

const addToggleButton = (toggleNavigation, toggleTOC) => {
    const toggleBtn = createDefaultToggleButton(toggleNavigation, toggleTOC);
    const li = document.createElement("li");
    li.className = "nav-item mkdocs-toggle-sidebar-container";
    li.append(toggleBtn);
  
    let titleElement = document.querySelector("#navbar-collapse > ul.nav.navbar-nav.ms-md-auto");
    if (!titleElement) {
        // This worked in older versions, but not anymore. Since the default check failed, maybe we are in an old version?
        titleElement = document.querySelector("#navbar-collapse > ul.nav.navbar-nav.ml-auto");
    }
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
