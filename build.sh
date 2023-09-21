#!/usr/bin/env bash

# Change into the project root
cd -- "$( dirname -- "${BASH_SOURCE[0]}" )"

# If you created a virtual python environment, source it
if [[ -f venv/bin/activate ]]; then
    echo "[*] Using virtual python environment"
    source venv/bin/activate
fi

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
    python3 -m mkdocs build -t "$1" -d public/"$1"
}

build_with_theme mkdocs
build_with_theme readthedocs
build_with_theme material

echo "[*] To view the site run:"
echo python3 -m http.server --directory "'$(pwd)/public/'"
