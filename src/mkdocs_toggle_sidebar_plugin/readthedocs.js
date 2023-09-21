const setTocVisibility = (visible) => {
    if (visible) {
        window.toggleSidebarStyle.innerHTML = "";
    } else {
        window.toggleSidebarStyle.innerHTML = `
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

// // For debugging add:
// div.wy-nav-content {
//     background: gray;
// }
    }
}

const setNavigationVisibility = (visible) => {
    // TOC and Navigation are merged / in one panel. So we just do nothing
    // setTocVisibility(visible);
}

const registerKeyboardEventHandler = () => {
    window.toggleSidebarStyle = document.createElement("style");
    document.head.appendChild(window.toggleSidebarStyle);
    // Native HTML key event handling
    document.addEventListener("keydown", (event => {
        if (coreEventListenerLogic(event.key)) {
            // event handled, stop propagation
            event.preventDefault();
            event.stopPropagation();
        }
    }));
}
