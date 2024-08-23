(function() {
    const customDynamicStyle = document.createElement("style");
    document.head.appendChild(customDynamicStyle);


    const loadBool = (name, default_value) => {
        const value = localStorage.getItem(`TOGGLE_SIDEBAR_${name}`);
        if (value == null) {
            return default_value;
        } else {
            return value == "1";
        }
    }

    const loadNavigationState = () => loadBool("NAVIGATION", NAVIGATION_DEFAULT_PLACEHOLDER);
    const loadTocState = () => loadBool("TOC", TOC_DEFAULT_PLACEHOLDER);

    const saveBool = (name, value) => {
        localStorage.setItem(`TOGGLE_SIDEBAR_${name}`, value ? "1" : "0");
    }

    const toggleVisibility = (toggleNavigation, toggleTOC) => {
        let newNavigation = loadNavigationState();
        let newTOC = loadTocState();
        
        if (toggleNavigation) {
            newNavigation = !newNavigation;
            saveBool("NAVIGATION", newNavigation);
        }
        if (toggleTOC) {
            newTOC = !newTOC;
            saveBool("TOC", newTOC);
        }
        
        _setVisibility(newNavigation, newTOC);
    }

    const _setVisibility = (newNavigation, newTOC) => {
        console.debug(`Setting new visibility: navigation=${newNavigation}, TOC=${newTOC}`);
        // combine this into one operation, so that it is more efficient (for toggling both) and easier to code with dynamic CSS generation
        customDynamicStyle.innerHTML = setCombinedVisibility(newNavigation, newTOC);
    }

    // START OF INCLUDE
    // This gets replaced with the definitions of: 
    // - setCombinedVisibility(showNavigation: bool, showTOC: bool) -> string (dynamic CSS)
    // - registerKeyboardEventHandler() -> void
    THEME_DEPENDENT_FUNCTION_DEFINITION_PLACEHOLDER
    // END OF INCLUDE

    // argument: string, returns true if the key was handled and the event should be marked as already handled
    const coreEventListenerLogic = (keyChar) => {
        if (keyChar === "t") {
            toggleVisibility(false, true);
            return true;
        } else if (keyChar === "m") {
            toggleVisibility(true, false);
            return true;
        } else if (keyChar === "b") {
            toggleVisibility(true, true);
            return true;
        } else {
            return false;
        }
    }

    window.addEventListener("load", () => {
        console.log("The mkdocs-toggle-sidebar-plugin is installed. It adds the following key bindings:\n T -> toggle table of contents sidebar\n M -> toggle navigation menu sidebar\n B -> toggle both sidebars (TOC and navigation)");

        registerKeyboardEventHandler();
        customDynamicStyle.innerHTML = setCombinedVisibility(loadNavigationState(), loadTocState());
    });

    // Export functions that the user can call to modify the state
    window.MkdocsToggleSidebarPlugin = {
        setNavigationVisibility: (show) => {
            saveBool("NAVIGATION", show);
            _setVisibility(show, loadTocState());
        },
        setTocVisibility: (show) => {
            saveBool("TOC", show);
            _setVisibility(loadNavigationState(), show);
        },
        setAllVisibility: (showNavigation, showTOC) => {
            saveBool("NAVIGATION", showNavigation);
            saveBool("TOC", showTOC);
            _setVisibility(showNavigation, showTOC);
        },
        toggleNavigationVisibility: () => toggleVisibility(true, false),
        toggleTocVisibility: () => toggleVisibility(false, true),
        toggleAllVisibility: () => toggleVisibility(true, true)
    };
}());
