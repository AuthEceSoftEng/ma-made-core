import container_actions
import sys

    
def run_function(function_details):
    
    '''
    This function is used in order to get all the details a specific container.
    
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
    
    try:
        x = getattr(container_actions, function_details["function_name"])(function_details['params'])
        print(x)
    except:
        print(sys.exc_info())