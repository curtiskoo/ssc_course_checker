var express = require('express');
var router = express.Router();
var pool = require('../bin/database');


function apiRequest(apistring) {
    return new Promise(function (resolve, reject) {
        pool.query(apistring, function (err, res1) {
            let r = res1.rows;
            console.log(r);
            resolve(r)
        })
    })
}

function getDeptRequest() {
    return new Promise(function (resolve, reject) {
        pool.query('SELECT * FROM dept', function (err, res1) {
            let r = res1.rows;
            console.log(r);
            resolve(r)
        })
    })
}

function getCourseNum(dept, year, term) {
    return new Promise(function (resolve, reject) {
        pool.query(`SELECT distinct course FROM courses WHERE dept = '${dept}' and year = '${year}' and term = '${term}'`, function (err, res1) {
            let r = res1.rows;
            console.log(r);
            resolve(r)
        })
    })
}

function getCourseSection(dept, year, term, num) {
    return new Promise(function (resolve, reject) {
        pool.query(`SELECT distinct section FROM courses WHERE dept = '${dept}' and course = '${num}' and year = '${year}' and term = '${term}'`, function (err, res1) {
            let r = res1.rows;
            console.log(r);
            resolve(r)
        })
    })
}

router.get('/get_dept', async function(req, res) {
    //let deptList = getDeptRequest();
    //res.end(JSON.stringify({dept:deptList}))
    let rows = [];
    try {
        rows = await getDeptRequest();
        //console.log(rows);
        res.end(JSON.stringify({dept:rows}));
        console.log('here')
    } catch (e) {
        console.log(e)
    }
});

router.get('/get_course_num', async function(req, res) {
    //console.log(req.query.dept)
    let dept = req.query.dept;
    let year = req.query.year;
    let term = req.query.term;
    let rows = [];
    try {
        //console.log(dept);
        rows = await getCourseNum(dept, year, term);
        res.end(JSON.stringify({nums:rows}))
    } catch (e) {
        console.log(e)
    }


});

router.get('/get_course_section', async function(req, res) {
    let dept = req.query.dept;
    let course = req.query.course;
    let year = req.query.year;
    let term = req.query.term;

    let rows = [];
    try {
        //console.log(dept);
        rows = await getCourseSection(dept, year, term, course);
        res.end(JSON.stringify({sections:rows}))
    } catch (e) {
        console.log(e)
    }

});

router.get('/get_year', async function(req, res) {
    // let dept = req.query.dept;
    // let course = req.query.course;
    // let year = req.query.year;
    // let term = req.query.term;

    let rows = [];
    try {
        //console.log(dept);
        rows = await apiRequest("SELECT distinct year FROM courses");
        res.end(JSON.stringify({years:rows}))
    } catch (e) {
        console.log(e)
    }

});


router.get('/', async function(req, res, next) {
    console.log(req)
});

module.exports = router;