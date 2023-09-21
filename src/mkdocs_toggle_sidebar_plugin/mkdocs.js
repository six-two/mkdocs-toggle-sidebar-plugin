const setCombinedVisibility = (showNavigation, showTOC) => {
    let style = "";
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
