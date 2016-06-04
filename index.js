var pg = require('pg');
var conString = process.env.DATABASE_URL || "postgres://eosearch@localhost/eosearch";

var express = require('express');
var exphbs  = require('express-handlebars');
var app = express();

var squel = require('squel');

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

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

function findByEin(ein, callback){
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
}

// FIND: /api/records/:EIN
app.get('/api/records/:ein', function(req, res){

  var ein = req.params.ein;

  findByEin(ein, function(err, result){
    if(err){
      res.status(500).error(err);
    }else if(result){
      res.json(result);
    }else{
      res.status(404).json({status: 'Record not found'})
    }
  });
});

// QUERY: /api/records?column1=myvalue&column2=asdf&order=column&limit=5
app.get('/api/records', function(req, res){

  var params = req.query;

  var queryKeys = Object.keys(params);
  var query = squel.select().from('irs_eo_records');

  for(var i=0; i<queryKeys.length;i++){
    var key = queryKeys[i].toLowerCase();
    var value = params[key];

    // validate column names
    if(validColumnNames.indexOf(key) >= 0){
      if(fullSearchColumns.indexOf(key) >= 0){
        // do contains comparsion
        query = query.where('lower('+key+') LIKE ?', '%'+value.toLowerCase()+'%');  
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
      res.status(500).error(err);
      return;
    }

    console.log(query.toString());

    client.query(query.toString(), function(err, result) {
      done();

      if(err) {
        res.status(500).json(err);
        return console.error('error running query', err);
      }else{
        res.json({
          results: result.rows,
          pagination: {
            count: result.rows.length,
            page: params.page,
            per_page: params.per_page
          }
        });
      }
    });
  });
});

app.get('/', function (req, res) {
    res.render('home');
});

app.get('/result/:ein', function(req, res){
  var ein = req.params.ein;

  findByEin(ein, function(err, result){

    res.json(result);

  });

});

var port = process.env.PORT || 5000;
app.listen(port, function () {
  console.log('Example app listening on port '+port);
});
