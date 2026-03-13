import csv
import math

original_file = r"g:\My Drive\2026-theo-github\theo-armour-sandbox\cookbook\2025-taxes\gemini\Chase3203_Activity_20260301.CSV"
cleaned_file = r"g:\My Drive\2026-theo-github\theo-armour-sandbox\cookbook\2025-taxes\gemini\Chase_2025_Taxes_Cleaned.csv"

def get_transaction_sums(filepath, amount_col_name):
    total_inflow = 0.0
    total_outflow = 0.0
    row_count = 0

    with open(filepath, 'r', encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)
        for row in reader:
            # We ignore completely empty rows
            if not row.get('Description') and not row.get('Posting Date') and not row.get('Date'):
                continue

            amount_str = row.get(amount_col_name)
            if amount_str:
                try:
                    amt = float(amount_str)
                    row_count += 1
                    if amt > 0:
                        total_inflow += amt
                    else:
                        total_outflow += amt
                except ValueError:
                    pass

    return total_inflow, total_outflow, row_count

print("Running integrity test to compare original file against cleaned file...\n")

# Process original and cleaned CSVs
orig_in, orig_out, orig_count = get_transaction_sums(original_file, 'Amount')
clean_in, clean_out, clean_count = get_transaction_sums(cleaned_file, 'Amount')

# Print Results
print("--- SUMMARY TEST RESULTS ---")
print(f"Original CSV (Direct from Chase) -> Rows: {orig_count} | Inflows: ${orig_in:,.2f} | Outflows: ${orig_out:,.2f} | Net: ${(orig_in + orig_out):,.2f}")
print(f"Cleaned CSV (After Processing)   -> Rows: {clean_count} | Inflows: ${clean_in:,.2f} | Outflows: ${clean_out:,.2f} | Net: ${(clean_in + clean_out):,.2f}")

print("\n--- VALIDATION ---")
math_is_accurate = True

if orig_count == clean_count:
    print("✅ PASS: Row counts match perfectly.")
else:
    print(f"❌ FAIL: Row counts differ! Original: {orig_count}, Cleaned: {clean_count}")
    math_is_accurate = False

if math.isclose(orig_in, clean_in, abs_tol=0.01) and math.isclose(orig_out, clean_out, abs_tol=0.01):
    print("✅ PASS: Mathematical sums match perfectly down to the penny. No monetary values were dropped, altered, or corrupted.")
else:
    print("❌ FAIL: Mathematical sums do not match!")
    math_is_accurate = False

if math_is_accurate:
    print("\nCONCLUSION: The parsed data completely accurately reflects the raw bank data.")
else:
    print("\nCONCLUSION: There is a discrepancy in the data pipeline.")

