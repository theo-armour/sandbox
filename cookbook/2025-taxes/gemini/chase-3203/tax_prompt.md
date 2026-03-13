# Tax Categorization and Auditing Prompt

I have a raw CSV export of bank transactions for my taxes (e.g., from Chase) and I need it completely cleaned, categorized, and audited. Please act as a data engineer and tax assistant to perform the following steps sequentially in my workspace:

1. **Analyze the Raw Data**
   - Read the original CSV file to understand its structure, columns, and types of transaction descriptions.
   - Look for recurring patterns: Zelle transfers, PayPal, Venmo, tax payments (IRS/FTB), brokerage transfers, specific recurring vendors, and credit card payments.

2. **Develop a Cleaning Script**
   - Write a Python script to create a new, refined CSV.
   - **Column Management:** Keep only Date, Description, Amount, and Type. Drop unnecessary columns like Balance or slip numbers.
   - **Regex String Cleaning:** Automatically strip out all random alphanumeric confirmation codes, PPD IDs, WEB IDs, trailing dates, BillPay confirmations, Zelle JPM IDs, and trailing spaces from the `Description` fields so identical payees can be grouped.
   - **Data Formatting:** Standardize the 'Date' field to standard ISO format (`YYYY-MM-DD`).
   - **Tagging Categories:** Add a new `Category` column using a rule-based logic function. Explicitly separate out categories for: Zelle, PayPal, Venmo, Pershing, Eastern Bank, IRS, FTB, Credit Card Payments, and use reasonable guesses for regular housing, groceries, or dining. Default to "Uncategorized" for the rest.

3. **Generate a Markdown Summary**
   - Write a secondary Python script to aggregate the cleaned CSV logic and export a summary sheet to Markdown.
   - Include a "High-Level Overview" (total inflows, outflows, and net).
   - Output an aggregated list of sums by Category (e.g., how much was completely spent on Zelle, how much on IRS).
   - Generate a list showing the top 5 income sources and top 10 distinct expenses by payee name.

4. **Verify the Integrity of the Pipeline**
   - Write a completely independent Python safety check script.
   - Iterate through every row of both the original raw CSV and the newly cleaned output CSV.
   - Verify that the total number of rows match perfectly.
   - Sum the positive float additions and negative float subtractions completely independently in both files to mathematically prove down to the exact penny that the data manipulation did not result in any deleted values or math errors. Output these test results visibly to the terminal.

Please execute these operations directly by writing and running the scripts in this workspace.
