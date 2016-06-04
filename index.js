var pg = require('pg');
var conString = process.env.DATABASE_URL || "postgres://eosearch@localhost/eosearch";

var express = require('express');
var app = express();


pg.connect(conString, function(err, client, done) {
  if(err) {
    return console.error('error fetching client from pool', err);
  }

  app.get('/', function(req, res){

    client.query('SELECT * from irs_eo_records;', function(err, result) {
      //call `done()` to release the client back to the pool
      done();

      if(err) {
        res.json(err);
        return console.error('error running query', err);
      }
      console.log(result.rows[0].number);
      //output: 1

      res.json(result);
    });

  });


  var port = process.env.PORT || 5000;
  app.listen(port, function () {
    console.log('Example app listening on port '+port);
  });



});