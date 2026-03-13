import csv
import re
from datetime import datetime

input_file = r"g:\My Drive\2026-theo-github\theo-armour-sandbox\cookbook\2025-taxes\gemini\Chase3203_Activity_20260301.CSV"
output_file = r"g:\My Drive\2026-theo-github\theo-armour-sandbox\cookbook\2025-taxes\gemini\Chase_2025_Taxes_Cleaned.csv"

def clean_description(desc):
    # Remove technical IDs
    desc = re.sub(r'PPD ID:.*', '', desc)
    desc = re.sub(r'WEB ID:.*', '', desc)

    # Remove BillPay specific confirmation IDs
    desc = re.sub(r'Online Payment \d+ To ', 'Online Payment to ', desc)

    # Remove Zelle transaction IDs (JPM[a-z0-9]+ or similar)
    desc = re.sub(r' (JPM[a-z0-9]+|WFCT[A-Z0-9]+|BAC[a-z0-9]+)$', '', desc, flags=re.IGNORECASE)

    # Remove long alphanumeric codes at the end of IRS, Paypal, Student Loan, etc.
    desc = re.sub(r' [A-Z0-9]{10,}\s*$', '', desc)

    # Remove dates commonly found at the end of the string (e.g. 12/26)
    desc = re.sub(r'\s*\d{1,2}/\d{1,2}\s*$', '', desc)

    # Remove extra spaces
    desc = re.sub(r'\s+', ' ', desc)
    return desc.strip()

def categorize(desc):
    desc_lower = desc.lower()
    if 'chase credit crd autopay' in desc_lower or 'llbeanmastercard auto pymt' in desc_lower:
        return 'Credit Card Payments'
    elif 'pershing' in desc_lower:
        return 'Pershing'
    elif 'ct-eastern' in desc_lower:
        return 'Eastern Bank'
    elif 'ssa treas' in desc_lower or 'ssa  treas' in desc_lower:
        return 'Social Security Income'
    elif 'irs usataxpymt' in desc_lower:
        return 'IRS'
    elif 'franchise tax bo' in desc_lower:
        return 'FTB'
    elif 'heritage' in desc_lower:
        return 'Housing / HOA'
    elif 'lawrence fine art' in desc_lower:
        return 'Business Expense / Professional Services'
    elif 'safeway' in desc_lower:
        return 'Groceries'
    elif 'zelle' in desc_lower:
        return 'Zelle'
    elif 'paypal' in desc_lower:
        return 'PayPal'
    elif 'venmo' in desc_lower:
        return 'Venmo'
    elif 'studntloan' in desc_lower:
        return 'Student Loan'
    elif 'atm' in desc_lower or 'withdrawal' in desc_lower or 'deposit' in desc_lower:
        return 'ATM / Cash / Deposits'
    elif 'the brazen head rest' in desc_lower:
        return 'Dining / Restaurants'
    else:
        return 'Uncategorized'

with open(input_file, mode='r', encoding='utf-8-sig') as infile, \
     open(output_file, mode='w', newline='', encoding='utf-8') as outfile:

    reader = csv.DictReader(infile)

    # We will only keep these new field names
    fieldnames = ['Date', 'Description', 'Amount', 'Type', 'Category']
    writer = csv.DictWriter(outfile, fieldnames=fieldnames)
    writer.writeheader()

    for row in reader:
        # Ignore empty rows
        if not row.get('Posting Date') and not row.get('Description'):
            continue

        # Parse and format date from MM/DD/YYYY to YYYY-MM-DD
        try:
            date_obj = datetime.strptime(row['Posting Date'], '%m/%d/%Y')
            formatted_date = date_obj.strftime('%Y-%m-%d')
        except (ValueError, TypeError):
            formatted_date = row.get('Posting Date', '')

        cleaned_desc = clean_description(row.get('Description', ''))
        category = categorize(cleaned_desc)

        writer.writerow({
            'Date': formatted_date,
            'Description': cleaned_desc,
            'Amount': row.get('Amount', ''),
            'Type': row.get('Type', ''),
            'Category': category
        })

print(f"Successfully cleaned data. Output saved to {output_file}")
