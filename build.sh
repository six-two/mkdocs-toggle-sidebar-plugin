#!/usr/bin/env bash

# Change into the project root
cd -- "$( dirname -- "${BASH_SOURCE[0]}" )"

# Install the pip package
python3 -m pip install .

# Build main site
# Needs to be first, since the other files will be copied into it
mkdocs build "$@" || exit 1

build_sub_site() {
    # Switch into directory, build site, copy to the main site, switch back to initial directory
    # Hard assumption: $1 MUST NOT contain a path separator (relative and not nested)
    cd "$1"
    mkdocs build
    cp -r site "../site/$1"
    cd ..
}

build_sub_site site_a
build_sub_site site_b

# serve site
cd site
python3 -m http.server
