var express = require('express');
var router = express.Router();
var request = require('request');
var boom = require('express-boom');


/* Register new user */
router.post('/user', function(req, res, next) {
    
    request.post({
        
        url: process.env.code_repository_url + '/api/v3/session?login=' + req.body.username + '&password=' + req.body.password,
        headers: {
            'PRIVATE-TOKEN': process.env.admin_token
        },

    },function(error, response, body){
        
        if(error){
            res.boom.serverUnavailable();
        }
        else{
            if (response.statusCode != 201){
                var info = JSON.parse(response.body);
                res.status(response.statusCode).json({routerStatus:'Failure', message: info["message"]});
            }
            else{
            	res.status(response.statusCode).json({routerStatus:'Success', user: JSON.parse(body)});
            }
        }
    });

});

/* Validate user */
router.get('/', function(req, res, next) {
    
    request.get({

        url: process.env.code_repository_url + '/api/v3/user',
        headers: {
            'PRIVATE-TOKEN': req.get('TOKEN')
        },

    },function(error, response, body){
        
        if(error){
            res.boom.serverUnavailable();
        }
        else{
            if (response.statusCode != 200){
                var info = JSON.parse(response.body);
                res.status(response.statusCode).json({routerStatus:'Failure', message: info["message"]});
            }
            else{
                res.status(response.statusCode).json({auth:'Success', user:JSON.parse(response.body)});
            }
        }
    });
});

router.put('/update', function(req, res, next) {
	
	request.put({
		
		url: process.env.code_repository_url + '/api/v3/users/' + req.body.id,
		headers: {
			'PRIVATE-TOKEN': process.env.admin_token
		},
		form: {
			'email': req.body.email,
			'name': req.body.name,
			'password': req.body.password 
		}
		
	}, function(error, response, body) {
		
		if (error) {
			res.boom.serverUnavailable();
		}
		else {
			if (response.statusCode != 200){
                var info = JSON.parse(response.body);
                res.status(response.statusCode).json({routerStatus:'Failure', message: info["message"]});
            }
            else{
                res.status(response.statusCode).json({auth:'Success', user:JSON.parse(response.body)});
            }
		}
		
	});
});


module.exports = router;
