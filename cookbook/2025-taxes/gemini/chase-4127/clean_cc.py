import csv
import re
from datetime import datetime

input_file = r"g:\My Drive\2026-theo-github\theo-armour-sandbox\cookbook\2025-taxes\gemini\chase-4127\Chase4127_Activity20250101_20251231_20260301.CSV"
output_file = r"g:\My Drive\2026-theo-github\theo-armour-sandbox\cookbook\2025-taxes\gemini\chase-4127\Chase4127_Cleaned.csv"

def clean_description(desc):
    # Remove obvious random alphanumeric trailing IDs like P3D7018105 or G5wQMP
    desc = re.sub(r' [a-zA-Z0-9]{6,}$', '', desc)
    # Remove HTML entities like &amp;
    desc = desc.replace('&amp;', '&')
    # Remove extra spaces
    desc = re.sub(r'\s+', ' ', desc)
    return desc.strip()

with open(input_file, mode='r', encoding='utf-8-sig') as infile, \
     open(output_file, mode='w', newline='', encoding='utf-8') as outfile:

    reader = csv.DictReader(infile)

    fieldnames = ['Transaction Date', 'Description', 'Category', 'Type', 'Amount']
    writer = csv.DictWriter(outfile, fieldnames=fieldnames)
    writer.writeheader()

    for row in reader:
        if not row.get('Transaction Date') and not row.get('Description'):
            continue

        # Parse and format date to YYYY-MM-DD
        try:
            date_obj = datetime.strptime(row['Transaction Date'], '%m/%d/%Y')
            formatted_date = date_obj.strftime('%Y-%m-%d')
        except (ValueError, TypeError):
            formatted_date = row.get('Transaction Date', '')

        cleaned_desc = clean_description(row.get('Description', ''))

        writer.writerow({
            'Transaction Date': formatted_date,
            'Description': cleaned_desc,
            'Category': row.get('Category', ''),
            'Type': row.get('Type', ''),
            'Amount': row.get('Amount', '')
        })

print(f"Successfully cleaned Credit Card data. Output saved to {output_file}")
