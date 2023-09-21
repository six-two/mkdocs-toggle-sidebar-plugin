const setCombinedVisibility = (showNavigation, showTOC) => {
    // Navigation and TOC are merged so we just pick one of the values and trust them
    // @TODO: add support for combined bars in toggle-sidebar.js?
    if (showNavigation) {
        return "";
    } else {
        return `
section.wy-nav-content-wrap {
    margin-left: 0px;
}

nav.wy-nav-side, div.rst-versions {
    display: none;
}

div.wy-nav-content {
    max-width: 1100px;
}
`;
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
