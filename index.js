var pg = require('pg');
var conString = process.env.DATABASE_URL || "postgres://eosearch@localhost/eosearch";

var express = require('express');
var app = express();

var squel = require('squel');

var validColumnNames = "EIN,NAME,ICO,STREET,CITY,STATE,ZIP,EO_GROUP,SUBSECTION,AFFILIATION,CLASSIFICATION,RULING,DEDUCTIBILITY,FOUNDATION,ACTIVITY,ORGANIZATION,STATUS,TAX_PERIOD,ASSET_CD,INCOME_CD,FILING_REQ_CD,PF_FILING_REQ_CD,ACCT_PD,ASSET_AMT,INCOME_AMT,REVENUE_AMT,NTEE_CD,SORT_NAME".toLowerCase().split(',');

// FIND: /api/records/:EIN
app.get('/api/records/:ein', function(req, res){

  var ein = req.params.ein;

  pg.connect(conString, function(err, client, done) {
    if(err) {
      console.error('error fetching client from pool', err);
      res.status(500).error(err);
      return;
    }

    client.query(squel.select().from('irs_eo_records').where('EIN = ?', ein).toString(), function(err, result){
      done(); 
      if(err){
        res.status(500).json(err);
        return;
      }

      if(result.rows.length > 0){
        res.json(result.rows[0]);
      }else{
        res.status(404).json({status: 'Record not found'});
      }

    });
  });
});

// QUERY: /api/records?column1=myvalue&column2=asdf&order=column&limit=5
app.get('/api/records', function(req, res){

  var params = req.query;

  var queryKeys = Object.keys(params);
  var query = squel.select().from('irs_eo_records');

  for(var i=0; i<queryKeys.length;i++){
    var key = queryKeys[i];
    var value = params[key];

    // validate column names
    if(validColumnNames.indexOf(key.toLowerCase()) >= 0){
      query = query.where('lower('+key+') LIKE ?', '%'+value.toLowerCase()+'%');
    }
  }

  // ordering
  if(params.order){
    console.log(params.order);
    if(typeof params.order === 'string'){
      query = query.order(params.order);
    }else{
      var keys = Object.keys(params.order);
      for(var i=0; i<keys.length; i++){
        var key = keys[i];
        var asc = keys[key] !== 'false';
        query = query.order(key, asc);
      }
    }
  }

  pg.connect(conString, function(err, client, done) {
    if(err) {
      console.error('error fetching client from pool', err);
      res.status(500).error(err);
      return;
    }

    client.query(query.toString(), function(err, result) {
      done();

      if(err) {
        res.status(500).json(err);
        return console.error('error running query', err);
      }else{
        res.json(result.rows);
      }
    });
  });
});


var port = process.env.PORT || 5000;
app.listen(port, function () {
  console.log('Example app listening on port '+port);
});