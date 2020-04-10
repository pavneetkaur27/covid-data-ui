"use strict";
const express                 = require('express');
const router                  = express.Router();
const bodyParser              = require('body-parser');
const httpResponse            = require('../helper').HttpResponse;
const sendError 		      = httpResponse.sendError;
const sendSuccess			  = httpResponse.sendSuccess;
const controller              = require('../controller');
const dataController          = controller.maindata;

router.post('/',function(req, res, next) {
    res.send("working");
});

router.post('/gt_cvd_data',dataController.maindata.fetchCovidData);



module.exports = router;