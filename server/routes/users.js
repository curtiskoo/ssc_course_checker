var express = require('express');
var router = express.Router();
var pool = require('../bin/database');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/cool', function(req, res, next) {
  res.send("You're so cool");
});

router.post('/', function(req, res, next) {
  console.log(req.body);
  var in_text = req.body.input_text;
  res.send(in_text);
  console.log(in_text);

});

module.exports = router;
