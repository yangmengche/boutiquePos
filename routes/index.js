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

// category
router.post('/category/create', redirectTo);
router.delete('/category', redirectTo);
router.put('/category/update', redirectTo);
router.get('/category', redirectTo);
// item
router.post('/item/create', redirectTo);
router.put('/item/update', redirectTo);
router.post('/item/query', redirectTo);
router.post('/item/stock', redirectTo);
router.get('/item', redirectTo);

// receipt
router.post('/receipt/create', redirectTo);
router.post('/receipt/query', redirectTo);

// statistic
router.post('/receipt/histogram', redirectTo);

// misc
router.post('/upload/image', redirectTo);
router.get('/resource/:fileID', redirectTo);
module.exports = router;

