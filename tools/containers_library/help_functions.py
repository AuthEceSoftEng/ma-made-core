'''
    This file contains general functions called by the other scripts of mobile-age library.

'''

import os
import subprocess
import shutil
import sys

def get_path_of_malib():
    
    '''
    This function returns the absolute path of the directory where the ma.py file is located.
    
    @return A string containing the absolute path or error in case of failure.
    '''
    
    try:
        file_path = os.path.dirname(os.path.abspath(__file__))
        folder_path = file_path.rsplit('/', 1)
        return folder_path[0]
    except:
        return 'error'
    
def check_if_directory_exists(abspath):

    '''
    This function checks whether a directory exists or not.
    
    @param abspath: The absolute path of the directory.
    @return True/False or error in case of failure.
    '''
    
    try:
        return os.path.isdir(abspath)
    except:
        return 'error'
    
    
def check_if_directory_empty(abspath):

    '''
    This function checks whether a directory is empty or not.
    
    @param abspath: The absolute path of the directory.
    @return True/False or 'Directory does not exist'.
    '''
    
    if(check_if_directory_exists(abspath)):
        if (not os.listdir(abspath)):
            return True
        else:
            return False
    else:
        return 'Directory does not exist'

def remove_directory_contents(abspath):
    
    '''
    This function empties a specific directory.
    
    @param abspath: The absolute path of the directory.
    @return Success/Exception or 'Directory does not exist'.
    '''

    if(check_if_directory_exists(abspath)):
        contents = os.listdir(abspath)
        for item in contents:
            item_abspath = os.path.join(abspath, item)
            
            try:
                if(os.path.isfile(item_abspath)):
                    os.remove(item_abspath)
                elif(os.path.isdir(item_abspath)):
                    shutil.rmtree(item_abspath)
            except Exception as e:
                return e
        
        return 'Success'  
    else:
        return 'Directory does not exist'

def create_directory(abspath):

    '''
    This function creates the given directory structure.
    
    @param abspath: The absolute path of the directory.
    @return Success/Failure.
    '''
  
    if(not os.path.exists(abspath)):
        try:
            x = os.makedirs(abspath)
            return 'Success'
        except:
            return 'Failure - Cannot create directory'
    else:
        print('Failure - Directory already exists')

def change_directory(abspath):

    '''
    This function is used to change to specific directory.
    
    @param abspath: The absolute path of the directory.
    @return Success/Exception info.
    '''
    
    try:
        os.chdir(abspath)
        return 'Success'
    except:
        return sys.exc_info()[1]