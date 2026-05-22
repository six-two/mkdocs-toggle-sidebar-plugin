#!/usr/bin/env bash
# Used by CI/CD pipeline to build <https://mkdocs-toggle-sidebar.six-two.dev>
# Also used by me to locally test the plugin with different themes

# Put your preferred version/fork on MkDocs here
MKDOCS=properdocs

# Change into the project root
cd -- "$( dirname -- "${BASH_SOURCE[0]}" )"

# Even Vercel needs venvs now, since otherwise pip will not work
if [[ ! -f venv/bin/activate ]]; then
    echo "[*] Creating virtual python environment"
    python3 -m venv venv
fi
echo "[*] Using virtual python environment"
source venv/bin/activate

echo "[*] Installing dependencies"
python3 -m pip install -r requirements.txt

# Install the pip package
python3 -m pip install .

# delete the output dir
[[ -d public ]] && rm -rf public

# Create a fresh output dir
mkdir public

# Create a redirect to the default theme (material)
cp redirect.html public/index.html

build_with_theme() {
    echo "[*] Building with theme $1"
    python3 -m $MKDOCS build -f mkdocs.yml -t "$1" -d public/"$1"
}

build_blog_with_theme() {
    echo "[*] Building blog site with theme $1"
    python3 -m $MKDOCS build -f tests/blog/mkdocs.yml -t "$1" -d "../../public/$1-blog"
}


# Build the normal sites
build_with_theme mkdocs
build_with_theme readthedocs
build_with_theme material
build_with_theme materialx

# ensure they use the same links to all test sites
cp docs/index.md tests/blog/docs/index.md
cat tests/blog/blog-metadata.txt docs/index.md > tests/blog/docs/posts/blog.md

# Build the blog site
build_blog_with_theme material
build_blog_with_theme materialx

if [[ "$1" == "serve" ]]; then
    python3 -m http.server --directory "public/"
else
    echo "[*] To view the site run the following or call this script with the argument 'serve':"
    echo python3 -m http.server --directory "'$(pwd)/public/'"
fi
