import csv
from collections import defaultdict
import math

file_path = r"g:\My Drive\2026-theo-github\theo-armour-sandbox\cookbook\2025-taxes\gemini\chase-4127\Chase4127_Cleaned.csv"
output_path = r"g:\My Drive\2026-theo-github\theo-armour-sandbox\cookbook\2025-taxes\gemini\chase-4127\2025_CC_Summary.md"

total_spend = 0.0
total_payments = 0.0
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

            # Group identical payees
            payee_totals[desc] += amt

            # Sale/Debit is negative in this CSV format. Payments to the card are positive.
            if amt < 0:
                total_spend += amt
            else:
                total_payments += amt
        except ValueError:
            continue

# Sort categories (Expenses/negative values first)
sorted_categories = sorted(category_totals.items(), key=lambda x: x[1])

# Top Expenes logic
top_expenses = sorted([(k, v) for k, v in payee_totals.items() if v < 0], key=lambda x: x[1])

with open(output_path, 'w', encoding='utf-8') as out:
    out.write("# 2025 Chase Credit Card (4127) Summary\n\n")

    out.write("## 💳 High-Level Overview\n")
    out.write(f"- **Total Spend (Charges):** ${abs(total_spend):,.2f}\n")
    out.write(f"- **Total Card Payments/Credits (Inflow):** ${total_payments:,.2f}\n")
    out.write(f"- **Net Balance Change:** ${(total_payments + total_spend):,.2f}\n")
    out.write("\n*(Note: negative category totals indicate money spent)*\n\n")

    out.write("## 📊 Spending Totals by Category\n")
    out.write("| Category | Total Amount |\n")
    out.write("| :--- | :--- |\n")
    for cat, amt in sorted_categories:
        out.write(f"| {cat} | ${amt:,.2f} |\n")

    out.write("\n## 📉 Top 15 Largest Spending Payees\n")
    out.write("| Payee/Description | Total Amount |\n")
    out.write("| :--- | :--- |\n")
    for payee, amt in top_expenses[:15]:
        out.write(f"| {payee} | ${amt:,.2f} |\n")

print(f"Summary written to {output_path}")

# VERIFICATION SCRIPT BLOCK
original_file = r"g:\My Drive\2026-theo-github\theo-armour-sandbox\cookbook\2025-taxes\gemini\chase-4127\Chase4127_Activity20250101_20251231_20260301.CSV"

def get_transaction_sums(filepath):
    inflow = 0.0
    outflow = 0.0
    with open(filepath, 'r', encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)
        for row in reader:
            if not row.get('Description'): continue
            try:
                amt = float(row.get('Amount', '0'))
                if amt > 0: inflow += amt
                else: outflow += amt
            except ValueError:
                pass
    return inflow, outflow

orig_in, orig_out = get_transaction_sums(original_file)
print("\n--- Integrity Check ---")
if math.isclose(orig_in, total_payments, abs_tol=0.01) and math.isclose(orig_out, total_spend, abs_tol=0.01):
    print("✅ PASS: Cleaned sums match original raw original file exactly.")
else:
    print("❌ FAIL: Discrepancy found.")
