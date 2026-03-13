import csv
import re
from collections import defaultdict

input_file = r"g:\My Drive\2026-theo-github\theo-armour-sandbox\cookbook\2025-taxes\gemini\chase-0165\Chase0165_Activity20250101_20251231_20260313.CSV"
output_file = r"g:\My Drive\2026-theo-github\theo-armour-sandbox\cookbook\2025-taxes\gemini\chase-0165\unique_payees_0165.md"

def clean_payee_name(desc):
    # Remove obvious random alphanumeric trailing IDs
    # E.g. AMAZON MKTPL*IV9TG3473 -> AMAZON MKTPL*
    desc = re.sub(r'\*[A-Z0-9]{6,}$', '', desc)
    desc = re.sub(r' [A-Z0-9]{6,}$', '', desc)

    # Store IDs / Location IDs (e.g. SAFEWAY #1711 -> SAFEWAY)
    desc = re.sub(r'\s*#\s*\d+', '', desc)

    # Remove HTML entities like &amp;
    desc = desc.replace('&amp;', '&')

    # UBER   *TRIP -> UBER *TRIP
    desc = re.sub(r'\s+', ' ', desc)

    return desc.strip()

payee_groups = defaultdict(set)

with open(input_file, mode='r', encoding='utf-8-sig') as infile:
    reader = csv.DictReader(infile)
    for row in reader:
        desc = row.get('Description', '').strip()
        if not desc:
            continue

        cleaned = clean_payee_name(desc)
        payee_groups[cleaned].add(desc)

with open(output_file, mode='w', encoding='utf-8') as out:
    out.write("# Unique Credit Card Payees (Chase 0165 - 2025)\n\n")
    out.write("Here is the list of unique payees, with similar names grouped together automatically:\n\n")

    for cleaned_name in sorted(payee_groups.keys(), key=lambda x: x.lower()):
        out.write(f"- **{cleaned_name}**\n")

        # If there are variations from the raw data that were grouped into this name, list them:
        variations = sorted(payee_groups[cleaned_name])
        if len(variations) > 1 or variations[0] != cleaned_name:
            out.write(f"  - *(Originals: {', '.join(variations)})*\n")

print(f"Unique payees extracted and grouped to {output_file}")
