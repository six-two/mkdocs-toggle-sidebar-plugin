# mkdocs-crosslink-plugin

[![PyPI version](https://img.shields.io/pypi/v/mkdocs-toggle-sidebar-plugin)](https://pypi.org/project/mkdocs-toggle-sidebar-plugin/)
![License](https://img.shields.io/pypi/l/mkdocs-toggle-sidebar-plugin)
![Python versions](https://img.shields.io/pypi/pyversions/mkdocs-toggle-sidebar-plugin)

This package allows you to add links to other MkDocs sites (or sites created with similar page generator).

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
++b++ | toggle **b**oth (TOC and navigation)
++m++ | toggle navigation menu
++t++ | toggle TOC

## Theme support

Theme            | Theme version |Plugin version | Status
---              | ---           | ---           | ---
mkdocs-material  | 9.1.21        | 0.0.1         | works
mkdocs (default) | 1.5.2         | 0.0.1         | not yet implemented

Just open a issue / PR if you use a strange theme or the info above is not up to date anymore.

## Notable changes

### Version 0.0.1

Prototype with `mkdocs-material` implementation.
