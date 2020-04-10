const log4js              	  = require('log4js');
const file_path         	    = require('./log4js_configs.js').path;

const current_date        	  = new Date();
const file_name       	      = 'log-'+current_date.getFullYear()+'_'+(current_date.getMonth()+1)+'_'+current_date.getDate()+'.log';

function g_f(type){
  return file_path[type]+file_name;
}

log4js.configure({
  appenders: {
              express: { type: 'file', filename: g_f("EXPRESS") },
              admin: { type: 'file', filename: g_f("ADMIN") },
              route: { type: 'file', filename: g_f("ROUTE") }
            },
  categories: {
          default: { appenders: ['express'], level: 'error' },
          default: { appenders: ['express'], level: 'info' },
          admin : { appenders: ['admin'], level: 'error' },
          admin : { appenders: ['admin'], level: 'info' },
          route : { appenders: ['route'], level: 'error' }  ,
          route : { appenders: ['route'], level: 'info' }
        }
});

module.exports = log4js;