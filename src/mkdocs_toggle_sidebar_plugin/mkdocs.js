const setVisibility = (query_string, show) => {
    for (let element of document.querySelectorAll(query_string)) {
        element.style.display = show ? "" : "none";
    }
}

const setTocVisibility = (visible) => {
    setVisibility("div.col-md-3", visible);
    // Fix the page limitation when removing TOC
    const main_div = document.querySelector("div.col-md-9");
    main_div.style.maxWidth = visible ? "75%" : "100%";
    main_div.style.flexBasis = visible ? "75%" : "100%";
}

const setNavigationVisibility = (visible) => {
    setVisibility("ul.navbar-nav:nth-child(1)", visible);
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
