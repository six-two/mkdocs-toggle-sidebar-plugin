import os
# pip dependency
from mkdocs.plugins import BasePlugin
from mkdocs.config.defaults import MkDocsConfig
from mkdocs.config.base import Config
from mkdocs.config.config_options import Type, ExtraScriptValue

class PluginConfig(Config):
    enabled = Type(bool, default=True)
    show_toc_by_default = Type(bool, default=True)
    show_navigation_by_default = Type(bool, default=True)
    async_ = Type(bool, default=True)
    javascript = Type(str, default="assets/javascripts/toggle-sidebar.js")


class Plugin(BasePlugin[PluginConfig]):
    def on_config(self, config: MkDocsConfig, **kwargs) -> MkDocsConfig:
        """
        Called once when the config is loaded.
        It will make modify the config and initialize this plugin.
        """
        if self.config.enabled:
            custom_script = ExtraScriptValue(self.config.javascript)
            if self.config.async_:
                custom_script.async_ = True
            
            config.extra_javascript.append(custom_script)
        return config


    def on_post_build(self, config: MkDocsConfig) -> None:
        if self.config.enabled:
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
                current_dir = os.path.dirname(__file__)
                asset_path = os.path.join(current_dir, "toggle-sidebar.js")
                with open(asset_path) as f:
                    data = f.read()
                data = data.replace("TOC_DEFAULT_PLACEHOLDER", "true" if self.config.show_toc_by_default else "false")
                data = data.replace("NAVIGATION_DEFAULT_PLACEHOLDER", "true" if self.config.show_toc_by_default else "false")
                with open(target_path, "w") as f:
                    f.write(data)

