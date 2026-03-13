import re
import csv

input_md = r"g:\My Drive\2026-theo-github\theo-armour-sandbox\cookbook\2025-taxes\gemini\chase-0165\unique_payees_0165.md"
output_csv = r"g:\My Drive\2026-theo-github\theo-armour-sandbox\cookbook\2025-taxes\gemini\chase-0165\payees_to_categorize_0165.csv"

payees = []

with open(input_md, 'r', encoding='utf-8') as f:
    for line in f:
        # Extract the bolded payee names
        match = re.match(r'^- \*\*(.*)\*\*', line)
        if match:
            payees.append(match.group(1))

with open(output_csv, 'w', newline='', encoding='utf-8') as f:
    writer = csv.writer(f)
    writer.writerow(['Payee Name', 'Custom Category'])
    for payee in payees:
        writer.writerow([payee, ''])

print(f"Successfully generated CSV for manual categorization at {output_csv}")
