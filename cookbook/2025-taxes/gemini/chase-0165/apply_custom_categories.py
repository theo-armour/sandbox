import csv
from collections import defaultdict
import re

# File Paths
mappings_file = r"g:\My Drive\2026-theo-github\theo-armour-sandbox\cookbook\2025-taxes\gemini\chase-4127\unique_payees_4127.md"
raw_transactions_file = r"g:\My Drive\2026-theo-github\theo-armour-sandbox\cookbook\2025-taxes\gemini\chase-0165\Chase0165_Activity20250101_20251231_20260313.CSV"
output_path = r"g:\My Drive\2026-theo-github\theo-armour-sandbox\cookbook\2025-taxes\gemini\chase-0165\custom_category_totals_0165.md"

# 1. Parse your custom mappings from the 4127 file
payee_category_map = {}
with open(mappings_file, 'r', encoding='utf-8') as mf:
    for line in mf:
        line = line.strip()
        if line.startswith('- '):
            content = line[2:]
            if ',' in content:
                parts = content.rsplit(',', 1)
                payee_name = parts[0].strip().lower()
                category = parts[1].strip()
                # Store the lowercased mapping
                payee_category_map[payee_name] = category

# Additional explicit catch-alls based on common patterns in 0165
payee_category_map["amazon mktpl"] = "Shopping"
payee_category_map["amazon.com"] = "Shopping"
payee_category_map["amzn digital"] = "Shopping"
payee_category_map["safeway"] = "Groceries"
payee_category_map["uber"] = "Travel"
payee_category_map["anthropic"] = "AI"
payee_category_map["perplexity"] = "AI"
payee_category_map["claude.ai"] = "AI"

# 2. Iterate through transactions and map to custom categories
totals = defaultdict(float)
unmapped_totals = defaultdict(float)

with open(raw_transactions_file, 'r', encoding='utf-8-sig') as tf:
    reader = csv.DictReader(tf)
    for row in reader:
        desc = row.get('Description', '').strip()
        desc_lower = desc.lower()
        amount_str = row.get('Amount', '0')

        try:
            amount = float(amount_str)
            # Match Custom Category
            matched_cat = "Uncategorized"

            # Simple substring matching
            for k_payee, cat in payee_category_map.items():
                if k_payee in desc_lower:
                    matched_cat = cat
                    break

            if matched_cat == "Uncategorized":
                # Fall back to Chase's native category if no custom mapping found
                native_cat = row.get('Category', '').strip()
                if native_cat:
                    matched_cat = f"{native_cat} (Chase Default)"

            totals[matched_cat] += amount

            if matched_cat == "Uncategorized" or "Chase Default" in matched_cat:
                # Track what we couldn't explicitly map with your custom dictionary
                # Clean up descriptor for grouping
                clean_desc = re.sub(r'\*[A-Z0-9]{6,}$', '', desc)
                clean_desc = re.sub(r' [A-Z0-9]{6,}$', '', clean_desc)
                unmapped_totals[clean_desc] += amount

        except ValueError:
            pass

# 3. Sort output
sorted_totals = sorted(totals.items(), key=lambda x: x[1])

# 4. Write to Markdown
with open(output_path, 'w', encoding='utf-8') as out:
    out.write("# Credit Card Custom Category Totals (Chase 0165 - 2025)\n\n")
    out.write("*Derived using your custom mappings from the 4127 list + Chase Defaults for unmapped items*\n\n")
    out.write("| Category | Total Amount |\n")
    out.write("| :--- | :--- |\n")
    for category, total in sorted_totals:
        out.write(f"| {category} | ${total:,.2f} |\n")

    out.write("\n## Major Unmapped Payees (Falling back to Chase Defaults)\n")
    if unmapped_totals:
        # Show top 15 unmapped items
        top_unmapped = sorted(unmapped_totals.items(), key=lambda x: x[1])[:15]
        for payee, total in top_unmapped:
            out.write(f"- {payee}: ${total:,.2f}\n")

print(f"Successfully calculated custom category totals and saved to {output_path}")
