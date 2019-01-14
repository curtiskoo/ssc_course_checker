var express = require('express');
var router = express.Router();
var pool = require('../bin/database');

/* GET home page. */

//let rows = [];
var acc = 0;

/*
router.get('/', function(req, res, next) {
  pool.query('SELECT * FROM dept', function(err, res1) {
      //console.log(err, res);
      //res.send(res1.rows);
      rows = res1.rows;
      //console.log('inner function');
      acc+=1;
  });
  acc+=1;
  console.log(acc);
  //if (acc == 2) {
  //  res.render('index', { title: 'Express', dept_rows: rows});
  //}
  res.render('index', { title: 'Express', dept_rows: rows});
  //console.log('done outer')

});
*/

/*
let dbDeptRequestPromise =  new Promise(function (resolve, reject) {

    pool.query('SELECT * FROM dept', function (err, res1) {
        //console.log(err, res);
        //res.send(res1.rows);
        rows = res1.rows
    })

    if (rows != []) {
        console.log('Found records');
        resolve()
    }
    else {
        reject()
    }

});

router.get('/', function(req, res, next) {
    console.log('rendering /')
    dbDeptRequestPromise.then(function(res1) {
        console.log(res1)
    })
        //res.render('index', { title: 'Express', dept_rows: rows}))

});

get: async
*/


/*
    pool.query('SELECT * FROM dept', function (err, res1) {
        let r = res1.rows;
        console.log(r);
        return r;
    })
}
*/
/*
async function renderAwait() {
    try {
        rows = await getDeptRequest();
        router.get('/', function(req, res, next) {
            res.render('index', { title: 'Express', dept_rows: rows})
        })
    } catch (e) {
        console.log(e)
    }
}

renderAwait();
*/

function getDeptRequest() {
    return new Promise(function (resolve, reject) {
        pool.query('SELECT * FROM dept', function (err, res1) {
            let r = res1.rows;
            console.log(r);
            resolve(r)
        })
    })
}

router.get('/', async function(req, res, next) {
    let rows = [];
    try {
        rows = await getDeptRequest();
        //console.log(rows);
        res.render('index', { title: 'Express', dept_rows: rows});
        console.log('here')
    } catch (e) {
        console.log(e)
    }

});

router.post('/donovan', function(req, res) {
    console.log(req.body)
    console.log(res.body)
});

router.get('/donovan', function(req, res) {
    res.send(req)
});

module.exports = router;
