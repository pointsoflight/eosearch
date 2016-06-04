# Points of Light EO Search

Points of Light EO Search uses the [IRS' Master EO File](https://www.irs.gov/charities-non-profits/exempt-organizations-business-master-file-extract-eo-bmf) to convert a set of CSV files into a searchable API of Tax Exempt Organizations in the United States. Points of Light needs this to support other charitable organizations in our mission. 

This project stated as a National Day of Civic Hacking project, and is hosted by [Code for Atlanta](http://codeforatlanta.org).

## Specifictions

This is mainly intended to be a fast lookup service for other projects. The API should support lookup by EIN, city, state, or zip, and return JSON of matching rows in the database. 

Bonus points for automating the fetching of CSVs from the IRS website, and auto-loading them into a mySQL instance. 


## API

The API has two endpoints. If you know the EIN of the EO, simply do a `GET` request to `/api/records/{EIN}`.

     GET /api/records/650206641

```js
{
  "ein": "650206641",
  "name": "POINTS OF LIGHT FOUNDATION",
  "ico": "% MONIQUE SAUNDERS PATRICK",
  "street": "600 MEANS STREET NW",
  "city": "ATLANTA",
  "state": "GA",
  "zip": "30318-5799",
  "eo_group": 0,
  "subsection": 3,
  "affiliation": 3,
  "classification": 1000,
  "ruling": "199105",
  "deductibility": 1,
  "foundation": 15,
  "activity": "603000000",
  "organization": 1,
  "status": 1,
  "tax_period": "201409",
  "asset_cd": 8,
  "income_cd": 8,
  "filing_req_cd": 1,
  "pf_filing_req_cd": 0,
  "acct_pd": 9,
  "asset_amt": "20847276",
  "income_amt": "25997816",
  "revenue_amt": "25330967",
  "ntee_cd": "T400",
  "sort_name": null
}
```


If you need to query for other columns, do a `GET` request to `/api/records` and pass in your query as query parameters.
These are in the format `columnname=value`. Columns `'name', 'ico', 'street', 'city', 'state', 'zip'` are fuzzy search, so it will
match all EOs where that column contains the given string. The rest of the columns are exact matching.

You can order results by column. If you only need to order by one column ascending, simply use `order=column_name`. To order
descending or order on multiple columns, use the object syntax:  `order[column1]=asc&order[column2]=desc`.

All results are paginated to limit the amount of data transferred. The endpoint will return a maximum of 50 results.
To get the next page of results, add `page=n` to the query. You can reduce the number of results per page using `per_page=n`.

Results are a JSON object with results inside an array in the key `results`. Pagination info is given in an object `pagination`.

    GET /api/records?city=atlanta&name=points&order=ruling&per_page=5


```js
{
  "results": [
    {
      "ein": "581560757",
      "name": "LITTLE FIVE POINTS COMMUNITY CENTER INCORPORATED",
      "ico": null,
      "street": "1083 AUSTIN AVE NE",
      "city": "ATLANTA",
      "state": "GA",
      "zip": "30307-1940",
      "eo_group": 0,
      "subsection": 3,
      "affiliation": 3,
      "classification": 1200,
      "ruling": "198411",
      "deductibility": 1,
      "foundation": 16,
      "activity": "400000000",
      "organization": 1,
      "status": 1,
      "tax_period": "201412",
      "asset_cd": 4,
      "income_cd": 4,
      "filing_req_cd": 1,
      "pf_filing_req_cd": 0,
      "acct_pd": 12,
      "asset_amt": "437449",
      "income_amt": "220785",
      "revenue_amt": "220785",
      "ntee_cd": null,
      "sort_name": null
    },
    {
      "ein": "650206641",
      "name": "POINTS OF LIGHT FOUNDATION",
      "ico": "% MONIQUE SAUNDERS PATRICK",
      "street": "600 MEANS STREET NW",
      "city": "ATLANTA",
      "state": "GA",
      "zip": "30318-5799",
      "eo_group": 0,
      "subsection": 3,
      "affiliation": 3,
      "classification": 1000,
      "ruling": "199105",
      "deductibility": 1,
      "foundation": 15,
      "activity": "603000000",
      "organization": 1,
      "status": 1,
      "tax_period": "201409",
      "asset_cd": 8,
      "income_cd": 8,
      "filing_req_cd": 1,
      "pf_filing_req_cd": 0,
      "acct_pd": 9,
      "asset_amt": "20847276",
      "income_amt": "25997816",
      "revenue_amt": "25330967",
      "ntee_cd": "T400",
      "sort_name": null
    }
  ],
  "pagination": {
    "count": 2,
    "page": 1,
    "per_page": 5
  }
}
```

### Columns

    ein
    name
    ico
    street
    city
    state
    zip
    eo_group
    subsection
    affiliation
    classification
    ruling
    deductibility
    foundation
    activity
    organization
    status
    tax_period
    asset_cd
    income_cd
    filing_req_cd
    pf_filing_req_cd
    acct_pd
    asset_amt
    income_amt
    revenue_amt
    ntee_cd
    sort_nam

### Contributors

