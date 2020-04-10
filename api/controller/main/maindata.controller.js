
const helper                = require('../../helper');
const httpResponse          = helper.HttpResponse;
const constants             = helper.Constants;
const errorCodes            = helper.Errors;
const sendError 		    = httpResponse.sendError;
const sendSuccess			= httpResponse.sendSuccess;

exports.fetchCovidData = function(req,res,next){
    console.log("hhhhhhhhhhhhhhhhhh")
    return sendSuccess(res ,{});
}