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
        console.log(JSON.stringify(countries,null,2));
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

    if(req.body.cntry && req.body.cntry!= 'ALL' ){
        query_string    = {
            country : req.body.cntry
        }
    }

    CovidCountry.findOne(
        query_string
    ,{
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
                        total_countries : countries,
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
                    covidcases_by_date[covidcase.c_date].confirmed_cases    = covidcases_by_date[covidcase.c_date].confirmed_cases ? (covidcases_by_date[covidcase.c_date].confirmed_cases + (covidcase.confirmed ? covidcase.confirmed : 0 ) ): (covidcase.confirmed ? covidcase.confirmed : 0 );
                    covidcases_by_date[covidcase.c_date].death_cases        = covidcases_by_date[covidcase.c_date].death_cases ? (covidcases_by_date[covidcase.c_date].death_cases + (covidcase.deaths ? covidcase.deaths : 0 ) ) : (covidcase.deaths ?covidcase.deaths : 0);
                }

                // console.log(covidcases_by_date);
                var now = new Date();
                now = now.setDate(now.getDate() -1);
                for (var d = new Date(2020, 0, 22); d < now ; d.setDate(d.getDate() + 1)) {
                    var formatted_time  = moment(new Date(d)).tz('Asia/Kolkata');
                    var covid_case_date = formatted_time.format('MM-DD-YYYY').toString();
                    // console.log(covid_case_date);
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

exports.refreshCovidCases = function(req,res, next){
    updateCovidDataInDatabase(function(err,result){
        if(err){
            return sendError(res,'server_error','server_error');
        }   
        return sendSuccess(res,{});
    })
}

function updateCovidDataInDatabase(cb){
    var now = new Date();
    now = now.setDate(now.getDate() -1);
    var formatted_time  = moment((now)).tz('Asia/Kolkata');
    var covid_case_date = formatted_time.format('MM-DD-YYYY').toString();
    var filename    = covid_case_date+'.csv';
    console.log(filename);  
    var data_by_countries   = {};
    var total_covid_cases   = [];

    const options = {
        url: 'https://api.github.com/repos/CSSEGISandData/COVID-19/contents/csse_covid_19_data/csse_covid_19_daily_reports/'+ filename,
        headers: {
            'accept' : 'application/vnd.github.VERSION.raw+json',
            'user-agent': 'node.js'
        }
    }
    
    request.get(options,function(err, resp){
        if(err){
            return cb(err, null);
        }
            
        var coviddata = csvjson.toObject(resp.body);
        if(coviddata.length == 0){
            return cb(null, true);
        }
        for(var i = 0 ;i < coviddata.length;i++){
            var data = coviddata[i];
            
            if(!data_by_countries[data.Country_Region] ){
                data_by_countries[data.Country_Region] = {};
                data_by_countries[data.Country_Region] = {}
                data_by_countries[data.Country_Region].confirmed_cases = parseInt(data.Confirmed);
                data_by_countries[data.Country_Region].death_cases = parseInt(data.Deaths);
            }else{
                data_by_countries[data.Country_Region].confirmed_cases = data_by_countries[data.Country_Region].confirmed_cases +( parseInt(data.Confirmed) ? parseInt(data.Confirmed) : 0);
                data_by_countries[data.Country_Region].death_cases = data_by_countries[data.Country_Region].death_cases + (parseInt(data.Confirmed) ? parseInt(data.Deaths) : 0);
            }
        }

        console.log(data_by_countries);
        for(var country in data_by_countries){
            console.log(country);
            total_covid_cases.push({
                country             : country,
                confirmed_cases     : data_by_countries[country].confirmed_cases,
                death_cases         : data_by_countries[country].death_cases
            })
        }

        // console.log(total_covid_cases.length);

        var todo = total_covid_cases.length;
        var done = 0;

        var cb1 = function(err, result){
            if(err){
                console.log(err);
                return cb(err,null);
            }
            done++;
            if(todo == done){
                console.log("done");
                return cb(null, todo);
            }else{
                updateCovidDataInDB(total_covid_cases[done],covid_case_date.toString(),cb1);
            }
        }
        updateCovidDataInDB(total_covid_cases[done],covid_case_date.toString(),cb1);
    })
}

function updateCovidDataInDB(coviddata,case_date,cb){

    CovidCountry.findOne({
        country_name : coviddata.country
    },function(err, covidcountry){
        if(err){
            return cb(err);
        }
        // console.log(JSON.stringify(covidcountry));
        if(covidcountry){
            updateCovidCaseInDB(coviddata,case_date,covidcountry._id,cb);
        }else{
            var covidCountryObj = {
                country_name     : coviddata.country,
            }
            var new_covidcountry = new CovidCountry(covidCountryObj);
            new_covidcountry.save(function(err,saved_data){
                if(err){
                    return cb(err);
                }
                updateCovidCaseInDB(coviddata,case_date,saved_data._id,cb);
            })
        }
    })
   
}

function updateCovidCaseInDB(coviddata,case_date, country_id,cb){
    CovidCase.findOne({
        country : country_id,
        c_date  : case_date
    },function(err, covidcase){
        if(err){
            return cb(err);
        }
        if(covidcase){
            CovidCase.update({
                country : country_id,
                c_date  : case_date
            },{
                $set : {
                    confirmed : coviddata.confirmed_cases,
                    deaths    : coviddata.death_cases
                }
            },function(err, data_updated){
                if(err){
                    return cb(err);
                }
                return cb(null,true);
            })
        }else{
            var covidDataObj = {
                country     : country_id,
                c_date      : case_date,   
                confirmed   : coviddata.confirmed_cases,
                deaths      : coviddata.death_cases
            }
            var new_covidcase = new CovidCase(covidDataObj);
            new_covidcase.save(function(err,saved_data){
                if(err){
                    return cb(err);
                }
                return cb(null,true);
            })
        }
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