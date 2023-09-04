import os
import shutil
# pip dependency
import mkdocs
from mkdocs.plugins import BasePlugin
from mkdocs.config.defaults import MkDocsConfig
from mkdocs.structure.pages import Page
from mkdocs.structure.files import Files
from mkdocs.config.base import Config
from mkdocs.config.config_options import Type
from mkdocs.config.defaults import MkDocsConfig
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
        custom_script = ExtraScriptValue(self.config.javascript)
        if self.config.async_:
            custom_script.async_ = True
        
        config.extra_javascript.append(custom_script)
        return config


    def on_post_build(self, config: MkDocsConfig) -> None:
        copy_asset_if_target_file_does_not_exist(config.site_dir, self.config.javascript, "toggle-sidebar.js")


def copy_asset_if_target_file_does_not_exist(output_dir: str, target_path_in_output_folder: str, asset_name: str):
    if not target_path_in_output_folder:
        raise ValueError("Empty value for 'target_path_in_output_folder' given")

    target_path = os.path.join(output_dir, target_path_in_output_folder)
    if os.path.exists(target_path):
        # The file exists. This probably means, that the user wanted to override the default file
        # So we just do nothing
        pass
    else:
        # Make sure that the folder exists
        parent_dir = os.path.dirname(target_path)
        os.makedirs(parent_dir, exist_ok=True)
        # Copy the file
        asset_path = get_resource_path(asset_name)

        with open(asset_path) as f:
            data = f.read()
        data = data.replace("TOC_DEFAULT_PLACEHOLDER", "true")
        with open(target_path, "w") as f:
            f.write(data)


def get_resource_path(name: str) -> str:
    current_dir = os.path.dirname(__file__)
    return os.path.join(current_dir, name)

