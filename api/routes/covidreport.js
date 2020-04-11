"use strict";
var express               = require('express');
var router                = express.Router();
var session               = require('express-session');
var bodyParser            = require('body-parser');
const controller          = require('../controller');
const dataController      = controller.maindata;


router.get('/',function(req, res, next) {
    res.send("user working");
});

// get covid affected countries
router.post('/gt_cvd_cntry',dataController.maindata.fetchCovidCountry);

// get covid data
router.post('/gt_cvd_data',dataController.maindata.fetchCovidData);


module.exports = router;
