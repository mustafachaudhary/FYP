#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

printf "\nSetting up backend...\n"
cd "$ROOT_DIR/backend"
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python seed_data.py

deactivate

printf "\nSetting up frontend...\n"
cd "$ROOT_DIR/frontend"
npm install

printf "\nSetup complete.\n"
