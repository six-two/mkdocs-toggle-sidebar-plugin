# mkdocs-toggle-sidebar-plugin

[![PyPI version](https://img.shields.io/pypi/v/mkdocs-toggle-sidebar-plugin)](https://pypi.org/project/mkdocs-toggle-sidebar-plugin/)
![License](https://img.shields.io/pypi/l/mkdocs-toggle-sidebar-plugin)
![Python versions](https://img.shields.io/pypi/pyversions/mkdocs-toggle-sidebar-plugin)

This package allows you to toggle the left (navigation) and right (table of contents) sidebars on a couple of MkDocs themes such as:

- [Material for MkDocs](https://github.com/squidfunk/mkdocs-material): `material`
- Builtin themes: `mkdocs`, `readthedocs`

You can play around with it and these themes on the [test page](https://mkdocs-toggle-sidebar.six-two.dev).

The settings are stored using the `localStorage` object, so that it will persist between pages.

I wrote it after getting frustrated by the browser's `Find in page` function matching way to many links in the navigation sidebar instead of searching in the actual page's content.


## Usage

### Setup

First install the PyPI package:
```bash
pip install mkdocs-toggle-sidebar-plugin
```

Add something like the following to your `mkdocs.yml`:
```yaml
plugins:
- search
- toggle-sidebar
```

### Key bindings

The plugin adds the following key bindings:

Key   | Action
---   | ---
`b` | toggle **b**oth (TOC and navigation)
`m` | toggle navigation **m**enu
`t` | toggle **T**OC

For some themes like `readthedocs` navigation and TOC are combined.
In this case the state of TOC is ignored, and only calls for navigation (or all) are interpreted.

### Toggle button

When you set the `toggle_button` option to `navigation`, `toc` or `all`, it will add a button that looks like a hamburger menu (three horizontal bars) on a theme-dependent location.
It is usually in the nav or the top bar.
Clicking the button will toggle the navigation, table of contents, or both (depending on the supplied value).
By leaving the field empty or setting it to `none`, no button is added.

### Exported API functions

This plugin exposes some JavaScript functions, that can show, hide or toggle the visibility of the sidebars.
You can see how they are called in `docs/javascript-functions.md` and how they are defined in `src/mkdocs_toggle_sidebar_plugin/toggle-sidebar.js`.

In short there are:

- `MkdocsToggleSidebarPlugin.setNavigationVisibility(show: bool)`
- `MkdocsToggleSidebarPlugin.setTocVisibility(show: bool)`
- `MkdocsToggleSidebarPlugin.setAllVisibility: (showNavigation: bool, showTOC: bool)`
- `MkdocsToggleSidebarPlugin.toggleNavigationVisibility()`
- `MkdocsToggleSidebarPlugin.toggleTocVisibility()`
- `MkdocsToggleSidebarPlugin.toggleAllVisibility()`

The names and parameters should be self-explanatory.

## Theme support

Below shows the latest themes that I have tested.
They are not updated that often, and the plugin should generally work for other of theme versions too.

Theme            | Theme version | Plugin version | Status
---              | ---           | ---            | ---
mkdocs-material  | 9.5.34        | 0.0.4          | works
mkdocs (default) | 1.6.1         | 0.0.4          | works
readthedocs      | 1.6.1         | 0.0.4          | works

Just open a issue / PR if you use a strange theme or the info above is not up to date anymore.

### Note to self

Test mkdocs-material theme:
```bash
./serve.sh
```

Test mkdocs theme:
```bash
./serve.sh --theme mkdocs
```

## Notable changes

### Version 0.0.4

- Export API via `MkdocsToggleSidebarPlugin` object.
    This lets you create custom buttons or key bindings to hide, show or toggle the side bars.
- Added `toggle_button` option and implemented it for Material theme

### Version 0.0.3

- Changed internal API:
    - Element hiding/restyling is now done via CSS, so it is easier to undo. You should no longer have problems on devices with small screens (like phones) having broken layouts.

### Version 0.0.2

- Added support for `mkdocs` and `readthedocs` theme.

### Version 0.0.1

- Prototype with `mkdocs-material` implementation.
