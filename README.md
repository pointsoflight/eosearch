# Points of Light EO Search

Points of Light EO Search uses the [IRS' Master EO File](https://www.irs.gov/charities-non-profits/exempt-organizations-business-master-file-extract-eo-bmf) to convert a set of CSV files into a searchable API of Tax Exempt Organizations in the United States. Points of Light needs this to support other charitable organizations in our mission. 

This project stated as a National Day of Civic Hacking project by [Code for Atlanta](http://codeforatlanta.org)

## Specifictions

This is mainly intended to be a fast lookup service for other projects. The API should support lookup by EIN, city, state, or zip, and return JSON of matching rows in the database. 

Bonus points for automating the fetching of CSVs from the IRS website, and auto-loading them into a mySQL instance. 
