var express = require('express');
var router = express.Router();
var pool = require('../bin/database');


function apiRequest(apistring) {
    return new Promise(function (resolve, reject) {
        pool.query(apistring, function (err, res1) {
            if (err) {
                console.log(`DB Request Error: ${err} ${apistring}`);
                reject(err)
            } else {
                let r = res1.rows;
                console.log(r);
                resolve(r)
            }
        })
    })
}

router.get('/get_dept', async function(req, res) {
    //let deptList = getDeptRequest();
    //res.end(JSON.stringify({dept:deptList}))
    let year = req.query.year;
    let term = req.query.term;

    let rows = [];
    try {
        rows = await apiRequest(`SELECT distinct dept FROM courses WHERE year = '${year}' and term = '${term}'`);
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
        rows = await apiRequest(`SELECT distinct course FROM courses WHERE dept = '${dept}' and year = '${year}' and term = '${term}'`);
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
        rows = await apiRequest(`SELECT distinct section FROM courses WHERE dept = '${dept}' and course = '${course}' and year = '${year}' and term = '${term}'`);
        res.end(JSON.stringify({sections:rows}))
    } catch (e) {
        console.log(e)
    }

});

router.get('/get_year', async function(req, res) {

    let rows = [];
    try {
        //console.log(dept);
        rows = await apiRequest("SELECT distinct year FROM courses");
        res.end(JSON.stringify({years:rows}))
    } catch (e) {
        console.log(e)
    }

});

function parseBool(b) {
    if (b) {
        return 1
    } else {
        return 0
    }
}

router.post('/post_form', async function(req, res) {
    try {
        let rows = []
        let course_string = req.body.course_string;
        let name = req.body.name;
        let phone = req.body.phone;
        let year = req.body.year;
        let term = req.body.term;
        let dept = req.body.dept;
        let course = req.body.course;
        let section = req.body.section;
        let seat_general = req.body.seat_general;
        let seat_restricted = req.body.seat_restricted;
        let seat = null;
        let ts = req.body.ts;

        seat_general = parseBool(seat_general);
        seat_restricted = parseBool(seat_restricted);
        seat = Number(`${seat_general}${seat_restricted}`);
        console.log(seat);

        console.log(req.body);

        //Add new customer if new:
        try {
            rows = await apiRequest(`INSERT INTO customer (phone, name) VALUES ('${phone}', '${name}')`);
            //await console.log(rows);
        } catch (e) {
            console.log(e);
        }

        await apiRequest(`INSERT INTO registration (phone, course_id, ts, seat, fulfilled) VALUES ('${phone}', '${course_string}', '${ts}', ${seat}, ${false})`);
        rows = await apiRequest(`SELECT * FROM customer WHERE phone = '${phone}'`);
        await console.log(rows);
        rows = await apiRequest(`SELECT * FROM registration WHERE phone = '${phone}'`);
        await console.log(rows);

        res.end("yes")
    } catch (e) {
        console.log(e)
    }
});


router.get('/', async function(req, res, next) {
    console.log(req)
});

module.exports = router;