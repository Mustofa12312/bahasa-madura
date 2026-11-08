#!/usr/bin/env python3
"""
scripts/migrate-dictionary.py
Transforms kamus.json into normalized, categorized, and indexed records.
Outputs:
1. src/data/seed-dictionary.json (for frontend offline-first instant search)
2. supabase/seed/seed.sql (PostgreSQL database seed)
"""

import os
import json
import re
import uuid
from collections import defaultdict

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
KAMUS_JSON = os.path.join(BASE_DIR, "kamus.json")
OUTPUT_JSON = os.path.join(BASE_DIR, "src", "data", "seed-dictionary.json")
OUTPUT_SEED_SQL = os.path.join(BASE_DIR, "supabase", "seed", "seed.sql")

SPEECH_LEVEL_MAP = {
    "": "netral",
    "lomrah": "enja_iya",
    "tengngaan": "engghi_enten",
    "alos": "engghi_bhunten",
    "alos tengghi": "engghi_bhunten"
}

CATEGORIES = [
    {"slug": "kata-kerja", "name": "Kata Kerja (Verba)", "desc": "Aktivitas dan tindakan", "icon": "Activity"},
    {"slug": "kata-benda", "name": "Kata Benda (Nomina)", "desc": "Objek, benda fisik, dan materi", "icon": "Box"},
    {"slug": "kata-sifat", "name": "Kata Sifat (Adjektiva)", "desc": "Kondisi, karakter, dan rasa", "icon": "Sparkles"},
    {"slug": "sapaan-dan-ganti", "name": "Sapaan & Kata Ganti", "desc": "Panggilan orang dan pronomina", "icon": "Users"},
    {"slug": "budaya-dan-tradisi", "name": "Istilah Budaya", "desc": "Tradisi, kesenian, dan adat Madura", "icon": "Landmark"},
    {"slug": "keluarga-dan-kekerabatan", "name": "Keluarga & Kekerabatan", "desc": "Sebutan relasi keluarga", "icon": "HeartHandshake"},
    {"slug": "sehari-hari", "name": "Kosakata Sehari-hari", "desc": "Percakapan dan interaksi umum", "icon": "MessageCircle"}
]

PRONOUNS_MADURA = {"abâ'na", "ajunan", "bâ'en", "bâ'na", "dhika", "dhikoh", "kakèh", "panjhennengngan", "sampèyan", "sèdâh", "engko'", "kula", "abdhina", "bula"}
FAMILY_WORDS_INDO = {"ayah", "ibu", "kakek", "nenek", "paman", "bibi", "kakak", "adik", "anak", "cucu", "mertua", "menantu", "saudara", "suami", "istri"}
CULTURE_WORDS_MADURA = {"sakera", "karapan", "batik", "clurit", "sapi", "tanean", "lanjang", "tandhang", "saronen", "macopat"}

def normalize_text(text):
    s = text.lower()
    s = s.replace('â', 'a').replace('è', 'e')
    s = s.replace('’', "'").replace('`', "'")
    s = re.sub(r"[^a-z0-9'\s-]", "", s)
    return s.strip()

def create_slug(text, existing_slugs):
    base = re.sub(r"[^a-z0-9]+", "-", normalize_text(text)).strip("-")
    if not base:
        base = "kata"
    slug = base
    counter = 2
    while slug in existing_slugs:
        slug = f"{base}-{counter}"
        counter += 1
    existing_slugs.add(slug)
    return slug

def detect_category(madura, indo):
    m_lower = madura.lower()
    i_lower = indo.lower()

    if m_lower in PRONOUNS_MADURA or "kamu" in i_lower or "saya" in i_lower or "dia" in i_lower or "mereka" in i_lower or "kami" in i_lower:
        return "sapaan-dan-ganti"
    
    for fw in FAMILY_WORDS_INDO:
        if fw in i_lower.split():
            return "keluarga-dan-kekerabatan"
            
    for cw in CULTURE_WORDS_MADURA:
        if cw in m_lower:
            return "budaya-dan-tradisi"

    # Verb detection heuristics
    verb_indo_prefixes = ("me", "ber", "ter", "di")
    words_indo = i_lower.split()
    first_indo = words_indo[0] if words_indo else ""
    if any(first_indo.startswith(p) for p in ("mem", "men", "meng", "meny", "ber", "ter")):
        return "kata-kerja"

    # Adjective heuristics
    adj_keywords = {"bagus", "cantik", "manis", "pahit", "asam", "asin", "sehat", "sakit", "panas", "dingin", "besar", "kecil", "tinggi", "rendah", "cepat", "lambat", "enak", "sedap", "kuat", "lemah", "senang", "susah", "marah", "takut", "berani"}
    if any(ak in words_indo for ak in adj_keywords):
        return "kata-sifat"

    if m_lower.startswith("a") and len(m_lower) > 3 and not m_lower.startswith("ab"):
        return "kata-kerja"

    return "sehari-hari"

def main():
    print("=" * 60)
    print("MIGRATING KAMUS.JSON TO STRUCTURED REPOSITORIES")
    print("=" * 60)

    with open(KAMUS_JSON, "r", encoding="utf-8") as f:
        raw_data = json.load(f)

    print(f"Total raw records read: {len(raw_data)}")

    # Group by Madurese word
    grouped = defaultdict(list)
    for idx, (tingkat_raw, indo_raw, madura_raw) in enumerate(raw_data):
        tingkat = tingkat_raw.strip()
        indo = indo_raw.strip()
        madura = madura_raw.strip()
        grouped[madura.lower()].append({
            "original_case": madura,
            "raw_level": tingkat,
            "speech_level": SPEECH_LEVEL_MAP.get(tingkat, "netral"),
            "translation": indo,
            "original_index": idx
        })

    existing_slugs = set()
    category_map = {c["slug"]: c for c in CATEGORIES}
    category_counts = Counter()

    processed_words = []
    
    for m_lower, entries in grouped.items():
        primary_word = entries[0]["original_case"]
        
        # Determine highest/most specific speech level
        levels = [e["speech_level"] for e in entries]
        if "engghi_bhunten" in levels:
            primary_level = "engghi_bhunten"
        elif "engghi_enten" in levels:
            primary_level = "engghi_enten"
        elif "enja_iya" in levels:
            primary_level = "enja_iya"
        else:
            primary_level = "netral"

        # Unique translations
        unique_translations = []
        seen_t = set()
        for e in entries:
            t = e["translation"]
            if t.lower() not in seen_t:
                seen_t.add(t.lower())
                unique_translations.append({
                    "translation": t,
                    "speech_level": e["speech_level"]
                })

        all_indo_text = ", ".join(t["translation"] for t in unique_translations)
        category_slug = detect_category(primary_word, all_indo_text)
        category_counts[category_slug] += 1
        
        slug = create_slug(primary_word, existing_slugs)
        normalized = normalize_text(primary_word)

        word_obj = {
            "id": f"w_{len(processed_words) + 1}",
            "slug": slug,
            "word": primary_word,
            "normalized": normalized,
            "definition": all_indo_text,
            "speech_level": primary_level,
            "category_slug": category_slug,
            "category_name": category_map[category_slug]["name"],
            "translations": unique_translations,
            "examples": [],
            "source": "kamus.madura.web.id"
        }
        processed_words.append(word_obj)

    print(f"Total consolidated words created: {len(processed_words)}")
    print("\nCategory Distribution:")
    for cat in CATEGORIES:
        cnt = category_counts[cat["slug"]]
        print(f"  - {cat['name']:<25}: {cnt:>5} words")

    # Save to src/data/seed-dictionary.json
    output_bundle = {
        "version": "1.0.0",
        "generated_at": "2026-11-08T00:00:00Z",
        "total_words": len(processed_words),
        "categories": CATEGORIES,
        "words": processed_words
    }

    with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
        json.dump(output_bundle, f, ensure_ascii=False, indent=2)

    print(f"\nSaved structured bundle to: {OUTPUT_JSON} ({os.path.getsize(OUTPUT_JSON)} bytes)")

    # Generate supabase/seed/seed.sql
    print("Generating supabase/seed/seed.sql...")
    with open(OUTPUT_SEED_SQL, "w", encoding="utf-8") as f:
        f.write("-- Kamus Madura Digital Seed Data\n\n")
        f.write("-- Categories\n")
        for cat in CATEGORIES:
            f.write(f"INSERT INTO categories (id, name, slug, description, icon_name) VALUES (gen_random_uuid(), '{cat['name']}', '{cat['slug']}', '{cat['desc']}', '{cat['icon']}') ON CONFLICT (slug) DO NOTHING;\n")
        f.write("\n")
        
        f.write("-- Words Sample (First 500 rows generated for direct SQL testing)\n")
        for w in processed_words[:500]:
            safe_def = w['definition'].replace("'", "''")
            safe_word = w['word'].replace("'", "''")
            f.write(f"INSERT INTO words (slug, word, normalized_word, definition, speech_level) VALUES ('{w['slug']}', '{safe_word}', '{w['normalized']}', '{safe_def}', '{w['speech_level']}') ON CONFLICT (slug) DO NOTHING;\n")

    print(f"Saved seed SQL to: {OUTPUT_SEED_SQL} ({os.path.getsize(OUTPUT_SEED_SQL)} bytes)")
    print("\nMigration Completed Successfully!")

if __name__ == "__main__":
    from collections import Counter
    main()
