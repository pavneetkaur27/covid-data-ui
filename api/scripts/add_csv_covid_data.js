const mongoose              = require('mongoose');
const request 			    = require('request');
const csv                   = require('csvtojson');
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
    console.log('------- Add Covid Data----------');
    addCovidDataInDB(function(){
        endScript();
    });
});

function addCovidDataInDB(finalCb) {
    
    const options = {
        url: 'https://api.github.com/repos/CSSEGISandData/COVID-19/contents/csse_covid_19_data/csse_covid_19_daily_reports',
        headers: {
            'accept' : 'application/vnd.github.VERSION.raw+json',
            'user-agent': 'node.js'
        }
    }

    request.get(options,function(err, resp){
        if(err){
            console.log("err");
            console.log(err);
            endScript();
        }  
        var response = JSON.parse(resp.body);
        console.log(response);
        var git_files = [];
        
        for(var i = 1 ;i< response.length -1 ;i++){
            // if(response[i].name == '04-09-2020.csv'){
                git_files.push(response[i].name);
                // break;
            // }
        }

        var data_by_countries   = {};
        var todo                = git_files.length;
        var done                = 0;
       
        var cb1 = function(err, data_by_countries){
            if(err){
                console.log(err);
                endScript();
            }
            done++;
            if(todo == done){
                console.log("done");
                endScript();
            }else{
                console.log("done "+done);
                calculateCovidCases(git_files[done],cb1);
            }
        }
        calculateCovidCases(git_files[done],cb1);
    })
};

function calculateCovidCases(filename,cb){

    var data_by_countries   = {};
    var total_covid_cases   = [];
    var filepath = '../csse_covid_19_daily_reports/'+filename;

    var filedate = filename.split('.')[0];
    csv().fromFile(filepath)
        .then((covidData)=>{
            var covidCases = covidData;
            
            for(var i = 0 ;i < covidCases.length;i++){
                var data = covidCases[i];
    
                if(!data.Country_Region){
                    if(!data_by_countries[data['Country/Region']] ){
                        data_by_countries[data['Country/Region']] = {};
                        data_by_countries[data['Country/Region']].confirmed_cases = parseInt(data.Confirmed) ?  parseInt(data.Confirmed) : 0;
                        data_by_countries[data['Country/Region']].death_cases = parseInt(data.Deaths) ? parseInt(data.Deaths) : 0;
                    }else{
                        data_by_countries[data['Country/Region']].confirmed_cases = data_by_countries[data['Country/Region']].confirmed_cases + (parseInt(data.Confirmed) ? parseInt(data.Confirmed) : 0);
                        data_by_countries[data['Country/Region']].death_cases = data_by_countries[data['Country/Region']].death_cases + (parseInt(data.Deaths) ? parseInt(data.Deaths) :0);
                    }
                }else{
                    if(!data_by_countries[data.Country_Region] ){
                        data_by_countries[data.Country_Region] = {};
                        data_by_countries[data.Country_Region].confirmed_cases = parseInt(data.Confirmed);
                        data_by_countries[data.Country_Region].death_cases = parseInt(data.Deaths);
                    }else{
                        data_by_countries[data.Country_Region].confirmed_cases = data_by_countries[data.Country_Region].confirmed_cases +( parseInt(data.Confirmed) ? parseInt(data.Confirmed) : 0);
                        data_by_countries[data.Country_Region].death_cases = data_by_countries[data.Country_Region].death_cases + (parseInt(data.Confirmed) ? parseInt(data.Deaths) : 0);
                    }
                }
            }
            console.log(data_by_countries);

            for(var country in data_by_countries){
                total_covid_cases.push({
                    country             : country,
                    confirmed_cases     : data_by_countries[country].confirmed_cases,
                    death_cases         : data_by_countries[country].death_cases
                })
            }

            var todo = total_covid_cases.length;
            var done = 0;
            console.log(todo)

            var cb1 = function(err, data_by_countries){
                if(err){
                    console.log(err);
                    return cb(err,null);
                }
                done++;
                if(todo == done){
                    console.log("done");
                    return cb(null, true);
                }else{
                    updateCovidDataInDB(total_covid_cases[done],filedate,cb1);
                }
            }
            updateCovidDataInDB(total_covid_cases[done],filedate,cb1);
    }).catch((err) => {
        if(err){
            console.log("Err "+ err );
            endScript();
        }
    })
}

function updateCovidDataInDB(coviddata,case_date,cb){

    CovidCountry.findOne({
        country_name : coviddata.country
    },function(err, covidcountry){
        if(err){
            return cb(err);
        }
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