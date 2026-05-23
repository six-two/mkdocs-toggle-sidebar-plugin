#!/usr/bin/env bash
# Used by CI/CD pipeline to build <https://mkdocs-toggle-sidebar.six-two.dev>
# Also used by me to locally test the plugin with different themes

# Put your preferred version/fork on MkDocs here
MKDOCS=properdocs

# Change into the project root
cd -- "$( dirname -- "${BASH_SOURCE[0]}" )"

# Even Vercel needs venvs now, since otherwise pip will not work
# Material and MaterialX conflict, so they need separate venvs: https://github.com/jaywhj/mkdocs-materialx/issues/86
activate_venv() {
    deactivate # if in a venv, exit it
    if [[ ! -f "venv-$1/bin/activate" ]]; then
        echo "[*] Creating virtual python environment: $1"
        python3 -m venv "venv-$1"
    fi
    echo "[*] Using virtual python environment: $1"
    source "venv-$1/bin/activate"

    echo "[*] Installing dependencies"
    python3 -m pip install -r requirements-$1.txt

    # Install the pip package
    python3 -m pip install .
}


# delete the output dir
[[ -d public ]] && rm -rf public

# Create a fresh output dir
mkdir public

# Create a redirect to the default theme (materialx)
cp redirect.html public/index.html

# ensure they use the same links to all test sites
cp docs/index.md tests/blog/docs/index.md
cat tests/blog/blog-metadata.txt docs/index.md > tests/blog/docs/posts/blog.md

build_with_theme() {
    echo "[*] Building with theme $1"
    python3 -m $MKDOCS build -f mkdocs.yml -t "$1" -d public/"$1"
}

build_blog_with_theme() {
    echo "[*] Building blog site with theme $1"
    python3 -m $MKDOCS build -f tests/blog/mkdocs.yml -t "$1" -d "../../public/$1-blog"
}

# Build the normal and blog sites
activate_venv materialx
build_with_theme mkdocs
build_with_theme readthedocs
build_with_theme materialx
build_blog_with_theme materialx

activate_venv material
build_with_theme material
build_blog_with_theme material

if [[ "$1" == "serve" ]]; then
    python3 -m http.server --directory "public/"
else
    echo "[*] To view the site run the following or call this script with the argument 'serve':"
    echo python3 -m http.server --directory "'$(pwd)/public/'"
fi
