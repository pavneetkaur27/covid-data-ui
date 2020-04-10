"use strict";
const express                 = require('express');
const router                  = express.Router();
const bodyParser              = require('body-parser');
const httpResponse            = require('../helper').HttpResponse;
const sendError 		      = httpResponse.sendError;
const sendSuccess			  = httpResponse.sendSuccess;
const loggerConf              = require('../loggers/log4js_module').getLogger;
const logger                  = loggerConf('route');

router.get('/',function(req, res, next) {
    res.send("working");
});

module.exports = router;