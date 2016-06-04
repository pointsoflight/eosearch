# Points of Light EO Search

Points of Light EO Search uses the [IRS' Master EO File](https://www.irs.gov/charities-non-profits/exempt-organizations-business-master-file-extract-eo-bmf) to convert a set of CSV files into a searchable API of Tax Exempt Organizations in the United States. Points of Light needs this to support other charitable organizations in our mission. 

This project stated as a National Day of Civic Hacking project by [Code for Atlanta](http://codeforatlanta.org)

## Specifictions

This is mainly intended to be a fast lookup service for other projects. The API should support lookup by EIN, city, state, or zip, and return JSON of matching rows in the database. 

Bonus points for automating the fetching of CSVs from the IRS website, and auto-loading them into a mySQL instance. 



## API

The API has two endpoints. If you know the EIN of the EO, simply do a `GET` request to `/api/records/{EIN}`.

     GET /api/records/650206641


If you need to query for other columns, do a `GET` request to `/api/records` and pass in your query as query parameters.
These are in the format `columnname=value`. Columns `name`, `address`, `street`, and `city` are fuzzy search, so it will
match all EOs where that column contains the given string. The rest of the columns are exact matching.

You can order results by column. If you only need to order by one column ascending, simply use `order=column_name`. To order
descending or order on multiple columns, use the object syntax:  `order[column1]=asc&order[column2]=desc`.

All results are paginated to limit the amount of data transferred. The endpoint will return a maximum of 50 results.
To get the next page of results, add `page=n` to the query. You can reduce the number of results per page using `per_page=n`.

    GET /api/records?city=atlanta&page=1&per_page=5

### Columns
