var pg = require('pg');
var conString = process.env.DATABASE_URL || "postgres://eosearch@localhost/eosearch";

var squel = require('squel');

var validColumnNames = [
  'ein',
  'name',
  'ico',
  'street',
  'city',
  'state',
  'zip',
  'eo_group',
  'subsection',
  'affiliation',
  'classification',
  'ruling',
  'deductibility',
  'foundation',
  'activity',
  'organization',
  'status',
  'tax_period',
  'asset_cd',
  'income_cd',
  'filing_req_cd',
  'pf_filing_req_cd',
  'acct_pd',
  'asset_amt',
  'income_amt',
  'revenue_amt',
  'ntee_cd',
  'sort_name'
];

var fullSearchColumns = ['name', 'ico', 'street', 'city', 'state', 'zip'];

module.exports = {
  // callback => (err, result)
  findByEin: function(ein, callback){
    pg.connect(conString, function(err, client, done) {
      if(err) {
        console.error('error fetching client from pool', err);
        callback(err, null);
        return;
      }

      client.query(squel.select().from('irs_eo_records').where('EIN = ?', ein).toString(), function(err, result){
        done();
        if(err){
          callback(err, null);
          return;
        }else if(result.rows.length > 0){
          callback(null, result.rows[0]);
        }else{
          callback(null, null);
        }
      });
    });
  },
  // callback => (err, results, paginationInfo)
  query: function(params, callback){
    var queryKeys = Object.keys(params);
    var query = squel.select().from('irs_eo_records');

    for(var i=0; i<queryKeys.length;i++){
      var key = queryKeys[i].toLowerCase();
      var value = params[key];

      // validate column names
      if(validColumnNames.indexOf(key) >= 0){
        if(fullSearchColumns.indexOf(key) >= 0){
          // do contains comparsion
          query = query.where(key+' LIKE ?', '%'+value.toUpperCase()+'%');  
        }else{
          query = query.where(key+' = ?', value);
        }
      }
    }
    
    // ordering. ?order=columnname OR ?order[columnname1]=asc&order[columnname2]=desc
    if(params.order){
      if(typeof params.order === 'string'){
        query = query.order(params.order);
      }else{
        var keys = Object.keys(params.order);
        for(var i=0; i<keys.length; i++){
          var key = keys[i];
          var order = params.order[key].toLowerCase();
          if(order === 'asc'){
            query = query.order(key, true);
          }else if(order === 'desc'){
            query = query.order(key, false);
          }
          //else ignore
        }
      }
    }

    // pagination
    const PER_PAGE_LIMIT = 50;
    params.page = parseInt(params.page || 1, 10);
    if(params.page < 1){
      params.page = 1;
    }
    params.per_page = parseInt(params.per_page || PER_PAGE_LIMIT, 10);
    if(params.per_page > PER_PAGE_LIMIT || params.per_page < 1){
      params.per_page = PER_PAGE_LIMIT;
    }
    query.limit(params.per_page).offset(params.per_page*(params.page-1));

    pg.connect(conString, function(err, client, done) {
      if(err) {
        console.error('error fetching client from pool', err);
        callback(err, null, null);
        return;
      }

      client.query(query.toString(), function(err, result) {
        done();

        if(err) {
          console.error('error running query', err);
          callback(err, null, null);
          return;
        }else{
          callback(null, result.rows, {
              count: result.rows.length,
              page: params.page,
              per_page: params.per_page
          });
        }
      });
    });
  }
}