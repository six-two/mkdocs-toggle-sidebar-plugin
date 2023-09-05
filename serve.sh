#!/usr/bin/env bash
# A small wrapper script that installs the dependencies in a venv

# cd into the repo's root dir
cd "$( dirname "${BASH_SOURCE[0]}" )"

# If venv does not exist, create it
if [[ ! -f venv/bin/activate ]]; then
    echo "[*] Creating virtual python environment"
    python3 -m venv --clear --upgrade-deps venv
fi

# Enter the venv
echo "[*] Using venv $(pwd)/venv"
source venv/bin/activate

# Update the dependencies
echo "[*] Installing dependencies"
python3 -m pip install -r requirements.txt

echo "[*] Installing latest version of toggle-sidebar plugin"
python3 -m pip install .

# Serve the test site
echo "[*] Starting MkDocs in serve mode"
python3 -m mkdocs serve
