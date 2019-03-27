'''
    This file contains the mobile-age library that enables performing various actions 
    inside the containers.

'''

import os
import subprocess
import shutil
import sys
import time
import malib.help_functions as help_functions
import json

def init_workspace(username, mode = 'outsideCall'):

    '''
    This function is used to initialize the workspace of the developer's container.
    
    @param username: The username of the developer.
    @param mode: outsideCall/insideCall depending on whether the function is called by outside
                 or inside the container. When called from inside the container it has to use
                 return rather than print
    @return Success/Failure.
    @return log_msg: A list containing the log messages that occurred during the process.
    '''

    log_msg = []
    flag_failure = False
    
    if(not username):
        log_msg.append('The username is empty')
        flag_failure = True
    else:
        home_path = os.path.join(help_functions.get_path_of_malib(), 'home', username)
        if(help_functions.check_if_directory_exists(home_path)):
            log_msg.append(home_path + ' exists')
            if(help_functions.check_if_directory_empty(home_path)):
                log_msg.append(home_path + ' is empty')
            else:
                flag_empty = help_functions.remove_directory_contents(home_path) 
                if (flag_empty is 'Success'):
                    log_msg.append('The workspace emptied successfully')
                else:
                    flag_failure = True
                    log_msg.append('The workspace could not be emptied')
        else:
            log_msg.append(home_path + ' does not exist')
            flag_create = help_functions.create_directory(home_path)
            if (flag_create is 'Success'):
                log_msg.append(home_path + ' created successfully')
            else:
                flag_failure = True
                log_msg.append(home_path + ' creation failed' + ' ' + flag_create)

    if(flag_failure):
        if(mode == 'insideCall'):
            return(json.dumps({"exitStatus":"Failure", "message": log_msg}))
        print(json.dumps({"exitStatus":"Failure", "message": log_msg}))
    else:
        if(mode == 'insideCall'):
            return(json.dumps({"exitStatus":"Success", "message": log_msg}))
        print(json.dumps({"exitStatus":"Success", "message": log_msg}))

def synchronize_repo(username, repo_url):

    '''
    This function is used to synchronize the developer's repository in the workspace of the 
    application dedicated container.
    
    @param username: The username of the developer.
    @param repo_url: The http url to local repository (including owner credentials e.g.http://user:pass@host.git).
    @return Success/Failure.
    @return log_msg: A list containing the log messages that occurred during the process.
    '''   
    
    log_msg = []
    flag_failure = False
    
    init_flag = init_workspace(username, mode = 'insideCall')
    if(json.loads(init_flag)['exitStatus'] == 'Success'):
        if(help_functions.change_directory(os.path.join(help_functions.get_path_of_malib(), 'home', username)) is 'Success'):

            proc = subprocess.Popen(["git clone " + repo_url], stdout=subprocess.PIPE, stderr=subprocess.STDOUT, shell = True)
            (out, err) = proc.communicate()
            out = out.decode("utf-8").splitlines()
            
            if(proc.returncode == 0):
                log_msg.append('Repository synchronization successful')
            else:
                log_msg.append('Repository synchronization failed')
                for i in range(0, len(out)):
                    log_msg.append(out[i])
                flag_failure = True
        else:
            log_msg.append('Unable to move to workspace directory. Repository synchronization failed.')
            flag_failure = True
    else:
        flag_failure = True

    if(flag_failure):
        print(json.dumps({"exitStatus":"Failure", "message": log_msg}))
    else:
        print(json.dumps({"exitStatus":"Success", "message": log_msg}))

def install_node_application_dependencies(username, application_name):

    '''
    This function is used to deploy the application located in the developer's
    workspace.
    
    @param username: The username of the developer.
    @param application_name: The name of the application.
    @return Success/Failure.
    @return log_msg: A list containing the log messages that occurred during the process.
    '''   
    
    log_msg = []
    flag_failure = False
    
    if(not username):
        log_msg.append('The username is empty')
        flag_failure = True
    else:
        if(help_functions.change_directory(os.path.join(help_functions.get_path_of_malib(), 'home', username, application_name)) is 'Success'):
            
            proc = subprocess.Popen(["npm install"], stdout=subprocess.PIPE, stderr=subprocess.STDOUT, shell = True)
            (out, err) = proc.communicate()
            out = out.decode("utf-8").splitlines()
            
            if(proc.returncode == 0):
                log_msg.append('Dependencies installed successfully')
                for i in range(0, len(out)):
                    log_msg.append(out[i])
            else:
                log_msg.append('Dependencies installation failed')
                for i in range(0, len(out)):
                    log_msg.append(out[i])
                flag_failure = True
        
        else:
            log_msg.append('Unable to move to workspace directory. Install dependencies failed.')
            flag_failure = True

    if(flag_failure):
        print(json.dumps({"exitStatus":"Failure", "message": log_msg}))
    else:
        print(json.dumps({"exitStatus":"Success", "message": log_msg}))
        
def deploy_node_application(username, application_name):

    '''
    This function is used to deploy the application located in the developer's
    workspace.
    
    @param username: The username of the developer.
    @param application_name: The name of the application.
    @return Success/Failure.
    @return log_msg: A list containing the log messages that occurred during the process.
    '''   
    
    log_msg = []
    flag_failure = False
    
    if(not username):
        log_msg.append('The username is empty')
        flag_failure = True
    else:
        if(help_functions.change_directory(os.path.join(help_functions.get_path_of_malib(), 'home', username, application_name)) is 'Success'):
            
            proc = subprocess.Popen(['screen -S deploy -dm bash -c "npm start > output.log 2>&1"'], stdout=subprocess.PIPE, stderr=subprocess.STDOUT, shell = True)
            (out, err) = proc.communicate()
            out = out.decode("utf-8").splitlines()
            
            if(proc.returncode == 0):
                time.sleep(2) # This is used in order to provide the necessary time for the error to occur. 
                output = json.loads(check_screen_sockets())
                if(output['exitStatus'] == 'Success'):
                    log_msg.append('Application deployed successfully')
                else:
                    output2 = json.loads(get_deployment_output_log(username, application_name))
                    for log in output2['message']:
                        log_msg.append(log)
                    flag_failure = True
            else:
                log_msg.append('Application deployment failed')
                for i in range(0, len(out)):
                    log_msg.append(out[i])
                flag_failure = True
        
        else:
            log_msg.append('Unable to move to workspace directory. Repository synchronization failed.')
            flag_failure = True

    if(flag_failure):
        print(json.dumps({"exitStatus":"Failure", "message": log_msg}))
    else:
        print(json.dumps({"exitStatus":"Success", "message": log_msg}))
        
def check_screen_sockets():

    '''
    This function is used to check the screen sockets in order to find out to conclude 
    regarding whether the deployment is successful.
    
    @return Success/Failure.
    @return log_msg: A list containing the log messages that occurred during the process.
    '''   
    
    log_msg = []
    flag_failure = False
    
    proc = subprocess.Popen(['screen -ls'], stdout=subprocess.PIPE, stderr=subprocess.STDOUT, shell = True)
    (out, err) = proc.communicate()
    out = out.decode("utf-8").splitlines()
    
    if(proc.returncode == 0 or proc.returncode == 1):
        for i in range(0, len(out)):
            if (len(out[i].split('deploy')) > 1):
                log_msg.append('Application deployed successfully')
                return json.dumps({"exitStatus":"Success", "message": log_msg})
    else:
        log_msg.append('Screen sockets check failed. Deploy socket not found.')
        flag_failure = True
 
    if(flag_failure):
        return json.dumps({"exitStatus":"Failure", "message": log_msg})
    else:
        log_msg.append('No deploy sockets found')
        return json.dumps({"exitStatus":"Failure", "message": log_msg})
        
def get_deployment_output_log(username, application_name):

    '''
    This function is used to get the contents of the output.log.
    
    @return Success/Failure.
    @return log_msg: A list containing the log messages that occurred during the process.
    '''   
    
    log_msg = []
    flag_failure = False
    
    if(help_functions.change_directory(os.path.join(help_functions.get_path_of_malib(), 'home', username, application_name)) is 'Success'):
        
        proc = subprocess.Popen(['cat output.log'], stdout=subprocess.PIPE, stderr=subprocess.STDOUT, shell = True)
        (out, err) = proc.communicate()
        out = out.decode("utf-8").splitlines()
    
        if(proc.returncode == 0):
            for i in range(0, len(out)):
                log_msg.append(out[i])
        else:
            log_msg.append('Error log retrieval failed')
            flag_failure = True
    else:
        log_msg.append('Unable to move to workspace directory. Error log retrieval failed.')
        flag_failure = True
    
    if(flag_failure):
        return json.dumps({"exitStatus":"Failure", "message": log_msg})
    else:
        log_msg.append('The error log retrieved successfully')
        return json.dumps({"exitStatus":"Success", "message": log_msg})
    
def stop_application(arg = "None"):

    '''
    This function is used to stop the deployment of the developer's application.
    
    @return Success/Failure.
    @return log_msg: A list containing the log messages that occurred during the process.
    '''   
    
    log_msg = []
    flag_failure = False
    
    proc = subprocess.Popen(['screen -X -S deploy quit'], stdout=subprocess.PIPE, stderr=subprocess.STDOUT, shell = True)
    (out, err) = proc.communicate()
    out = out.decode("utf-8").splitlines()

    if(proc.returncode == 0):
        log_msg.append('Application stopped successfully')
    else:
        log_msg.append('Application stopping procedure failed')
        flag_failure = True

    if(flag_failure):
         print(json.dumps({"exitStatus":"Failure", "message": log_msg}))
    else:
         print(json.dumps({"exitStatus":"Success", "message": log_msg}))
    
def update_ma_library(admin_username, admin_password):

    '''
    This function is used to update ma library inside the developr's container.
    
    @return Success/Failure.
    @return log_msg: A list containing the log messages that occurred during the process.
    '''   
    
    log_msg = []
    flag_failure = False
    
    command = 'git clone https://' + admin_username + ':' + admin_password + '@github.com/AuthEceSoftEng/mobile-age-containers-library.git malib'
    flag_empty = help_functions.remove_directory_contents(os.sep + 'malib') 
     
    if (flag_empty is 'Success'):
        proc = subprocess.Popen([command], stdout=subprocess.PIPE, stderr=subprocess.STDOUT, shell = True)
        (out, err) = proc.communicate()
        out = out.decode("utf-8").splitlines()
     
        if(proc.returncode == 0):
            log_msg.append('Update successful')
        else:
            log_msg.append('Update failed')
            flag_failure = True

    if(flag_failure):
        print(json.dumps({"exitStatus":"Failure", "message": log_msg}))
    else:
        print(json.dumps({"exitStatus":"Success", "message": log_msg}))