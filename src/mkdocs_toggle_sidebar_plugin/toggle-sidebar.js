(function() {
    const loadBool = (name, default_value) => {
        const value = localStorage.getItem(`TOGGLE_SIDEBAR_${name}`);
        if (value == null) {
            return default_value;
        } else {
            return value == "1";
        }
    }

    const saveBool = (name, value) => {
        localStorage.setItem(`TOGGLE_SIDEBAR_${name}`, value ? "1" : "0");
    }

    const toggleTableOfContents = () => {
        console.debug("Toggling table-of-contents sidebar");
        const isShown = loadBool("TOC", TOC_DEFAULT_PLACEHOLDER);
        setTocVisibility(!isShown);
        saveBool("TOC", !isShown);
    }

    const toggleNavigation = () => {
        console.debug("Toggling navigation sidebar");
        const isShown = loadBool("NAVIGATION", NAVIGATION_DEFAULT_PLACEHOLDER);
        setNavigationVisibility(!isShown);
        saveBool("NAVIGATION", !isShown);
    }

    // START OF INCLUDE
    // This gets replaced with the definitions of: 
    // - setTocVisibility(bool) -> void
    // - setNavigationVisibility(bool) -> void
    // - registerKeyboardEventHandler() -> void
    THEME_DEPENDENT_FUNCTION_DEFINITION_PLACEHOLDER
    // END OF INCLUDE

    // argument: string, returns true if the key was handled and the event should be marked as already handled
    const coreEventListenerLogic = (keyChar) => {
        if (keyChar === "t") {
            toggleTableOfContents();
            return true;
        } else if (keyChar === "m") {
            toggleNavigation();
            return true;
        } else if (keyChar === "b") {
            toggleNavigation();
            toggleTableOfContents();
            return true;
        } else {
            return false;
        }
    }

    window.addEventListener("load", () => {
        console.log("The mkdocs-toggle-sidebar-plugin is installed. It adds the following key bindings:\n T -> toggle table of contents sidebar\n M -> toggle navigation menu sidebar\n B -> toggle both sidebars (TOC and navigation)");
        registerKeyboardEventHandler();
        setTocVisibility(loadBool("TOC", TOC_DEFAULT_PLACEHOLDER));
        setNavigationVisibility(loadBool("NAVIGATION", NAVIGATION_DEFAULT_PLACEHOLDER));
    });
}());
