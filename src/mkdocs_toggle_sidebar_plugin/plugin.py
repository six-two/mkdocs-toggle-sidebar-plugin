# pip dependency
import mkdocs
from mkdocs.plugins import BasePlugin
from mkdocs.config.defaults import MkDocsConfig
from mkdocs.structure.pages import Page
from mkdocs.structure.files import Files
from mkdocs.config.base import Config
from mkdocs.config.config_options import Type
from mkdocs.config.defaults import MkDocsConfig


class PluginConfig(Config):
    enabled = Type(bool, default=True)
    show_toc_by_default = Type(bool, default=True)
    show_navigation_by_default = Type(bool, default=True)



class Plugin(BasePlugin[PluginConfig]):
    def on_config(self, config: MkDocsConfig, **kwargs) -> MkDocsConfig:
        """
        Called once when the config is loaded.
        It will make modify the config and initialize this plugin.
        """
        self.crosslinks: dict[str,CrosslinkSite] = {}
        parse_crosslinks_list(self.config.crosslinks, "crosslinks", self.crosslinks)

        # If not already created/overwritten by the user, provide a default value for 'local'
        local_crosslink = create_local_crosslink(config)
        if local_crosslink.name not in self.crosslinks:
            self.crosslinks[local_crosslink.name] = local_crosslink

        self.replacer = Replacer(list(self.crosslinks.values()), self.config) # @TODO: make it work with a dict?
        return config


    # @event_priority(50)
    # SEE https://www.mkdocs.org/dev-guide/plugins/#event-priorities
    def on_page_content(self, html: str, page: Page, config: MkDocsConfig, files: Files) -> str:
        """
        The page_content event is called after the Markdown text is rendered to HTML (but before being passed to a template) and can be used to alter the HTML body of the page.
        See: https://www.mkdocs.org/dev-guide/plugins/#on_page_content
        """
        pass

    def on_post_build(self, config: MkDocsConfig) -> None:
        if self.config.show_profiling_results:
            PROFILER.log_stats()
