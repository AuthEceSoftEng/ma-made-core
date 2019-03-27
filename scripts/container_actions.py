import os
import subprocess
import config
import json
import time

def start_container(args):
    
    '''
    This function is used in order to start a specific container.
    
    @param container_id: The id of the container.
    @return Success/Failure.
    @return log_msg: A list containing the log messages that occurred during the process.
    '''   
    
    t1 = time.time()
    log_msg = []
    flag_failure = False
    
    try:
        args = json.dumps(args)
        args = json.loads(args)
        container_id = args['container_id']
    except:
        flag_failure = True
        log_msg.append('Wrong arguments provided!')
        log_msg.append(args)
        t2 = time.time()
        timeElapsed = t2 - t1
        return json.dumps({"exitStatus":"Failure", "message": log_msg, "timeElapsed": timeElapsed})
    
    command = 'echo "' + config.sudoer_password + '" | sudo --prompt="" -S docker start ' + container_id
    
    proc = subprocess.Popen([command], stdout=subprocess.PIPE, stderr=subprocess.STDOUT, shell = True)
    (out, err) = proc.communicate()
    out.decode("utf-8").split('\r\n')

    if(proc.returncode == 0):
        log_msg.append('Container started successfully')
    else:
        flag_failure = True
        log_msg.append('Container failed to start')
        log_msg.append(str(out))
    
    t2 = time.time()
    timeElapsed = t2 - t1
        
    if(flag_failure):
        return json.dumps({"exitStatus":"Failure", "message": log_msg, "timeElapsed": timeElapsed})
    else:
        return json.dumps({"exitStatus":"Success", "message": log_msg, "timeElapsed": timeElapsed})


def stop_container(args):
    
    '''
    This function is used in order to stop a specific container.
    
    @param container_id: The id of the container.
    @return Success/Failure.
    @return log_msg: A list containing the log messages that occurred during the process.
    '''   
    
    t1 = time.time()
    log_msg = []
    flag_failure = False
    
    try:
        args = json.dumps(args)
        args = json.loads(args)
        container_id = args['container_id']
    except:
        flag_failure = True
        log_msg.append('Wrong arguments provided!')
        log_msg.append(args)
        t2 = time.time()
        timeElapsed = t2 - t1
        return json.dumps({"exitStatus":"Failure", "message": log_msg, "timeElapsed": timeElapsed})
    
    command = 'echo "' + config.sudoer_password + '" | sudo --prompt="" -S docker stop ' + container_id
    
    proc = subprocess.Popen([command], stdout=subprocess.PIPE, stderr=subprocess.STDOUT, shell = True)
    (out, err) = proc.communicate()
    out.decode("utf-8").split('\r\n')

    if(proc.returncode == 0):
        log_msg.append('Container stopped successfully')
    else:
        flag_failure = True
        log_msg.append('Container failed to stop')
        log_msg.append(str(out))
    
    t2 = time.time()
    timeElapsed = t2 - t1
    
    if(flag_failure):
        return json.dumps({"exitStatus":"Failure", "message": log_msg, "timeElapsed": timeElapsed})
    else:
        return json.dumps({"exitStatus":"Success", "message": log_msg, "timeElapsed": timeElapsed})

def deploy_container(args):
    
    '''
    This function is used in order to deploy a container based on a given predefined image.
    
    @param image_name: The name of the predefined image.
    @param container_name: The name of the container.
    @param port_exposed: The port number to be exposed by the container.
    @return Success/Failure.
    @return log_msg: A list containing the log messages that occurred during the process.
    '''   
    
    t1 = time.time()
    log_msg = []
    flag_failure = False
    
    try:
        args = json.dumps(args)
        args = json.loads(args)
        image_name = args['image_name']
        container_name = args['container_name']
        port_exposed = args['port_exposed']
    except:
        flag_failure = True
        log_msg.append('Wrong arguments provided!')
        log_msg.append(args)
        t2 = time.time()
        timeElapsed = t2 - t1
        return json.dumps({"exitStatus":"Failure", "message": log_msg, "timeElapsed": timeElapsed})
    
    command = 'echo "' + config.sudoer_password + '" | sudo --prompt="" -S docker run -d -t --name ' + container_name + ' --publish ' + port_exposed + ':' + port_exposed + ' ' + image_name 
    
    proc = subprocess.Popen([command], stdout=subprocess.PIPE, stderr=subprocess.STDOUT, shell = True)
    (out, err) = proc.communicate()
    out.decode("utf-8").split('\r\n')
 
    if(proc.returncode == 0):
        log_msg.append('Container deployment successful')
    else:
        flag_failure = True
        log_msg.append('Container deployment failed')
        log_msg.append(str(out))
    
    t2 = time.time()
    timeElapsed = t2 - t1
    
    if(flag_failure):
        return json.dumps({"exitStatus":"Failure", "message": log_msg, "timeElapsed": timeElapsed})
    else:
        return json.dumps({"exitStatus":"Success", "message": log_msg, "timeElapsed": timeElapsed, "container_id": out.replace('\n','')})

def delete_container(args):
    
    '''
    This function is used in order to delete a specific container.
    
    @param container_id: The id of the container.
    @return Success/Failure.
    @return log_msg: A list containing the log messages that occurred during the process.
    '''   
    
    t1 = time.time()
    log_msg = []
    flag_failure = False
    
    try:
        args = json.dumps(args)
        args = json.loads(args)
        container_id = args['container_id']
    except:
        flag_failure = True
        log_msg.append('Wrong arguments provided!')
        log_msg.append(args)
        t2 = time.time()
        timeElapsed = t2 - t1
        return json.dumps({"exitStatus":"Failure", "message": log_msg, "timeElapsed": timeElapsed})
    
    command = 'echo "' + config.sudoer_password + '" | sudo --prompt="" -S docker rm ' + container_id 
    
    proc = subprocess.Popen([command], stdout=subprocess.PIPE, stderr=subprocess.STDOUT, shell = True)
    (out, err) = proc.communicate()
    out.decode("utf-8").split('\r\n')

    if(proc.returncode == 0):
        log_msg.append('Container removed successfully.')
    else:
        flag_failure = True
        log_msg.append('Container removal failure. Maybe the container is still active')
        log_msg.append(str(out))
    
    t2 = time.time()
    timeElapsed = t2 - t1
    
    if(flag_failure):
        return json.dumps({"exitStatus":"Failure", "message": log_msg, "timeElapsed": timeElapsed})
    else:
        return json.dumps({"exitStatus":"Success", "message": log_msg, "timeElapsed": timeElapsed})


def get_container_details(args):

    '''
    This function is used in order to get all the details a specific container.
    
    @param container_id: The id of the container.
    @return Success/Failure.
    @return When Success it returns a dictionary containing the information of the container,
            Null in case of Failure  
    '''   
    
    t1 = time.time()
    
    try:
        args = json.dumps(args)
        args = json.loads(args)
        container_id = args['container_id']
    except:
        t2 = time.time()
        timeElapsed = t2 - t1
        return json.dumps({"exitStatus":"Failure", "message": "NULL", "timeElapsed": timeElapsed})
    
    
    command = 'echo "' + config.sudoer_password + '" | sudo --prompt="" -S docker inspect ' + container_id
    proc = subprocess.Popen([command], stdout=subprocess.PIPE, stderr=subprocess.STDOUT, shell = True)
    (out, err) = proc.communicate()
    out.decode("utf-8").split('\r\n')
    
    t2 = time.time()
    timeElapsed = t2 - t1
    
    if(proc.returncode == 0):
        try:
            container_info = json.loads(out)[0]
            return json.dumps({"exitStatus":"Success", "message": container_info, "timeElapsed": timeElapsed})
        except:
            return json.dumps({"exitStatus":"Failure", "message": "NULL", "timeElapsed": timeElapsed})
    else:
        return json.dumps({"exitStatus":"Failure", "message": "NULL", "timeElapsed": timeElapsed})
    

def check_if_active(args):
     
    '''
    This function is used in order to check whether a specific container is active or not.
     
    @param container_id: The id of the container.
    @return True/False/Failure.
    @return log_msg: A list containing the log messages that occurred during the process.
    '''   
     
    t1 = time.time()
    
    try:
        arguments = json.dumps(args)
        arguments = json.loads(arguments)
        container_id = args['container_id']
    except:
        t2 = time.time()
        timeElapsed = t2 - t1
        return json.dumps({"exitStatus":"Failure", "message": "NULL", "timeElapsed": timeElapsed})
    
    info = json.loads(get_container_details(args))

    if (info['exitStatus'] == "Success"):
        return json.dumps({"exitStatus":"Success", "message": info['message']['State']['Running'], "timeElapsed": info['timeElapsed']})
    else:
        return json.dumps({"exitStatus":"Failure", "message": "NULL", "timeElapsed": info['timeElapsed']})
    
def perform_action_inside_container(args):

    '''
    This function is used in order to perform an action inside a specific container.
    
    @param container_id: The id of the container.
    @param function_details: A dictionary containing all the details of the function to be called.
            e.x.:{
                    "function_name": "the name of the function",
                    "params": {
                        "var_1": "value_1",
                        ...,
                        "var_N": "value_N",
                    }
                }
    @return Success/Failure.
    @return When Success it returns a dictionary containing the information of the container,
            Null in case of Failure  
    '''   
    
    t1 = time.time()
    
    log_msg = []
    flag_failure = False
    
    try:
        arguments = json.dumps(args)
        arguments = json.loads(arguments)
        container_id = args['container_id']
        function_details = arguments['function_details']
    except:
        flag_failure = True
        log_msg.append('Wrong arguments provided!')
        log_msg.append(args)
        t2 = time.time()
        timeElapsed = t2 - t1
        return json.dumps({"exitStatus":"Failure", "message": log_msg, "timeElapsed": timeElapsed})
    
    function_call = '"' + 'import malib.ma as malib; malib.' + function_details["function_name"] + '('
    args = function_details["params"].keys()
    if (len(args) > 0):
        for i in range(0, len(args) - 1):
            function_call = function_call + "'" + function_details["params"][args[i]] + "', "
    
        function_call = function_call + "'" + function_details["params"][args[(len(args) - 1)]] + "')" + '"'
    else:
        function_call = function_call + ")" + '"'

    command = 'echo "' + config.sudoer_password + '" | sudo --prompt="" -S docker exec ' + container_id + ' python3 -c ' + function_call

    proc = subprocess.Popen([command], stdout=subprocess.PIPE, stderr=subprocess.STDOUT, shell = True)
    (out, err) = proc.communicate()
    out.decode("utf-8").split('\r\n')
    
    t2 = time.time()
    timeElapsed = t2 - t1
    
    info = json.loads(out)
    if(proc.returncode == 0):
        return json.dumps({"exitStatus":info['exitStatus'], "message": info['message'], "timeElapsed": timeElapsed})
    else:
        return json.dumps({"exitStatus":"Failure", "message": "NULL", "timeElapsed": timeElapsed})
