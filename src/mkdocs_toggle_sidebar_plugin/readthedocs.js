const setVisibility = (query_string, show) => {
    for (let element of document.querySelectorAll(query_string)) {
        element.style.display = show ? "" : "none";
    }
}

const setTocVisibility = (visible) => {
    setVisibility("nav.wy-nav-side", visible);
    document.querySelector("div.wy-nav-content").style.maxWidth = visible ? "800px" : "1100px";
    document.querySelector("section.wy-nav-content-wrap").style.marginLeft = visible ? "300px" : "0px";
}

const setNavigationVisibility = (visible) => {
    // TOC and Navigation are merged / in one panel. So we just do nothing
    // setTocVisibility(visible);
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
