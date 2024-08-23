import os
import logging
# pip dependency
from mkdocs.plugins import BasePlugin, get_plugin_logger
from mkdocs.config.defaults import MkDocsConfig
from mkdocs.config.base import Config
from mkdocs.config.config_options import Type, ExtraScriptValue
from mkdocs.exceptions import PluginError

LOGGER = get_plugin_logger(__name__)
SCRIPT_DIR = os.path.dirname(__file__)
ALLOWED_TOGGLE_BUTTON_VALUES = ["none", "navigation", "toc", "all"]

class PluginConfig(Config):
    enabled = Type(bool, default=True)
    show_toc_by_default = Type(bool, default=True)
    show_navigation_by_default = Type(bool, default=True)
    toggle_button = Type(str, default="none")
    async_ = Type(bool, default=True)
    javascript = Type(str, default="assets/javascripts/toggle-sidebar.js")


class Plugin(BasePlugin[PluginConfig]):
    def on_config(self, config: MkDocsConfig, **kwargs) -> MkDocsConfig:
        """
        Called once when the config is loaded.
        It will make modify the config and initialize this plugin.
        """
        self.theme_function_definitions = None
        if self.config.enabled:
            theme_name = config.theme.name or "mkdocs"
            theme_path = os.path.join(SCRIPT_DIR, f"{theme_name}.js")
            if os.path.exists(theme_path):
                with open(theme_path) as f:
                    self.theme_function_definitions = f.read()
            else:
                LOGGER.warning(f"[toggle-sidebar] Theme '{theme_name}' is not (yet) supported. Hint:\n1. Try updating the plugin to the latest version: pip install -U mkdocs-toggle-sidebar-plugin\n2. Check if an issue for this theme exists: https://github.com/six-two/mkdocs-toggle-sidebar-plugin/issues\n3. If no issue exists feel free to open one. Please put the theme name and path where to download it in the issue")

        if self.theme_function_definitions:
            custom_script = ExtraScriptValue(self.config.javascript)
            if self.config.async_:
                custom_script.async_ = True
            
            config.extra_javascript.append(custom_script)
        
        if self.config.toggle_button not in ALLOWED_TOGGLE_BUTTON_VALUES:
            raise PluginError(f"Unexpected value for 'toggle_button': '{self.config.toggle_button}'. Allowed values are {', '.join(ALLOWED_TOGGLE_BUTTON_VALUES)}")
        return config


    def on_post_build(self, config: MkDocsConfig) -> None:
        if self.theme_function_definitions:
            target_path = os.path.join(config.site_dir, self.config.javascript)
            if os.path.exists(target_path):
                # The file exists. This probably means, that the user wanted to override the default file
                # So we just do nothing
                pass
            else:
                # Make sure that the folder exists
                parent_dir = os.path.dirname(target_path)
                os.makedirs(parent_dir, exist_ok=True)
                
                # Copy the file, while also editing it on the fly
                asset_path = os.path.join(SCRIPT_DIR, "toggle-sidebar.js")
                with open(asset_path) as f:
                    data = f.read()
                data = data.replace("THEME_DEPENDENT_FUNCTION_DEFINITION_PLACEHOLDER", self.theme_function_definitions)
                data = data.replace("TOC_DEFAULT_PLACEHOLDER", "true" if self.config.show_toc_by_default else "false")
                data = data.replace("NAVIGATION_DEFAULT_PLACEHOLDER", "true" if self.config.show_toc_by_default else "false")
                data = data.replace("TOGGLE_BUTTON_PLACEHOLDER", self.config.toggle_button)
                with open(target_path, "w") as f:
                    f.write(data)

