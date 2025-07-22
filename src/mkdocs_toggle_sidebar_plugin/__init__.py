import os
import urllib.parse
# pip dependency
from mkdocs.plugins import BasePlugin, get_plugin_logger
from mkdocs.config.defaults import MkDocsConfig
from mkdocs.config.base import Config
from mkdocs.config.config_options import Type, ExtraScriptValue
from mkdocs.exceptions import PluginError

LOGGER = get_plugin_logger(__name__)
SCRIPT_DIR = os.path.dirname(__file__)
ALLOWED_TOGGLE_BUTTON_VALUES = ["none", "navigation", "toc", "all"]
# This is a map of compatible themes. For example 'ansible' inherits from 'material', so the material javascript will work for the ansible theme too
THEME_COMPATIBILITY = {
    "ansible": "material",
}
# May not always be accurate, this is just for a more helpful error message
KNOWN_THEME_NAMES = ["material", "mkdocs", "readthedocs"] + list(THEME_COMPATIBILITY.keys())

class PluginConfig(Config):
    enabled = Type(bool, default=True)
    show_toc_by_default = Type(bool, default=True)
    show_navigation_by_default = Type(bool, default=True)
    theme = Type(str, default="auto")
    toggle_button = Type(str, default="none")
    async_ = Type(bool, default=False)
    javascript = Type(str, default="assets/javascripts/toggle-sidebar.js")
    debug = Type(bool, default=False)
    inline = Type(bool, default=False)


def is_known_theme(theme_name: str) -> bool:
    # If the theme is known to be based on another theme, then we resolve it to the base theme
    theme_name = THEME_COMPATIBILITY.get(theme_name, theme_name)

    # Then we check if we have a javascript file for the theme
    theme_path = os.path.join(SCRIPT_DIR, f"{theme_name}.js")
    return os.path.exists(theme_path) and theme_name != "toggle-sidebar"

def get_unknown_theme_message(theme_name: str, auto_detect_enabled: bool) -> str:
    if auto_detect_enabled:
        basic_help = "If this theme is based on or similar to one of the supported themes above, add 'theme: <NAME_OF_SIMILAR_SUPPORTED_THEME>' to this plugin's configuration in your mkdocs.yml"
    else:
        basic_help = "You are overwriting the theme in this plugin's configuration in your mkdocs.yml. Make sure you spelled the theme's name correctly."
    return f"Theme '{theme_name}' is not (yet) supported. The currently supported themes are: {', '.join(KNOWN_THEME_NAMES)}.\nRecommended steps:\n1. {basic_help}\n2. Try updating this plugin to the latest version: pip install -U mkdocs-toggle-sidebar-plugin\n3. Check if an issue for this theme exists: https://github.com/six-two/mkdocs-toggle-sidebar-plugin/issues\n4. If no issue exists feel free to open one. Please put the theme name and path where to download it in the issue"
    
def get_base_url_by_url(url: str):
    if url == '':
        return './'
    return url.count('/') * '../'

class Plugin(BasePlugin[PluginConfig]):
    def on_config(self, config: MkDocsConfig, **kwargs) -> MkDocsConfig:
        """
        Called once when the config is loaded.
        It will make modify the config and initialize this plugin.
        """
        self.theme_function_definitions = None
        self.inline_javascript = None
        if self.config.enabled:
            theme_name = self.config.theme
            # Default to automatically determining the theme
            if theme_name == "auto" or not theme_name:
                theme_name = config.theme.name or "mkdocs"
                base_theme_name = config.theme.get("extra", {}).get("base_theme") # check mkdocs.yml:theme.extra.base_theme
                self.debug(f"Automatically detected theme: {theme_name}. Optional base theme: {base_theme_name}")

                if not is_known_theme(theme_name):
                    # Handle themes
                    if base_theme_name and is_known_theme(base_theme_name):
                        LOGGER.debug(f"Theme is unknown, so we fell back to base theme: {base_theme_name}")
                        theme_name = base_theme_name
                    else:
                        LOGGER.warning(get_unknown_theme_message(theme_name, True))
            else:
                if not is_known_theme(theme_name):
                    LOGGER.warning(get_unknown_theme_message(theme_name, False))
            
            # If the theme is known to be based on another theme, then we resolve it to the base theme
            resolved_theme_name = THEME_COMPATIBILITY.get(theme_name, theme_name)

            theme_path = os.path.join(SCRIPT_DIR, f"{resolved_theme_name}.js")
            if os.path.exists(theme_path):
                self.debug(f"Using JavaScript {resolved_theme_name}.js for theme {theme_name}")
                with open(theme_path) as f:
                    self.theme_function_definitions = f.read()

            if self.theme_function_definitions and self.config.inline:
                # We cache it for performance reasons
                self.inline_javascript = f"<script>{self.get_toggle_sidebar_javascript(config)}</script>"
        
        if self.config.toggle_button not in ALLOWED_TOGGLE_BUTTON_VALUES:
            raise PluginError(f"Unexpected value for 'toggle_button': '{self.config.toggle_button}'. Allowed values are {', '.join(ALLOWED_TOGGLE_BUTTON_VALUES)}")
        return config

    def debug(self, message: str) -> None:
        if self.config.debug:
            LOGGER.info(message)
        else:
            LOGGER.debug(message)

    def on_post_page(self, html, /, *, page, config):
        if self.config.enabled and self.theme_function_definitions:
            if self.inline_javascript:
                html = html.replace("</head>", self.inline_javascript + "</head>")
            else:
                base_url = get_base_url_by_url(page.url)
                script_src = urllib.parse.quote(base_url + self.config.javascript.lstrip("./"))
                if self.config.async_:
                    script = f'<script src="{script_src}" async></script>'
                else:
                    script = f'<script src="{script_src}"></script>'
                html = html.replace("</head>", script + "</head>")
        
        return html

    def on_post_build(self, config: MkDocsConfig) -> None:
        if self.theme_function_definitions and not self.config.inline:
            target_path = os.path.join(config.site_dir, self.config.javascript)
            # To properly replace placeholders, we need to replace the JS file, even if it already exists
            # Make sure that the folder exists
            parent_dir = os.path.dirname(target_path)
            os.makedirs(parent_dir, exist_ok=True)
            
            # Copy the file, while also editing it on the fly
            javascript = self.get_toggle_sidebar_javascript(config)
            with open(target_path, "w") as f:
                f.write(javascript)

    def get_toggle_sidebar_javascript(self, config: MkDocsConfig):
        # Default to the output path of the JavaScript file, so that users can modify the JavaScript (even in inline mode)
        asset_path = os.path.join(config.docs_dir, self.config.javascript)
        if not os.path.exists(asset_path):
            asset_path = os.path.join(SCRIPT_DIR, "toggle-sidebar.js")
        self.debug(f"[*] Loading JavaScript template from {asset_path}")

        with open(asset_path) as f:
            data = f.read()
        data = data.replace("THEME_DEPENDENT_FUNCTION_DEFINITION_PLACEHOLDER", self.theme_function_definitions)
        data = data.replace("TOC_DEFAULT_PLACEHOLDER", "true" if self.config.show_toc_by_default else "false")
        data = data.replace("NAVIGATION_DEFAULT_PLACEHOLDER", "true" if self.config.show_toc_by_default else "false")
        data = data.replace("TOGGLE_BUTTON_PLACEHOLDER", self.config.toggle_button)
        return data