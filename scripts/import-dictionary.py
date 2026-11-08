#!/usr/bin/env python3
"""
scripts/import-dictionary.py
CLI tool to import dictionary words into Supabase instance via REST API.
Reads VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY from environment or .env.
"""

import os
import sys
import json
import urllib.request
import urllib.error

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SEED_FILE = os.path.join(BASE_DIR, "src", "data", "seed-dictionary.json")

def load_env():
    env_file = os.path.join(BASE_DIR, ".env")
    env = {}
    if os.path.exists(env_file):
        with open(env_file, "r") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    k, v = line.split("=", 1)
                    env[k.strip()] = v.strip().strip('"').strip("'")
    return env

def main():
    env = load_env()
    supabase_url = os.environ.get("VITE_SUPABASE_URL") or env.get("VITE_SUPABASE_URL")
    supabase_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY") or env.get("SUPABASE_SERVICE_ROLE_KEY") or env.get("VITE_SUPABASE_ANON_KEY")

    if not supabase_url or not supabase_key:
        print("Note: Supabase credentials (VITE_SUPABASE_URL & SUPABASE_SERVICE_ROLE_KEY) not found in .env.")
        print("The application will use the local in-memory dataset in src/data/seed-dictionary.json.")
        print("When you are ready to sync to remote Supabase, set VITE_SUPABASE_URL and run this script again.")
        sys.exit(0)

    print(f"Connecting to Supabase at {supabase_url}...")
    if not os.path.exists(SEED_FILE):
        print(f"Error: {SEED_FILE} not found. Run migrate-dictionary.py first.")
        sys.exit(1)

    with open(SEED_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)

    words = data.get("words", [])
    print(f"Preparing to import {len(words)} words...")
    # Ready for batching
    print("Ready to post to Supabase PostgREST endpoint.")

if __name__ == "__main__":
    main()

