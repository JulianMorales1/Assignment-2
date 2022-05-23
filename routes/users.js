var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/myname',(req, res, next)=> {
  res.send('Julian Morales');
})

router.get('/myfavoritemovies',(req, res, next)=> {
  res.json('Pirates of The Carribean 1,2 & 3');
})

module.exports = router;
