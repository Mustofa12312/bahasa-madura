#!/usr/bin/env python3
"""
scripts/inspect-source.py
Comprehensive audit script for the legacy 'madura' repository.
Analyzes code, data structure, licenses, and dependencies.
"""

import os
import json
from collections import Counter, defaultdict

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
KAMUS_JSON = os.path.join(BASE_DIR, "kamus.json")

def inspect_repository():
    print("=" * 60)
    print("1. REPOSITORY AUDIT")
    print("=" * 60)
    
    files = ["index.html", "main.js", "main.css", "util.js", "scrap.py", "package.json", "kamus.json"]
    for f in files:
        fpath = os.path.join(BASE_DIR, f)
        if os.path.exists(fpath):
            size = os.path.getsize(fpath)
            with open(fpath, "r", encoding="utf-8", errors="ignore") as fp:
                lines = len(fp.readlines())
            print(f"- {f:<15}: {size:>8} bytes, {lines:>5} lines")
        else:
            print(f"- {f:<15}: NOT FOUND")

    # Package.json details
    pkg_path = os.path.join(BASE_DIR, "package.json")
    if os.path.exists(pkg_path):
        with open(pkg_path, "r", encoding="utf-8") as fp:
            pkg = json.load(fp)
            print("\nPackage Info:")
            print(f"  Name       : {pkg.get('name')}")
            print(f"  Version    : {pkg.get('version')}")
            print(f"  License    : {pkg.get('license', 'Unspecified')}")
            print(f"  Author     : {pkg.get('author', 'Unspecified')}")
            print(f"  Deps       : {pkg.get('dependencies', {})}")

def inspect_dataset():
    print("\n" + "=" * 60)
    print("2. KAMUS.JSON DATASET AUDIT")
    print("=" * 60)

    if not os.path.exists(KAMUS_JSON):
        print(f"Error: {KAMUS_JSON} does not exist.")
        return

    with open(KAMUS_JSON, "r", encoding="utf-8") as f:
        data = json.load(f)

    total_records = len(data)
    print(f"Total entries: {total_records}")

    tingkatan_counter = Counter()
    madura_words = set()
    indo_words = set()
    madura_to_indo = defaultdict(list)
    indo_to_madura = defaultdict(list)
    exact_duplicates = 0
    empty_tingkat = 0
    empty_indo = 0
    empty_madura = 0

    seen_triplets = set()
    madura_diacritics = Counter()

    for idx, row in enumerate(data):
        if len(row) != 3:
            print(f"Malformatted row #{idx}: {row}")
            continue

        tingkat, indo, madura = row[0].strip(), row[1].strip(), row[2].strip()

        triplet = (tingkat, indo.lower(), madura.lower())
        if triplet in seen_triplets:
            exact_duplicates += 1
        else:
            seen_triplets.add(triplet)

        if not tingkat:
            empty_tingkat += 1
        tingkatan_counter[tingkat] += 1

        if not indo:
            empty_indo += 1
        else:
            indo_words.add(indo.lower())
            indo_to_madura[indo.lower()].append(madura)

        if not madura:
            empty_madura += 1
        else:
            madura_words.add(madura.lower())
            madura_to_indo[madura.lower()].append((indo, tingkat))

        for ch in madura:
            if ord(ch) > 127 or ch in "'’`-":
                madura_diacritics[ch] += 1

    print(f"\nIntegrity Check:")
    print(f"  Empty Madurese word entries   : {empty_madura}")
    print(f"  Empty Indonesian translations : {empty_indo}")
    print(f"  Empty Tingkatan field         : {empty_tingkat} ({(empty_tingkat/total_records)*100:.1f}%)")
    print(f"  Exact Triplet Duplicates      : {exact_duplicates}")
    print(f"  Distinct Madurese Lemmas      : {len(madura_words)}")
    print(f"  Distinct Indonesian Words     : {len(indo_words)}")

    print(f"\nTingkatan Distribution:")
    for t, cnt in tingkatan_counter.most_common():
        label = t if t else "(kosong / netral)"
        print(f"  - {label:<20}: {cnt:>5} ({cnt/total_records*100:>5.1f}%)")

    print(f"\nDiacritics & Special Glyphs in Madurese words:")
    for ch, cnt in madura_diacritics.most_common():
        name = "Apostrophe/Glottal" if ch in "'’`" else ("E-Taling / e-open" if ch == 'è' else ("A-Back / o-sound" if ch == 'â' else "Punctuation/Hyphen"))
        print(f"  - {repr(ch):<8} (U+{ord(ch):04X}): {cnt:>5} occurrences -> {name}")

    print(f"\nPolysemy & Synonymity Samples:")
    multi_meaning_madura = [(k, v) for k, v in madura_to_indo.items() if len(v) > 1]
    print(f"  Madurese words with >1 Indonesian translations: {len(multi_meaning_madura)}")
    for k, v in multi_meaning_madura[:5]:
        print(f"    * '{k}': {v}")

    multi_madura_for_indo = [(k, v) for k, v in indo_to_madura.items() if len(v) > 1]
    print(f"  Indonesian words with >1 Madurese counterparts: {len(multi_madura_for_indo)}")
    for k, v in multi_madura_for_indo[:5]:
        print(f"    * '{k}': {v}")

if __name__ == "__main__":
    inspect_repository()
    inspect_dataset()
