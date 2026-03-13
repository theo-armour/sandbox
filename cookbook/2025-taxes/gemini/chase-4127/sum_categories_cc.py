import csv
from collections import defaultdict

file_path = r"g:\My Drive\2026-theo-github\theo-armour-sandbox\cookbook\2025-taxes\gemini\chase-4127\Chase4127_Cleaned.csv"
output_path = r"g:\My Drive\2026-theo-github\theo-armour-sandbox\cookbook\2025-taxes\gemini\chase-4127\category_totals_4127.md"

totals = defaultdict(float)

with open(file_path, 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        category = row.get('Category', 'Uncategorized').strip()
        amount_str = row.get('Amount', '0')
        try:
            amount = float(amount_str)
            if category:
                totals[category] += amount
        except ValueError:
            pass

# Sort by total spending (largest negative values first, which means most money spent)
# The payment category will appear at the bottom with positive balances
sorted_totals = sorted(totals.items(), key=lambda x: x[1])

with open(output_path, 'w', encoding='utf-8') as out:
    out.write("# Credit Card Category Totals (Chase 4127 - 2025)\n\n")
    out.write("| Category | Total Amount |\n")
    out.write("| :--- | :--- |\n")
    for category, total in sorted_totals:
        out.write(f"| {category} | ${total:,.2f} |\n")

print(f"Successfully calculated category totals and saved to {output_path}")
