import csv
from collections import defaultdict
import re

# File Paths
mappings_file = r"g:\My Drive\2026-theo-github\theo-armour-sandbox\cookbook\2025-taxes\gemini\chase-4127\unique_payees_4127.md"
transactions_file = r"g:\My Drive\2026-theo-github\theo-armour-sandbox\cookbook\2025-taxes\gemini\chase-4127\Chase4127_Cleaned.csv"
output_path = r"g:\My Drive\2026-theo-github\theo-armour-sandbox\cookbook\2025-taxes\gemini\chase-4127\custom_category_totals_4127.md"

# 1. Parse your custom mappings
payee_category_map = {}
with open(mappings_file, 'r', encoding='utf-8') as mf:
    for line in mf:
        line = line.strip()
        if line.startswith('- '):
            # Parse out: - PAYEE NAME, Category
            content = line[2:]
            if ',' in content:
                # Split from the RIGHT in case payee name has commas (unlikely but safe)
                parts = content.rsplit(',', 1)
                payee_name = parts[0].strip()
                category = parts[1].strip()
                payee_category_map[payee_name.lower()] = category

# 2. Iterate through transactions and map to your custom categories
totals = defaultdict(float)
unmapped_totals = defaultdict(float)

with open(transactions_file, 'r', encoding='utf-8') as tf:
    reader = csv.DictReader(tf)
    for row in reader:
        desc = row.get('Description', '').strip()
        desc_lower = desc.lower()
        amount_str = row.get('Amount', '0')

        try:
            amount = float(amount_str)
            # Find matching category
            # We will try to map exact matches, or partial matches if the map key is within the description
            matched_cat = "Uncategorized"
            for k_payee, cat in payee_category_map.items():
                if k_payee in desc_lower:  # partial matching handles things like "Marina Cleaners Inc" vs "Marina Cleaners Inc."
                    matched_cat = cat
                    break

            if matched_cat == "Uncategorized":
                unmapped_totals[desc] += amount
            else:
                totals[matched_cat] += amount

        except ValueError:
            pass

# 3. Sort output
sorted_totals = sorted(totals.items(), key=lambda x: x[1])

# 4. Write to Markdown
with open(output_path, 'w', encoding='utf-8') as out:
    out.write("# Credit Card Custom Category Totals (Chase 4127 - 2025)\n\n")
    out.write("*Based on your manual mappings in unique_payees_4127.md*\n\n")
    out.write("| Custom Category | Total Amount |\n")
    out.write("| :--- | :--- |\n")
    for category, total in sorted_totals:
        out.write(f"| {category} | ${total:,.2f} |\n")

    out.write("\n## Unmapped Items (Not found in your dictionary)\n")
    if unmapped_totals:
        for payee, total in sorted(unmapped_totals.items(), key=lambda x: x[1]):
            out.write(f"- {payee}: ${total:,.2f}\n")
    else:
        out.write("- All items successfully mapped!\n")

print(f"Successfully calculated custom category totals and saved to {output_path}")