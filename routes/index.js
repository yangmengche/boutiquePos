var express = require('express');
var router = express.Router();

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

let version =  'v1';

function redirectTo(req, res, next) {
  console.log(req.url);
  req.url = '/'+version+req.url;
  next('route');
}

// account
router.post('/account/login',  redirectTo);
router.post('/account/add', redirectTo);
router.get('/account', redirectTo);
router.post('/account/create', redirectTo);

// supplier
router.post('/supplier/create', redirectTo);
router.get('/supplier', redirectTo);
router.put('/supplier/update', redirectTo);

module.exports = router;
