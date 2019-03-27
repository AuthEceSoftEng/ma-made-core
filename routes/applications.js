var express = require('express');
var router = express.Router();
var shell = require('shelljs');
var request = require('request');

router.put('/dependencies/:container_id', function(req, res, next) {
    
    var args = {};
    args["container_id"] = req.params.container_id;
    
    var x = {};
    x["function_name"] = "install_node_application_dependencies";
    x["params"] = {};
    x["params"]["username"] = req.body.username;
    x["params"]["application_name"] = req.body.application_name;
    args["function_details"] = x;
    
    var arguments = JSON.stringify(args);
    var command = "cd scripts && python -c 'import container_actions; print(container_actions.perform_action_inside_container(" + arguments + "))' ";
    
    var output = shell.exec(command);
    var info = JSON.parse(output.stdout);

    //res.status(200).json({routerStatus:'Success', log: 'a'});
    request.post({

        url: process.env.platform_url + '/log',
        form:{
            action: "install_dependencies",
            application_id: req.body.application_id,
            message: info.message.join('_newLine_'),
            status: info.exitStatus,
            timeEl: info.timeElapsed
        }

    },function(error, response, body){

        if(error){
            res.boom.serverUnavailable();
        }
        else{
            if(info.exitStatus == 'Failure'){
                res.status(412).json({routerStatus:'Failure', log: JSON.parse(response.body)});
            }
            else{
                res.status(200).json({routerStatus:'Success', log: JSON.parse(response.body)});
            }
        }
    });
    
});

router.put('/deploy/:container_id/:repo_id', function(req, res, next) {
    
    request.get({
        url: process.env.apps_vm_url + '/repos/project/' + req.params.repo_id,
        headers: {
            'TOKEN': req.get('TOKEN')
        }
    }, function(error, response, body){
        
        if (response.statusCode != 200){
            var info = JSON.parse(response.body);
            res.status(response.statusCode).json({routerStatus:'Failure', message: info["message"]});
        }
        else{
            data = JSON.parse(body);
            
            var args = {};
            args["container_id"] = req.params.container_id;

            var x = {};
            x["function_name"] = "deploy_node_application";
            x["params"] = {};
            x["params"]["username"] = req.body.username;
            x["params"]["application_name"] = req.body.application_name;
            args["function_details"] = x;
            
            var arguments = JSON.stringify(args);
            var command = "cd scripts && python -c 'import container_actions; print(container_actions.perform_action_inside_container(" + arguments + "))' ";

            var output = shell.exec(command);
            var info = JSON.parse(output.stdout);
            
            request.post({

                url: process.env.platform_url + '/log',
                form:{
                    action: "deploy_application",
                    application_id: req.body.application_id,
                    message: info.message.join('_newLine_'),
                    status: info.exitStatus,
                    timeEl: info.timeElapsed
                }

            },function(error, response, body){

                if(error){
                    res.boom.serverUnavailable();
                }
                else{
                    if(info.exitStatus == 'Failure'){
                        res.status(412).json({routerStatus:'Failure', log: JSON.parse(response.body)});
                    }
                    else{
                        res.status(200).json({routerStatus:'Success', log: JSON.parse(response.body)});
                    }
                }
            });
        } 
    });
});

router.put('/stop/:container_id/:repo_id', function(req, res, next) {
    
    request.get({
        url: process.env.apps_vm_url + '/repos/project/' + req.params.repo_id,
        headers: {
            'TOKEN': req.get('TOKEN')
        }
    }, function(error, response, body){
        
        if (response.statusCode != 200){
            var info = JSON.parse(response.body);
            res.status(response.statusCode).json({routerStatus:'Failure', message: info["message"]});
        }
        else{
            data = JSON.parse(body);
            
            var args = {};
            args["container_id"] = req.params.container_id;

            var x = {};
            x["function_name"] = "stop_application";
            x["params"] = {};
            x["params"]["username"] = 'no_input';
            args["function_details"] = x;
            
            var arguments = JSON.stringify(args);
            var command = "cd scripts && python -c 'import container_actions; print(container_actions.perform_action_inside_container(" + arguments + "))' ";

            var output = shell.exec(command);
            var info = JSON.parse(output.stdout);
            
            request.post({

                url: process.env.platform_url + '/log',
                form:{
                    action: "stop_application",
                    application_id: req.body.application_id,
                    message: info.message.join('_newLine_'),
                    status: info.exitStatus,
                    timeEl: info.timeElapsed
                }

            },function(error, response, body){

                if(error){
                    res.boom.serverUnavailable();
                }
                else{
                    if(info.exitStatus == 'Failure'){
                        res.status(412).json({routerStatus:'Failure', log: JSON.parse(response.body)});
                    }
                    else{
                        res.status(200).json({routerStatus:'Success', log: JSON.parse(response.body)});
                    }
                }
            });
        } 
    });
});




module.exports = router;