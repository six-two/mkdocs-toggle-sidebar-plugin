import logging

# Set up a logger for my code to use
LOGGER = logging.getLogger("mkdocs.plugins.crosslink")

def debug(message: str) -> None:
    LOGGER.debug(f"[toggle_sidebar] {message}")

def warning(message: str) -> None:
    LOGGER.warning(f"[toggle_sidebar] {message}")

def info(message: str) -> None:
    LOGGER.info(f"[toggle_sidebar] {message}")

# Import local files in the correct order
# from .utils import replace_regex_matches
# from .normal_badge import replace_normal_badges
from .plugin import Plugin

__all__ = ["Plugin"]
