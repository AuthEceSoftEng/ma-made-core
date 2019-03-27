var express = require('express');
var router = express.Router();
var shell = require('shelljs');
var request = require('request');

/**
 * @api {post} containers/deploy/:user/:image_tag/:port_number Deploy a container based on a pre-existing image
 * @apiName DeployContainer
 * @apiGroup Developers
 *
 * @apiParam {String} user The username of the container owner.
 * @apiParam {String} image_tag The name of the image which will be used in container creation process.
 * @apiParam {Number} port_number The number of the port to be exposed for the application.
 *
 * @apiSuccess {String} routerStatus Success
 * @apiSuccess {String} containerId The <code>id</code> of the container created.
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          "routerStatus": "Success",
 *          "containerId": "33c23dd5af51785affe61493ce66fa501b697b9850e86e7b01eaaa3751946708"
 *      }
 *
 * @apiError {String} routerStatus Failure
 * @apiError {String} message The failed request
 *
 */

router.post('/deploy/:user/:image_tag/:port_number', function(req, res, next) {
    
    var application_id = req.params.user.split('_')[1];
    var args = {};
    args['container_name'] = req.params.user;
    args['image_name'] = req.params.image_tag;
    args['port_exposed'] = req.params.port_number;
     
    var arguments = JSON.stringify(args);
     
    var shell_request = "cd scripts && python -c 'import container_actions; print(container_actions.deploy_container(" + arguments + "))' ";
    var output = shell.exec(shell_request);
     
    var info = JSON.parse(output.stdout);
     
    request.post({
         
        url: process.env.platform_url + '/log',
        form:{
            action: "deploy_container",
            application_id: application_id,
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
                res.status(response.statusCode).json({routerStatus:'Success', log: JSON.parse(response.body), containerId: info.container_id});
            }
        }
    });
});

/**
 * @api {put} containers/start/:container_id Start a container
 * @apiName StartContainer
 * @apiGroup Developers
 *
 * @apiParam {String} container_id The container <code>id</code>
 *
 * @apiSuccess {String} routerStatus Success
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          "routerStatus": "Success",
 *      }
 *
 * @apiError {String} routerStatus Failure
 * @apiError {String} message The failed request
 *
 */

router.put('/start/:container_id', function(req, res, next) {
    
    var args = {};
    args['container_id'] = req.params.container_id;
    
    var arguments = JSON.stringify(args);
     
    var shell_request = "cd scripts && python -c 'import container_actions; print(container_actions.start_container(" + arguments + "))' ";
    var output = shell.exec(shell_request);
     
    var info = JSON.parse(output.stdout);
     
    request.post({
         
        url: process.env.platform_url + '/log',
        form:{
            action: "start_container",
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

/**
 * @api {put} containers/stop/:container_id Stop a container
 * @apiName StopContainer
 * @apiGroup Developers
 *
 * @apiParam {String} container_id The container <code>id</code>
 *
 * @apiSuccess {String} routerStatus Success
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          "routerStatus": "Success",
 *      }
 *
 * @apiError {String} routerStatus Failure
 * @apiError {String} message The failed request
 *
 */

router.put('/stop/:container_id', function(req, res, next) {
    
    var args = {};
    args['container_id'] = req.params.container_id;
    
    var arguments = JSON.stringify(args);
     
    var shell_request = "cd scripts && python -c 'import container_actions; print(container_actions.stop_container(" + arguments + "))' ";
    var output = shell.exec(shell_request);
     
    var info = JSON.parse(output.stdout);
     
    request.post({
         
        url: process.env.platform_url + '/log',
        form:{
            action: "stop_container",
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

/**
 * @api {put} containers/sync/:container_id/:repo_id Syncronize a container's workspace with a git repository.
 * @apiName SyncContainer
 * @apiGroup Developers
 *
 * @apiParam {String} container_id The container <code>id</code>.
 * @apiParam {Number} repo_id The <code>id</code> of the project from the local git repository.
 *
 * @apiSuccess {String} routerStatus Success
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          "routerStatus": "Success",
 *      }
 *
 * @apiError {String} routerStatus Failure
 * @apiError {String} message The failed request
 *
 */

router.put('/sync/:container_id/:repo_id', function(req, res, next) {
    
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
            
            var url = data["info"]["http_url_to_repo"].replace('http://localhost:' + process.env.code_repository_port, process.env.code_repository_url);
            url = url.replace('http://', 'http://' + data.info.owner.username + ':' + req.body.password + '@')
            
            var args = {};
            args["container_id"] = req.params.container_id;
            var x = {};
            x["function_name"] = "synchronize_repo";
            x["params"] = {};
            x["params"]["username"] = data["info"]["owner"]["username"];
            x["params"]["repo"] = url;
            args["function_details"] = x;
            
            var arguments = JSON.stringify(args);
            
            var command = "cd scripts && python -c 'import container_actions; print(container_actions.perform_action_inside_container(" + arguments + "))' ";
            var output = shell.exec(command);
            
            var info = JSON.parse(output.stdout);
            
            request.post({
         
                url: process.env.platform_url + '/log',
                form:{
                    action: "sync_workspace",
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

/**
 * @api {get} containers/isActive/:container_id Check whether a container is running.
 * @apiName ContainerIsActive
 * @apiGroup Developers
 *
 * @apiParam {String} container_id The container <code>id</code>.
 *
 * @apiSuccess {String} routerStatus Success
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          "routerStatus": "Success",
 *          "isActive": "true"
 *      }
 *
 * @apiError {String} routerStatus Failure
 * @apiError {String} message The failed request
 *
 */

router.get('/isActive/:container_id', function(req, res, next) {

    var args = {};
    args['container_id'] = req.params.container_id;
    
    var arguments = JSON.stringify(args);
     
    var shell_request = "cd scripts && python -c 'import container_actions; print(container_actions.check_if_active(" + arguments + "))' ";
    var output = shell.exec(shell_request);
     
    var info = JSON.parse(output.stdout);
    
    if(info.exitStatus == 'Failure'){
        res.status(412).json({routerStatus:'Failure'});
    }
    else{
        res.status(200).json({routerStatus:'Success', isActive:info.message});
    }
    
});

module.exports = router;
