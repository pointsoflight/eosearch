var pg = require('pg');
var conString = process.env.DATABASE_URL || "postgres://eosearch@localhost/eosearch";

var express = require('express');
var app = express();


pg.connect(conString, function(err, client, done) {
  if(err) {
    return console.error('error fetching client from pool', err);
  }

  // FIND: /api/records/:EIN
  app.get('/api/records/:ein', function(req, res){

    var ein = req.params.ein;

    // todo find

    client.query('SELECT * from irs_eo_records WHERE EIN = $1;', [ein], function(err, result){

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
  // QUERY: /api/records?params....
  app.get('/api/records', function(req, res){

    var query = req.query;

    // client.query('SELECT * from irs_eo_records;', function(err, result) {
    //   //call `done()` to release the client back to the pool
    //   done();

    //   if(err) {
    //     res.status(500).json(err);
    //     return console.error('error running query', err);
    //   }
    //   console.log(result.rows[0].number);
    //   //output: 1

    //   res.json(result);
    // });

  });


  var port = process.env.PORT || 5000;
  app.listen(port, function () {
    console.log('Example app listening on port '+port);
  });



});