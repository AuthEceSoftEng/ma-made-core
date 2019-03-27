var express = require('express');
var router = express.Router();
var request = require('request');
var boom = require('express-boom');
var Q = require('q');

/**
 * @api {get} repos/users List the registered users into the local repository.
 * @apiName ListUsers
 * @apiGroup Users
 *
 * @apiParam {String} token The token used for administrator privileges in local repository.
 *
 * @apiSuccess {String} routerStatus Success
 * @apiSuccess {String} info Information of the users.
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          "routerStatus": "Success",
 *          "info": {
 *            "name": "developer_1",
 *            "username": "dev_1",
 *            "id": 2,
 *            "state": "active",
 *            "avatar_url": "http://www.gravatar.com/avatar/316a94c9e95ff8704325b0a7de2785f3?s=80&d=identicon",
 *            "web_url": "http://repos.mobileage/u/developer_1",
 *            "created_at": "2016-09-15T11:27:08.010Z",
 *            "is_admin": false,
 *            "bio": null,
 *            "location": null,
 *            "skype": "",
 *            "linkedin": "",
 *            "twitter": "",
 *            "website_url": "",
 *            "last_sign_in_at": "2016-09-15T11:27:08.055Z",
 *            "confirmed_at": "2016-09-15T11:27:08.012Z",
 *            "email": "developer@gmail.com",
 *            "theme_id": 2,
 *            "color_scheme_id": 1,
 *            "projects_limit": 100,
 *            "current_sign_in_at": "2016-09-15T11:27:08.055Z",
 *            "identities": [],
 *            "can_create_group": true,
 *            "can_create_project": true,
 *            "two_factor_enabled": false,
 *            "external": false
 *          }
 *      }
 *
 * @apiError {String} routerStatus Failure
 * @apiError {String} message Information regarding the origin of failure (e.g. Internal error)
 *
 */

router.get('/users', function(req, res, next) {

    request.get({

        url: process.env.code_repository_url + '/api/v3/users',
        headers: {
            'PRIVATE-TOKEN': process.env.admin_token
        },

    },function(error, response, body){
        
        if (response.statusCode != 200){
            var info = JSON.parse(response.body);
            res.status(response.statusCode).json({routerStatus:'Failure', message: info["message"]});
        }
        else{
            try{
                data = JSON.parse(body);
                res.status(200).json({routerStatus: "Success", users: data});
            }
            catch (e) {
                res.boom.badData('Response is not a valid json and thus unprocessable');
            }
        }
    });
});


/**
 * @api {get} repos/projects List all the projects of the local repository.
 * @apiName ListProjects
 * @apiGroup Applications
 *
 * @apiParam {String} token The token used for administrator privileges in local repository.
 *
 * @apiSuccess {String} routerStatus Success
 * @apiSuccess {String} info Information of the projects.
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          "routerStatus": "Success",
 *          "info": {
 *              "id": 4,
 *              "description": null,
 *              "default_branch": null,
 *              "tag_list": [],
 *              "public": false,
 *              "archived": false,
 *              "visibility_level": 0,
 *              "ssh_url_to_repo": "ssh://git@git.repos.mobileage/dev_1/myEvents.git",
 *              "http_url_to_repo": "http://repos.mobileage/dev_1/myEvents.git",
 *              "web_url": "http://repos.mobileage/dev_1/myEvents",
 *              "owner": {
 *                  "name": "developer_1",
 *                  "username": "dev_1",
 *                  "id": 3,
 *                  "state": "active",
 *                  "avatar_url": "http://www.gravatar.com/avatar/75f7b0e924085da9c3b433c5631cd26b?s=80&d=identicon",
 *                  "web_url": "http://repos.mobileage/u/dev_1"
 *                },
 *              "name": "myEvents",
 *              "name_with_namespace": "dev_1 / myEvents",
 *              "path": "myEvents",
 *              "path_with_namespace": "dev_1/myEvents",
 *              "issues_enabled": true,
 *              "merge_requests_enabled": true,
 *              "wiki_enabled": true,
 *              "builds_enabled": true,
 *              "snippets_enabled": false,
 *              "container_registry_enabled": true,
 *              "created_at": "2016-09-27T10:05:55.742Z",
 *              "last_activity_at": "2016-09-27T10:05:59.221Z",
 *              "shared_runners_enabled": true,
 *              "creator_id": 3,
 *              "namespace": {
 *                  "id": 4,
 *                  "name": "myEvents",
 *                  "path": "myEvents",
 *                  "owner_id": 3,
 *                  "created_at": "2016-09-22T12:31:10.563Z",
 *                  "updated_at": "2016-09-22T12:31:10.563Z",
 *                  "description": "",
 *                  "avatar": null,
 *                  "share_with_group_lock": false,
 *                  "visibility_level": 20,
 *                  "request_access_enabled": true,
 *                  "deleted_at": null
 *              },
 *              "avatar_url": null,
 *              "star_count": 0,
 *              "forks_count": 0,
 *              "open_issues_count": 0,
 *              "public_builds": true,
 *              "shared_with_groups": [],
 *              "permissions": {
 *              "project_access": null,
 *              "group_access": null
 *              }
 *          }
 *      }
 *
 * @apiError {String} routerStatus Failure
 * @apiError {String} message Information regarding the origin of failure (e.g. Internal error)
 *
 */

router.get('/projects', function(req, res, next) {

    request.get({

        url: process.env.code_repository_url + '/api/v3/projects/all',
        headers: {
            'PRIVATE-TOKEN': process.env.admin_token
        }
    },function(error, response, body){

        if(error){
            res.boom.resourceGone('Cannot connect to code repository');
        }
        else{
            if (response.statusCode != 200){
                var info = JSON.parse(response.body);
                res.status(response.statusCode).json({routerStatus:'Failure', message: info["message"]});
            }
            else{
                try{
                    data = JSON.parse(body);
                    res.status(200).json({routerStatus: "Success", projects: data});
                }
                catch (e) {
                    res.boom.badData('Response is not a valid json and thus unprocessable');
                }
            }
        }
    });
});

/**
 * @api {post} repos/users Create a new user.
 * @apiName AddNewUser
 * @apiGroup Users
 *
 * @apiParam {String} token The token used for administrator privileges in local repository.
 * @apiParam {String} name The name of the user to be added.
 * @apiParam {String} username The username of the user to be added.
 * @apiParam {String} password The password of the user to be added.
 * @apiParam {String} email The email of the user to be added
 *
 * @apiSuccess {String} routerStatus Success
 * @apiSuccess {String} info Information of the users.
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          "routerStatus": "Success",
 *          "info": {
 *            "name": "developer_1",
 *            "username": "dev_1",
 *            "id": 2,
 *            "state": "active",
 *            "avatar_url": "http://www.gravatar.com/avatar/316a94c9e95ff8704325b0a7de2785f3?s=80&d=identicon",
 *            "web_url": "http://repos.mobileage/u/developer_1",
 *            "created_at": "2016-09-15T11:27:08.010Z",
 *            "is_admin": false,
 *            "bio": null,
 *            "location": null,
 *            "skype": "",
 *            "linkedin": "",
 *            "twitter": "",
 *            "website_url": "",
 *            "last_sign_in_at": "2016-09-15T11:27:08.055Z",
 *            "confirmed_at": "2016-09-15T11:27:08.012Z",
 *            "email": "developer@gmail.com",
 *            "theme_id": 2,
 *            "color_scheme_id": 1,
 *            "projects_limit": 100,
 *            "current_sign_in_at": "2016-09-15T11:27:08.055Z",
 *            "identities": [],
 *            "can_create_group": true,
 *            "can_create_project": true,
 *            "two_factor_enabled": false,
 *            "external": false
 *          }
 *      }
 *
 * @apiError {String} routerStatus Failure
 * @apiError {String} message Information regarding the origin of failure (e.g. Internal error)
 *
 */


router.post('/users', function(req, res, next) {

    request.post({

        url: process.env.code_repository_url + '/api/v3/users',
        headers: {
            'PRIVATE-TOKEN': process.env.admin_token
        },
        form: {
            'name': req.body.name,
            'username': req.body.username,
            'password': req.body.password,
            'email': req.body.email
        }

    },function(error, response, body){

        if(error){
            res.boom.resourceGone('Cannot connect to code repository');
        }
        else{
            if (response.statusCode != 201){
                var info = JSON.parse(response.body);
                res.status(response.statusCode).json({routerStatus:'Failure', message: info["message"]});
            }
            else{
                try{
                    data = JSON.parse(body);

                    if (data.hasOwnProperty("message")){
                        res.json({routerStatus: "Failure", routerMessage: data});
                    }
                    else{
                        res.status(201).json({routerStatus: "Success", user: data});
                    }
                }
                catch (e) {
                    res.boom.badData('Response is not a valid json and thus unprocessable');
                }
            }
        }
    });
});



router.get('/users/:username', function(req, res, next) {

    request.get({

        url: process.env.code_repository_url + '/api/v3/users?username=' + req.params.username,
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
                data = JSON.parse(body);
                if (data.length == 0) {
                    res.json({routerStatus: "Failure", info: 'The username is not used'})
                } else {
                    res.json({routerStatus: "Success", info: data});
                }
            }
            catch (e) {
                res.boom.badData('Response is not a valid json and thus unprocessable');
            }
        }
    });
});


/* Create project for the authenticated user */
router.post('/project', function(req, res, next) {

    request.post({

        url: process.env.code_repository_url + '/api/v3/projects',
        headers: {
            'PRIVATE-TOKEN': req.get('TOKEN')
        },
        form: {
            'name': req.body.name
        }
    },function(error, response, body){

        if (response.statusCode != 201){
            var info = JSON.parse(response.body);
            res.status(response.statusCode).json({routerStatus:'Failure', info});
        }
        else{
            try{

                data = JSON.parse(body);

                if (data.hasOwnProperty("message")){
                    res.json({routerStatus: "Failure", info: data});
                }
                else{
                    res.status(201).json({routerStatus: "Success", project: data});
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
            'PRIVATE-TOKEN': req.get('TOKEN')
        }
    },function(error, response, body){

        if (response.statusCode != 200){
            var info = JSON.parse(response.body);
            res.status(response.statusCode).json({routerStatus:'Failure', message: info["message"]});
        }
        else{
            try{
                data = JSON.parse(body);
                res.status(200).json({routerStatus: "Success", info: data});
            }
            catch (e) {
                res.boom.badData('Response is not a valid json and thus unprocessable');
            }
        }
    });
});

/* Get the file tree of a given repository */
router.get('/project/:project_id/tree', function(req, res, next) {

    request.get({

        url: process.env.code_repository_url + '/api/v3/projects/' + req.params.project_id + '/repository/tree',
        headers: {
            'PRIVATE-TOKEN': req.get('TOKEN')
        }
    },function(error, response, body){

        if (response.statusCode != 200){
            var info = JSON.parse(response.body);
            res.status(response.statusCode).json({routerStatus:'Failure', message: info["message"]});
        }
        else{
            try{
                data = JSON.parse(body);
                res.status(200).json({routerStatus: "Success", files: data});
            }
            catch (e) {
                res.boom.badData('Response is not a valid json and thus unprocessable');
            }
        }
    });
});

/* Get the number of commits of the authenticated user */
router.get('/project/commits/all', function(req, res, next) {
	
	request.get({
	
		url: process.env.code_repository_url + '/api/v3/projects',
		headers: {
			'PRIVATE-TOKEN': req.get('TOKEN')
		}
		
	}, function(error, response, body) {
	
		if (response.statusCode != 200){
            var info = JSON.parse(response.body);
            res.status(response.statusCode).json({routerStatus:'Failure', message: info["message"]});
        }
        else{
            try{
                data = JSON.parse(body);
                
                async function getCommits(data) {
                	let finalArray = data.map(async(project) => {
                		const result = await getCommit(project, req.get('TOKEN'));
                		finalValue = result.length;
                		return finalValue;
                	});
                	
                	const resolvedFinalArray = await Promise.all(finalArray).then(function(values) {
                		res.status(200).json({routerStatus: "Success", commits: JSON.parse(values.reduce((a, b) => a + b, 0)) });
                	});
                	
                };
                
                getCommits(data);			
                
            }
            catch (e) {
                res.boom.badData('Response is not a valid json and thus unprocessable');
            }
        }
	});
});

function getCommit(project, token) {
	var deferred = Q.defer();
	
	request.get({
				        	
		url: process.env.code_repository_url + '/api/v3/projects/' + project.id + '/repository/commits',
		headers: {
			'PRIVATE-TOKEN': token
		}		
	}, function(error, response, body) {
		if (response.statusCode != 200){
			var info = JSON.parse(response.body);
			deferred.reject({routerStatus:'Failure', message: info["message"]});
		}
		else{
			com = JSON.parse(body);
			deferred.resolve(com);
		}
	});
	
	return deferred.promise;
}

/* Get the number of commits of last month */
router.get('/project/commits/lastmonth', function(req, res, next) {
	
	request.get({
	
		url: process.env.code_repository_url + '/api/v3/projects',
		headers: {
			'PRIVATE-TOKEN': req.get('TOKEN')
		}
		
	}, function(error, response, body) {
	
		if (response.statusCode != 200){
            var info = JSON.parse(response.body);
            res.status(response.statusCode).json({routerStatus:'Failure', message: info["message"]});
        }
        else{
            try{
                data = JSON.parse(body);
                var date = new Date();
                var currentMonth = date.getMonth();
                var currentYear = date.getFullYear();
                var returnArray = [];
                
                /*if (currentMonth == 0) {
					var desiredMonth = 11;
					var desiredYear = currentYear - 1;
				} else {
					var desiredMonth = currentMonth - 1;
					var desiredYear = currentYear;
				}*/
                
                async function getCommitsLastMonth(data) {
                	let finalArray = data.map(async(project) => {
                		const result = await getCommitLastMonth(project, req.get('TOKEN'), currentYear, currentMonth+1);
                		if (result.length > 0){
                			result.forEach(function(item) {
                				returnArray.push(item);
                			});
                			return 1;
                		}
                	});
                	
                	const resolvedFinalArray = await Promise.all(finalArray).then(function(values) {
                		res.status(200).json({routerStatus: "Success", commits: returnArray });
                	});
                	
                };
                
                getCommitsLastMonth(data);			
                
            }
            catch (e) {
                res.boom.badData('Response is not a valid json and thus unprocessable');
            }
        }
	});
});

function getCommitLastMonth(project, token, year, month) {
	var deferred = Q.defer();
	
	if (month < 10) month = '0' + month;
	
	request.get({
				        	
		url: process.env.code_repository_url + '/api/v3/projects/' + project.id + '/repository/commits?since=' + year + '-' + month + '-01T00:00:00Z&until=' + year + '-' + month + '-31T23:59:59Z',
		headers: {
			'PRIVATE-TOKEN': token
		}		
	}, function(error, response, body) {
		if (response.statusCode != 200){
			var info = JSON.parse(response.body);
			deferred.reject({routerStatus:'Failure', message: info["message"]});
		}
		else{
			com = JSON.parse(body);
			deferred.resolve(com);
		}
	});
	
	return deferred.promise;
}

/* Get the issues from last month */
router.get('/project/issues/lastmonth', function(req, res, next) {

	request.get({

        url: process.env.code_repository_url + '/api/v3/issues?order_by=created_at&sort=desc&per_page=100',
        headers: {
            'PRIVATE-TOKEN': req.get('TOKEN')
        }
    }, function(error, response, body) {
		
        if (response.statusCode != 200) {
            var info = JSON.parse(response.body);
            res.status(response.statusCode).json({routerStatus:'Failure', message: info["message"]});
        }
        else {
            try {
                data = JSON.parse(body);
                var date = new Date();
				var currentMonth = date.getMonth();
				
				/*if (currentMonth == 0) {
					var desiredMonth = 11;
				} else {
					var desiredMonth = currentMonth;
				}*/
                
                async function getIssues(data) {
                	let finalArray = data.map(async(issue) => {
                		if (issue.created_at.split("-")[1] == currentMonth+1) {
		            		return issue;
		            	}
                	});
                	
                	const resolvedFinalArray = await Promise.all(finalArray).then(function(values) {
                		res.status(200).json({routerStatus: "Success", issues: values.filter((obj) => obj) });
                	});
                	
                };
                
               	getIssues(data);
            }
            catch (e) {
                res.boom.badData('Response is not a valid json and thus unprocessable');
            }
        }
    });
});

/* Get all the issues of the autenticated user */
router.get('/project/issues/all', function(req, res, next) {

    request.get({

        url: process.env.code_repository_url + '/api/v3/issues&per_page=100',
        headers: {
            'PRIVATE-TOKEN': req.get('TOKEN')
        }
    },function(error, response, body) {
		
        if (response.statusCode != 200) {
            var info = JSON.parse(response.body);
            res.status(response.statusCode).json({routerStatus:'Failure', message: info["message"]});
        }
        else {
            try {
                data = JSON.parse(body);
                res.status(200).json({routerStatus: "Success", issues: data})
            }
            catch (e) {
                res.boom.badData('Response is not a valid json and thus unprocessable');
            }
        }
    });

});

/* Get all the opened issues of the autenticated user */
router.get('/project/issues/all/opened', function(req, res, next) {

    request.get({

        url: process.env.code_repository_url + '/api/v3/issues?state=opened&per_page=100',
        headers: {
            'PRIVATE-TOKEN': req.get('TOKEN')
        }
    },function(error, response, body) {
		
        if (response.statusCode != 200) {
            var info = JSON.parse(response.body);
            res.status(response.statusCode).json({routerStatus:'Failure', message: info["message"]});
        }
        else {
            try {
                data = JSON.parse(body);
                res.status(200).json({routerStatus: "Success", issues: data.length })
            }
            catch (e) {
                res.boom.badData('Response is not a valid json and thus unprocessable');
            }
        }
    });

});

/* Get the issues of a given repository */
router.get('/project/:project_id/issues', function(req, res, next) {

    request.get({

        url: process.env.code_repository_url + '/api/v3/projects/' + req.params.project_id + '/issues',
        headers: {
            'PRIVATE-TOKEN': req.get('TOKEN')
        }
    },function(error, response, body) {
		
        if (response.statusCode != 200) {
            var info = JSON.parse(response.body);
            res.status(response.statusCode).json({routerStatus:'Failure', message: info["message"]});
        }
        else {
            try {
                data = JSON.parse(body);
                res.status(200).json({routerStatus: "Success", issues: data})
            }
            catch (e) {
                res.boom.badData('Response is not a valid json and thus unprocessable');
            }
        }
    });

});

/* Create an issue for a given repository */
router.post('/project/:project_id/issues', function(req, res, next) {
	
    request.post({

        url: process.env.code_repository_url + '/api/v3/projects/' + req.params.project_id + '/issues',
        headers: {
            'PRIVATE-TOKEN': req.get('TOKEN')
        },
        form: {
            'title': req.body.title,
            'description': "```html" + '\n' + req.body.description + '\n' + "```",
            'confidential': req.body.confidential,
            'assignee_id': req.body.assignee_id,
            'milestone_id': req.body.milestone_id,
            'labels': req.body.labels,
            'merge_request_for_resolving_discussions': req.body.merge_request_for_resolving_discussions
        }
    }, function(error, response, body) {

        if (error) {
            res.boom.resourceGone('Cannot connect to code repository');
        }
        else{
            if (response.statusCode != 201){
                var info = JSON.parse(response.body);
                res.status(response.statusCode).json({routerStatus:'Failure', message: info["message"]});
            }
            else{
                try{
                    data = JSON.parse(body);

                    if (data.hasOwnProperty("message")){
                        res.json({routerStatus: "Failure", routerMessage: data});
                    }
                    else{
                        res.status(201).json({routerStatus: "Success", issues: data});
                    }
                }
                catch (e) {
                    res.boom.badData('Response is not a valid json and thus unprocessable');
                }
            }
        }
    });
});

/* Delete an issue of a given repository */
router.post('/project/:project_id/issues/:issue_id', function(req, res, next) {
	
    request.delete({

        url: process.env.code_repository_url + '/api/v3/projects/' + req.params.project_id + '/issues/' + req.params.issue_id,
        headers: {
            'PRIVATE-TOKEN': req.get('TOKEN')
        }
    }, function(error, response, body) {

        if (error) {
            res.boom.resourceGone('Cannot connect to code repository');
        }
        else{
            if (response.statusCode != 200){
                var info = JSON.parse(response.body);
                res.status(response.statusCode).json({routerStatus:'Failure', message: info["message"]});
            }
            else{
                try{
                    data = JSON.parse(body);

                    if (data.hasOwnProperty("message")){
                        res.json({routerStatus: "Failure", routerMessage: data});
                    }
                    else{
                        res.status(200).json({routerStatus: "Success", issues: data});
                    }
                }
                catch (e) {
                    res.boom.badData('Response is not a valid json and thus unprocessable');
                }
            }
        }
    });
});

/* Get the detailed number of daily issues of last month */
router.get('/project/issues/lastmonth/detailed', function(req, res, next) {
	
	request.get({
		
		url: process.env.apps_vm_url + '/repos/project/issues/lastmonth',
		headers: {
			'TOKEN': req.get('TOKEN')
		}
		
	}, function(error, response, body) {
		if (response.statusCode != 200) {
            var info = JSON.parse(response.body);
            res.status(response.statusCode).json({routerStatus:'Failure', message: info["message"]});
        }
        else {
        	try {
        		var issues = JSON.parse(body).issues;
        		var issuesPerDay = [];
        		for (let i = 0; i < 31; i++) {
        			issuesPerDay[i] = 0
        		}

        		async function getIssues(issues) {
                	let finalArray = issues.map(async(issue) => {
                		issuesPerDay[parseInt(issue.created_at.split('-')[2].substring(0,2))-1] += 1;
                		return 1;
                	});
                	
                	const resolvedFinalArray = await Promise.all(finalArray).then(function(values) {
                		res.status(200).json({routerStatus: "Success", issues: issuesPerDay });
                	});
                	
                };
                
               	getIssues(issues);
        		
        	} catch (e) {
				res.boom.badData('Response is not a valid json and thus unprocessable');
			}
		}
	});
	
});

/* Get the detailed number of daily commits of last month */
router.get('/project/commits/lastmonth/detailed', function(req, res, next) {
	
	request.get({
		
		url: process.env.apps_vm_url + '/repos/project/commits/lastmonth',
		headers: {
			'TOKEN': req.get('TOKEN')
		}
		
	}, function(error, response, body) {
		if (response.statusCode != 200) {
            var info = JSON.parse(response.body);
            res.status(response.statusCode).json({routerStatus:'Failure', message: info["message"]});
        }
        else {
        	try {
        		var commits = JSON.parse(body).commits;
        		var commitsPerDay = [];
        		for (let i = 0; i < 31; i++) {
        			commitsPerDay[i] = 0
        		}

        		async function getCommits(commits) {
                	let finalArray = commits.map(async(commit) => {
                		commitsPerDay[parseInt(commit.created_at.split('-')[2].substring(0,2))-1] += 1;
                		return 1;
                	});
                	
                	const resolvedFinalArray = await Promise.all(finalArray).then(function(values) {

                		res.status(200).json({routerStatus: "Success", commits: commitsPerDay });
                	});
                	
                };
                
               	getCommits(commits);
        		
        	} catch (e) {
				res.boom.badData('Response is not a valid json and thus unprocessable');
			}
		}
	});
	
});

/* Get information about issues and commits for last month */
router.get('/project/info/lastmonth', function(req, res, next) {
	
    request.get({

        url: process.env.apps_vm_url + '/repos/project/issues/lastmonth',
        headers: {
            'TOKEN': req.get('TOKEN')
        }
    }, function(error, response, body) {
		
        if (response.statusCode != 200) {
            var info = JSON.parse(response.body);
            res.status(response.statusCode).json({routerStatus:'Failure', message: info["message"]});
        }
        else {
            try {
                var issues = JSON.parse(body).issues;
                
                request.get({
                	
                	url: process.env.apps_vm_url + '/repos/project/commits/lastmonth',
                	headers: {
						'TOKEN': req.get('TOKEN')
					}
                	
                }, function(error, response, body) {
					
					if (response.statusCode != 200) {
						var info = JSON.parse(response.body);
						res.status(response.statusCode).json({routerStatus:'Failure', message: info["message"]});
					}
					else{
						try{
							var commits = JSON.parse(body).commits;
							var infos = [];
							
							async function getIssues(issues) {
						    	let finalArray = issues.map(async(issue) => {
						    		infos.push({'title': issue.title, 'type': 'Issue', 'timestamp': issue.created_at, 'author': issue.author.name});
						    		return 1;
						    	});
						    	
						    	const resolvedFinalArray = await Promise.all(finalArray).then(function(values) {
						    		async function getCommits(commits) {
						    			let finalCommit = commits.map(async(commit) => {
						    				infos.push({'title': commit.title, 'type': 'Commit', 'timestamp': commit.created_at, 'author': commit.author_name});
						    				return 1;
						    			});
						    			
						    			const resolvedArray = await Promise.all(finalCommit).then(function(values) {
						    				res.status(201).json({routerStatus: "Success", info: infos});
						    			});
						    		};
						    		
						    		getCommits(commits);
						    		
						    	});
						    	
						    };
						    
						   	getIssues(issues);
							
						}
						catch (e) {
						    res.boom.badData('Response is not a valid json and thus unprocessable');
						}
						
					}					
					                
                });
                
            }
            catch (e) {
                res.boom.badData('Response is not a valid json and thus unprocessable');
            }
        }
    });

});

module.exports = router;
