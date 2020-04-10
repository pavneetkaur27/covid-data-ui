module.exports = function(client,config,logger){


if(config.REDIS_PASSWORD && config.REDIS_PASSWORD.length>0){
    client.auth(config.REDIS_PASSWORD,function(err,reply) {
      if(err){
        console.log(err);
        logger.error({"msg":"redis_server_error","p":{
          host : config.REDIS_HOST,
          port : config.REDIS_PORT
        },"er":err});
      }else{
        console.log("["+reply+"]","Redis Authenticated");
      }
    });
}

client.set("language","nodejs");
client.on('ready',function() {
  console.log("Redis is connected and ready");
});

client.on("error", function (err) {
  console.log("Redis error:-" + err);
  logger.error({"msg":"redis_server_error","p":{
    host : config.REDIS_HOST,
    port : config.REDIS_PORT
  },"er":err});
});

}