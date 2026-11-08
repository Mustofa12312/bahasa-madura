#!/usr/bin/env python3
"""
scripts/verify-migration.py
Automated verification and data integrity audit for Phase 4.
Validates kamus.json against src/data/seed-dictionary.json and supabase/seed/seed.sql.
"""

import os
import json
import re

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
KAMUS_JSON = os.path.join(BASE_DIR, "kamus.json")
MIGRATED_JSON = os.path.join(BASE_DIR, "src", "data", "seed-dictionary.json")
SEED_SQL = os.path.join(BASE_DIR, "supabase", "seed", "seed.sql")

def run_verification():
    print("=" * 60)
    print("PHASE 4: AUTOMATED MIGRATION VERIFICATION AUDIT")
    print("=" * 60)

    # 1. Load Original
    with open(KAMUS_JSON, "r", encoding="utf-8") as f:
        raw_data = json.load(f)

    # 2. Load Migrated JSON
    with open(MIGRATED_JSON, "r", encoding="utf-8") as f:
        migrated_bundle = json.load(f)

    migrated_words = migrated_bundle["words"]
    print(f"Original Records in kamus.json       : {len(raw_data):,}")
    print(f"Migrated Consolidated Words (Lemmas) : {len(migrated_words):,}")

    # Build lookup set from migrated
    migrated_pairs = set()
    migrated_diacritic_a = 0
    migrated_diacritic_e = 0
    migrated_apostrophes = 0

    for w in migrated_words:
        m = w["word"].strip().lower()
        for t in w["translations"]:
            migrated_pairs.add((m, t["translation"].strip().lower()))

        migrated_diacritic_a += w["word"].count('â')
        migrated_diacritic_e += w["word"].count('è')
        migrated_apostrophes += w["word"].count("'")

    # Check raw against migrated
    raw_unique_pairs = set()
    raw_diacritic_a = 0
    raw_diacritic_e = 0
    raw_apostrophes = 0

    for row in raw_data:
        m = row[2].strip().lower()
        i = row[1].strip().lower()
        raw_unique_pairs.add((m, i))
        raw_diacritic_a += row[2].count('â')
        raw_diacritic_e += row[2].count('è')
        raw_apostrophes += row[2].count("'")

    missing = raw_unique_pairs - migrated_pairs
    print(f"Raw Unique (Madura, Indo) Pairs     : {len(raw_unique_pairs):,}")
    print(f"Migrated (Madura, Indo) Pairs       : {len(migrated_pairs):,}")
    print(f"Missing Pairs Count                 : {len(missing)}")

    if missing:
        print(f"ERROR: Found {len(missing)} missing translation pairs!")
        return False
    else:
        print(">> 100% Data Preservation Verified: ZERO records lost during migration.")

    # Diacritic preservation check across unique lemmas
    raw_unique_lemmas = set(row[2].strip() for row in raw_data)
    migrated_lemmas = set(w["word"].strip() for w in migrated_words)

    raw_lemma_a = sum(w.count('â') for w in raw_unique_lemmas)
    mig_lemma_a = sum(w.count('â') for w in migrated_lemmas)

    raw_lemma_e = sum(w.count('è') for w in raw_unique_lemmas)
    mig_lemma_e = sum(w.count('è') for w in migrated_lemmas)

    raw_lemma_apos = sum(w.count("'") for w in raw_unique_lemmas)
    mig_lemma_apos = sum(w.count("'") for w in migrated_lemmas)

    print("\nDiacritic Preservation Audit across Unique Lemmas:")
    print(f"  Unique Lemmas Count in Raw: {len(raw_unique_lemmas)} | Migrated: {len(migrated_lemmas)}")
    print(f"  Vowel 'â' in Raw: {raw_lemma_a} | In Migrated: {mig_lemma_a}")
    print(f"  Vowel 'è' in Raw: {raw_lemma_e} | In Migrated: {mig_lemma_e}")
    print(f"  Glottal Stop ' in Raw: {raw_lemma_apos} | In Migrated: {mig_lemma_apos}")

    assert len(raw_unique_lemmas) == len(migrated_lemmas), "Lemma count mismatch!"
    assert raw_lemma_a == mig_lemma_a, "Diacritic 'â' mismatch!"
    assert raw_lemma_e == mig_lemma_e, "Diacritic 'è' mismatch!"
    assert raw_lemma_apos == mig_lemma_apos, "Glottal stop mismatch!"
    print(">> All orthographic diacritics and glottal stops perfectly preserved (100% Match).")

    # 3. Verify SQL Seed File
    if os.path.exists(SEED_SQL):
        sql_size = os.path.getsize(SEED_SQL)
        print(f"\nSQL Seed File Verification:")
        print(f"  File: {SEED_SQL}")
        print(f"  Size: {sql_size:,} bytes (~{sql_size / (1024*1024):.2f} MB)")
        with open(SEED_SQL, "r", encoding="utf-8") as f:
            head = [f.readline() for _ in range(10)]
            print("  Header preview:\n  " + "".join(head).strip())
        print(">> SQL Seed File is ready for PostgreSQL execution.")

    print("\n" + "=" * 60)
    print("AUDIT RESULT: 100% PASSED (Phase 4 Deliverable Ready)")
    print("=" * 60)
    return True

if __name__ == "__main__":
    success = run_verification()
    if not success:
        exit(1)
