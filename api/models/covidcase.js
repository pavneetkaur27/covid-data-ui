var mongoose 	= require('mongoose');

var Schema 		= mongoose.Schema;
var ObjectId 	= Schema.ObjectId;

var covidcase = new mongoose.Schema(
	{
        country     : { type : ObjectId,  required : true },     
        c_date      : { type : String, required : true },
        confirmed   : { type : Number },
        deaths      : { type : Number},              
	},	
	{ 
		timestamps : true
	}
);

// covidcases.statics = {

// }


mongoose.model('CovidCase',covidcase);