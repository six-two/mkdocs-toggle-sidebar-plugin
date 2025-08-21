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

### Configuration options

You can overwrite the defaults like this:

```yaml
plugins:
- search
- toggle-sidebar:
    async: False
    debug: True
    enabled: True
    inline: False
    javascript: ./toggle-sidebar.js
    show_navigation_by_default: False
    show_toc_by_default: False
    theme: material
    toggle_button: all
```

The following options exist:

Option | Type | Default value | Description
--- | ---| --- | ---
async | `bool` | `False` | Asynchronously load the JavaScript file created by the plugin
debug | `bool` | `False` | Show some debug messages during mkdocs build (for example related to theme detection)
enabled | `bool` | `True` | Can be used to disable the plugin. Usually used in combination with environment variables like `enabled: !ENV [TOGGLE_SIDEBAR, false]` as described in [mkdocs's docs](https://www.mkdocs.org/user-guide/configuration/#enabled-option)
inline | `bool` | `False` | Instead of storing the javascript code in the file specified by `javascript`, it is directly copied into each page. Slightly increases page size, but can improve load times a little bit and reduce flickering on page (re-)load
javascript | `str` | `"assets/javascripts/toggle-sidebar.js"` | The path where to store the output file
show_navigation_by_default | `bool` | `True` | Whether to show the navigation by default
show_toc_by_default | `bool` | `True` | Whether to show the table of contents by default
theme | `str` | `auto` | Used for theme detection. With `auto`, the plugin tries to automatically detect the theme. But you can also force it to use a specific theme preset that you know will work. Currently supported values: `material`/`ansible`, `mkdocs`, `readthedocs`.
toggle_button | `str` | `"none"` | Can be set to show a toggle button (see below)


#### Toggle button

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
The table is not updated regularly, but the plugin should generally work for other theme versions too.

Theme            | Theme version | Plugin version | Status
---              | ---           | ---            | ---
mkdocs-ansible   | 25.6.0        | 0.0.6          | works
mkdocs-material  | 9.6.14        | 0.0.4+         | works
mkdocs (default) | 1.6.1         | 0.0.4+         | works
readthedocs      | 1.6.1         | 0.0.4+         | works

Just open an issue / PR if you use a strange theme or the info above is not up-to-date anymore.

### Note to self

Test `material` theme:
```bash
./serve.sh
```

Test `mkdocs` theme:
```bash
./serve.sh --theme mkdocs
```

Test `mkdocs`, `readthedocs` and `material` themes:
```bash
./build.sh
python3 -m http.server --directory './public/'
```

Test oldest python version supported by me (3.9):
```bash
docker run --rm -it -v "$PWD:/share" -w "/share" -p 8000:8000 --entrypoint=bash python:3.9 ./serve.sh
```

Test newest available python version (currently 3.13):
```bash
docker run --rm -it -v "$PWD:/share" -w "/share" -p 8000:8000 --entrypoint=bash python:latest ./serve.sh
```


## Notable changes

### Version 0.0.8

- Fixed toggle button not shown in certain window dimensions in Material theme (see #11)

### Version 0.0.7

- Fixed sidebar not hidden in material's blog mode (see #9). Thank you @ZnPdCo for finding and fixing the issue.

### Version 0.0.6

- Fixed toggle button appearing delayed on slow loading pages (see #6)
- Fixed behavior when using Material's `navigation.instant` feature (see #5)
- Added `inline` option that prevents page flickering on reload (see #4). It is now enabled by default and async is disabled by default, to prevent the flickering. To revert to the old behavior you can set `async: True` and `inline: False` in the plugin's config in your `mkdocs.yml`
- Added `theme` option that allows you to override theme detection (see #3)
- Added support for `ansible` theme (see #3)
- Added fallback to check `theme.extra.base_theme` from `mkdocs.yml` when other theme detection logic fails (see #3)
- Added `debug` option

### Version 0.0.5

- Bug fix: On small screens with the material theme the navigation would be hidden, even when the hamburger menu was opened.

### Version 0.0.4

- Export API via `MkdocsToggleSidebarPlugin` object.
    This lets you create custom buttons or key bindings to hide, show or toggle the side bars.
- Added `toggle_button` option and implemented it for Material theme.

### Version 0.0.3

- Changed internal API:
    - Element hiding/restyling is now done via CSS, so it is easier to undo. You should no longer have problems on devices with small screens (like phones) having broken layouts.

### Version 0.0.2

- Added support for `mkdocs` and `readthedocs` theme.

### Version 0.0.1

- Prototype with `mkdocs-material` implementation.
