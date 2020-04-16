const mongoose              = require('mongoose');
const request 			    = require('request');
const csvjson               = require('csvjson');
const moment                = require('moment-timezone');

require('../models/covidcase');
require('../models/covidcountry');

const CovidCase            = mongoose.model('CovidCase');
const CovidCountry            = mongoose.model('CovidCountry');


connectMongoDb();
mongoose.connection.on('error', function(err){
  console.trace("MongoDb Connection Error " + err);
  console.log('Shutting Down the User Trace');
  console.log('User Session Terminated');  
  process.exit(0);
});

mongoose.connection.on('connected', function(){
    console.log('Connected to mongodb!');   
    console.log('------- Refresh Covid Data----------');
    refreshData(function(){
        endScript();
    });
});


function refreshData(finalCb){
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

        for(var country in data_by_countries){
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
                console.log("finished");
                endScript();
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


function endScript() {
    console.log('Exiting...');
    return process.exit();
}
 
function connectMongoDb() {
    return mongoose.connect("mongodb://localhost:27017/coviddata"); 
}