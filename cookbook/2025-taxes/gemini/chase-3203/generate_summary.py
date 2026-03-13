import csv
from collections import defaultdict

file_path = r"g:\My Drive\2026-theo-github\theo-armour-sandbox\cookbook\2025-taxes\gemini\Chase_2025_Taxes_Cleaned.csv"
output_path = r"g:\My Drive\2026-theo-github\theo-armour-sandbox\cookbook\2025-taxes\gemini\2025_transactions_summary.md"

total_income = 0.0
total_expense = 0.0
category_totals = defaultdict(float)
payee_totals = defaultdict(float)

with open(file_path, 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        try:
            amt = float(row.get('Amount', '0'))
            category = row.get('Category', 'Uncategorized')
            desc = row.get('Description', '').strip()

            category_totals[category] += amt
            payee_totals[desc] += amt

            if amt > 0:
                total_income += amt
            else:
                total_expense += amt
        except ValueError:
            continue

# Sort categories (Expenses first (more negative), then income)
sorted_categories = sorted(category_totals.items(), key=lambda x: x[1])

# Sort Payees (Expenses: lowest to highest meaning most negative first. Income: highest positive first)
top_expenses = sorted([(k, v) for k, v in payee_totals.items() if v < 0], key=lambda x: x[1])
top_income = sorted([(k, v) for k, v in payee_totals.items() if v > 0], key=lambda x: x[1], reverse=True)

with open(output_path, 'w', encoding='utf-8') as out:
    out.write("# 2025 Chase Account Summary\n\n")

    out.write("## 💵 High-Level Overview\n")
    out.write(f"- **Total Inflows (Credits):** ${total_income:,.2f}\n")
    out.write(f"- **Total Outflows (Debits):** ${total_expense:,.2f}\n")
    out.write(f"- **Net Cash Flow:** ${(total_income + total_expense):,.2f}\n\n")

    out.write("## 📊 Totals by Category\n")
    out.write("| Category | Total Amount |\n")
    out.write("| :--- | :--- |\n")
    for cat, amt in sorted_categories:
        out.write(f"| {cat} | ${amt:,.2f} |\n")

    out.write("\n## 📈 Top 5 Income Sources\n")
    out.write("| Source/Payee | Total Amount |\n")
    out.write("| :--- | :--- |\n")
    for payee, amt in top_income[:5]:
        out.write(f"| {payee} | ${amt:,.2f} |\n")

    out.write("\n## 📉 Top 10 Largest Expenses\n")
    out.write("| Payee/Description | Total Amount |\n")
    out.write("| :--- | :--- |\n")
    for payee, amt in top_expenses[:10]:
        out.write(f"| {payee} | ${amt:,.2f} |\n")

print(f"Summary written to {output_path}")
