import csv

file_path = r"g:\My Drive\2026-theo-github\theo-armour-sandbox\cookbook\2025-taxes\gemini\Chase_2025_Taxes_Cleaned.csv"
unique_desc = set()

with open(file_path, 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        if row.get('Description'):
            unique_desc.add(row['Description'].strip())

print("Unique Descriptions:")
for desc in sorted(unique_desc):
    print(f"- {desc}")
