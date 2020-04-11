const mongoose              = require('mongoose');
const request 				= require('request');
const csvjson               = require('csvjson');
const moment                = require('moment-timezone');
const helper                = require('../../helper');
const httpResponse          = helper.HttpResponse;
const constants             = helper.Constants;
const errorCodes            = helper.Errors;
const sendError 		    = httpResponse.sendError;
const sendSuccess			= httpResponse.sendSuccess;

// Models require
require('../../models/covidcase');
require('../../models/covidcountry');

const CovidCase                 = mongoose.model('CovidCase');
const CovidCountry              = mongoose.model('CovidCountry');

exports.fetchCovidCountry = function(req,res,next){

    var covid_countries = [];
    CovidCountry.find({
    },{
        country_name : 1
    },{
        sort :{
            country_name : 1
        }
    },function(err, countries){
        if(err){
            return sendError(res,'server_error','server_error');
        }

        if(countries.length == 0){
            return sendSuccess(res,{
                covid_countries : covid_countries
            });
        }

        return sendSuccess (res , {
            covid_countries : countries
        })
    })    
}


exports.fetchCovidData = function(req,res,next){
    
    var query_string        = {};
    var totalcovidcases     = [];
    var covidcases_by_date  = {};

    if(!req.body.cntry){
        return sendError(res,'invalid_parameters','invalid_parameters');
    }

    if(req.body.cntry){
        query_string    = {
            country : req.body.cntry
        }
    }

    CovidCountry.findOne({
        _id : req.body.cntry
    },{
        country_name : 1
    },function(err, covidcountry){
        if(err){
            return sendError(res,'server_error','server_error');
        }

        CovidCase.find(
            query_string,
            {}
            ,{
                sort :{
                    createdAt : 1
                }
            }, function(err, covidcases){
                if(err){
                    return sendError(res,'server_error','server_error');
                }

                if(covidcases.length == 0){
                    return sendSuccess(res,{
                        country_name    : covidcountry ? covidcountry.country_name : null,
                        totalcovidcases : totalcovidcases
                    });
                }
                // console.log(JSON.stringify(covidcases));
                for(var i = 0; i< covidcases.length ;i++){
                    var covidcase = covidcases[i];
                    if(!covidcases_by_date[covidcase.c_date]){
                        covidcases_by_date[covidcase.c_date] = {};
                    }
                    covidcases_by_date[covidcase.c_date].confirmed_cases = covidcase.confirmed ? covidcase.confirmed : 0 ;
                    covidcases_by_date[covidcase.c_date].death_cases = covidcase.deaths ?covidcase.deaths : 0;
                }

                // console.log(covidcases_by_date);
                var now = new Date();
                now = now.setDate(now.getDate() -1);
                for (var d = new Date(2020, 0, 22); d < now ; d.setDate(d.getDate() + 1)) {
                    var formatted_time  = moment(new Date(d)).tz('Asia/Kolkata');
                    var covid_case_date = formatted_time.format('MM-DD-YYYY').toString();
                    console.log(covid_case_date);
                    if(covidcases_by_date[covid_case_date]){
                        totalcovidcases.push({
                            c_date              : covid_case_date,
                            confirmed_cases     : covidcases_by_date[covid_case_date].confirmed_cases,
                            death_cases         : covidcases_by_date[covid_case_date].death_cases
                        })
                    }else{
                        totalcovidcases.push({
                            c_date              : covid_case_date,
                            confirmed_cases     : 0,
                            death_cases         : 0
                        })
                    }
                }
                return sendSuccess(res,{
                    country_name    : covidcountry ? covidcountry.country_name : null,
                    totalcovidcases : totalcovidcases
                });
        })
    })
}








// redundant due to rate limit (number of requests) from github
// exports.fetchCovidData = function(req,res,next){
   
//     const options = {
//         url: 'https://api.github.com/repos/CSSEGISandData/COVID-19/contents/csse_covid_19_data/csse_covid_19_daily_reports',
//         headers: {
//             'accept' : 'application/vnd.github.VERSION.raw+json',
//             'user-agent': 'node.js'
//         }
//     }
//     request.get(options,function(err, resp){
//         if(err){
//             console.log("err");
//             console.log(err);
//         }  
//         // console.log();
//         var response = JSON.parse(resp.body);
//         console.log(response);
//         var git_files = [];
//         for(var i = 1 ;i< response.length -1 ;i++){
          
//             git_files.push(response[i].name);
//         }
//         // console.log(git_files);

//         var data_by_countries   = {};
//         var todo                = git_files.length;
//         var done                = 0;
//         console.log(todo);
//         var cb1 = function(err, data_by_countries){
//             if(err){
//                 console.log(err);
//                 // return sendError()
//             }
//             if(todo == done){
//                 console.log("done");
//             }else{
//                 console.log("done "+done);
//                 done++;
//                 // calculateCovidCases(git_files[done],data_by_countries,cb1);
//             }
//         }
//         calculateCovidCases(git_files[done],data_by_countries,cb1);
//     })
//     return sendSuccess(res ,{});
// }

// function calculateCovidCases(filename,data_by_countries,cb){


//     const options = {
//         url: 'https://api.github.com/repos/CSSEGISandData/COVID-19/contents/csse_covid_19_data/csse_covid_19_daily_reports/'+ filename,
//         headers: {
//             'accept' : 'application/vnd.github.VERSION.raw+json',
//             'user-agent': 'node.js'
//         }
//     }

//     request.get(options,function(err, resp){
//         if(err){
//            return cb(err, null);
//         }
            
//         var gitdata = csvjson.toObject(resp.body);
//         // console.log(gitdata);
//         var filedate = filename.split('.')[0];
//         console.log(filedate);
//         for(var i = 0 ;i < gitdata.length;i++){
//             var data = gitdata[i];

//             console.log(parseInt(data.Confirmed));
//             if(!data.Country_Region){
//                 if(!data_by_countries[data['Country/Region']] ){
//                     data_by_countries[data['Country/Region']] = {};
//                     data_by_countries[data['Country/Region']][filedate]={};
//                     data_by_countries[data['Country/Region']][filedate].confirmed_cases = parseInt(data.Confirmed) ?  parseInt(data.Confirmed) : 0;
//                     data_by_countries[data['Country/Region']][filedate].death_cases = parseInt(data.Deaths) ? parseInt(data.Deaths) : 0;
//                 }else if(!data_by_countries[data['Country/Region']][filedate]){
//                     data_by_countries[data['Country/Region']][filedate]={};
//                     data_by_countries[data['Country/Region']][filedate].confirmed_cases = parseInt(data.Confirmed) ?  parseInt(data.Confirmed) : 0;
//                     data_by_countries[data['Country/Region']][filedate].death_cases = parseInt(data.Deaths) ? parseInt(data.Deaths) : 0;

//                 }else{
//                     data_by_countries[data['Country/Region']][filedate].confirmed_cases = data_by_countries[data['Country/Region']][filedate].confirmed_cases + (parseInt(data.Confirmed) ? parseInt(data.Confirmed) : 0);
//                     data_by_countries[data['Country/Region']][filedate].death_cases = data_by_countries[data['Country/Region']][filedate].death_cases + (parseInt(data.Deaths) ? parseInt(data.Deaths) :0);
//                 }
//             }else{
//                 if(!data_by_countries[data.Country_Region] ){
//                     data_by_countries[data.Country_Region] = {};
//                     data_by_countries[data.Country_Region][filedate] = {}
//                     data_by_countries[data.Country_Region][filedate].confirmed_cases = parseInt(data.Confirmed);
//                     data_by_countries[data.Country_Region][filedate].death_cases = parseInt(data.Deaths);
//                 }else if(!data_by_countries[data.Country_Region][filedate]){
//                     data_by_countries[data.Country_Region][filedate]={};
//                     data_by_countries[data.Country_Region][filedate].confirmed_cases = parseInt(data.Confirmed) ?  parseInt(data.Confirmed) : 0;
//                     data_by_countries[data.Country_Region][filedate].death_cases = parseInt(data.Deaths) ? parseInt(data.Deaths) : 0;

//                 }else{
//                     data_by_countries[data.Country_Region][filedate].confirmed_cases = data_by_countries[data.Country_Region][filedate].confirmed_cases +( parseInt(data.Confirmed) ? parseInt(data.Confirmed) : 0);
//                     data_by_countries[data.Country_Region][filedate].death_cases = data_by_countries[data.Country_Region][filedate].death_cases + (parseInt(data.Confirmed) ? parseInt(data.Deaths) : 0);
//                 }
//             }
//         }
//         console.log(data_by_countries);
//         return cb(null,data_by_countries);
//     })
// }