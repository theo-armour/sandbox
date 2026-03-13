import csv
from collections import defaultdict

file_path = r"g:\My Drive\2026-theo-github\theo-armour-sandbox\cookbook\2025-taxes\gemini\Chase_2025_Taxes_Cleaned.csv"
output_path = r"g:\My Drive\2026-theo-github\theo-armour-sandbox\cookbook\2025-taxes\gemini\payee_totals.md"

totals = defaultdict(float)

with open(file_path, 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        desc = row.get('Description', '').strip()
        amount_str = row.get('Amount', '0')
        try:
            amount = float(amount_str)
            if desc:
                totals[desc] += amount
        except ValueError:
            pass

# Sort by description alphabetically
sorted_totals = sorted(totals.items(), key=lambda x: x[0])

# Write to markdown file
with open(output_path, 'w', encoding='utf-8') as out:
    out.write("# Payee Totals (2025)\n\n")
    out.write("| Payee/Description | Total Amount |\n")
    out.write("| :--- | :--- |\n")
    for payee, total in sorted_totals:
        out.write(f"| {payee} | ${total:,.2f} |\n")

print(f"Successfully calculated totals and saved to {output_path}")
