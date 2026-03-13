import csv

file_path = r"g:\My Drive\2026-theo-github\theo-armour-sandbox\cookbook\2025-taxes\gemini\chase-4127\Chase4127_Cleaned.csv"
output_path = r"g:\My Drive\2026-theo-github\theo-armour-sandbox\cookbook\2025-taxes\gemini\chase-4127\unique_payees_4127.md"

unique_payees = set()

with open(file_path, 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        # We want to ignore payments made to the card itself if needed, but let's just grab all descriptions
        desc = row.get('Description', '').strip()
        if desc:
            unique_payees.add(desc)

with open(output_path, 'w', encoding='utf-8') as out:
    out.write("# Unique Credit Card Payees (Chase 4127 - 2025)\n\n")
    for payee in sorted(unique_payees):
        out.write(f"- {payee}\n")

print(f"Unique payees extracted and saved to {output_path}")
