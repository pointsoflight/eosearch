var express = require('express');
var exphbs  = require('express-handlebars');
var app = express();

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

var db = require('./db');

// FIND: /api/records/:EIN
app.get('/api/records/:ein', function(req, res){

  var ein = req.params.ein;

  db.findByEin(ein, function(err, result){
    if(err){
      res.status(500).error(err);
    }else if(result){
      res.json(result);
    }else{
      res.status(404).json({status: 'Record not found'})
    }
  });
});

app.get('/api/slacklookup', function(req, res){

  var ein = req.query.text;
  
  db.findByEin(ein, function(err, result){
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
  db.query(req.query, function(err, results, paginationInfo){
    if(err){
      res.status(500).error(err);
    }else{
      res.json({
        results: results,
        pagination: paginationInfo
      });
    }
  });
});

app.get('/', function (req, res) {
    res.render('home');
});

app.get('/result/:ein', function(req, res){
  var ein = req.params.ein;
  db.findByEin(ein, function(err, result){
    res.json(result);
  });
});

var port = process.env.PORT || 5000;
app.listen(port, function () {
  console.log('Example app listening on port '+port);
});
