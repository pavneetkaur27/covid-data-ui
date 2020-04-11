var mongoose 	= require('mongoose');

var Schema 		= mongoose.Schema;
var ObjectId 	= Schema.ObjectId;

var covidcountry = new mongoose.Schema(
	{
        country_name     : { type : String,  required : true },     
    },	
	{ 
		timestamps : true
	}
);


mongoose.model('CovidCountry',covidcountry);