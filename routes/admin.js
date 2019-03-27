var express = require('express');
var router = express.Router();
var request = require('request');
var boom = require('express-boom');


/* Create project for a registered user */
router.post('/project', function(req, res, next) {

  var send = {};

  request.post({

    url: process.env.code_repository_url + '/api/v3/projects/user/' + req.body.user_id,
    headers: {
      'PRIVATE-TOKEN': process.env.admin_token
    },
    form: {
      'name': req.body.name
    }
  },function(error, response, body){

    if (response.statusCode != 201){
      var info = JSON.parse(response.body);
      res.status(response.statusCode).json({routerStatus:'Failure', message: info["message"]});
    }
    else{
      try{

        var data = JSON.parse(body);

        if (data.hasOwnProperty("message")){
          res.json({routerStatus: "Failure", info: data});
        }
        else{
          res.json({routerStatus: "Success", info: data});
        }
      }
      catch (e) {
        res.boom.badData('Response is not a valid json and thus unprocessable');
      }
    }
  });
});

/* Get info for a given project */
router.get('/project/:project_id', function(req, res, next) {

  request.get({

    url: process.env.code_repository_url + '/api/v3/projects/' + req.params.project_id,
    headers: {
      'PRIVATE-TOKEN': process.env.admin_token
    }
  },function(error, response, body){

    if (response.statusCode != 200){
      var info = JSON.parse(response.body);
      res.status(response.statusCode).json({routerStatus:'Failure', message: info["message"]});
    }
    else{
      try{
        var data = JSON.parse(body);
        res.json({routerStatus: "Success", info: data});
      }
      catch (e) {
        res.boom.badData('Response is not a valid json and thus unprocessable');
      }
    }
  });
});


module.exports = router;