import requests
import json
import datasetsHandler

class dataImporter:
    """
    This class implements a data importer responsible for importing the data into a MongoDB.
    """
    def __init__(self, dH, keys_to_exclude = []):
        """
        Initializes this data importer. The initialization requires a data handler instance.
        
        :param dH: the data handler instance
        :param keys_to_exclude: a list containing the keys which are to be excluded in the import process
        """
        self.dH = dH
        self.keys_to_exclude = keys_to_exclude

    def import_data(self, url, dataset):
        """
        Imports the data into the MongoDB
        
        :param url: the endpoint that accepts the data
        """
        if(not url.endswith('/')):
            url = url + '/'
        
        if(len(self.dH.get_datasets_files_path(dataset)) > 0):        
            for data_file in self.dH.get_datasets_files_path(dataset):
        
                docs = []
                data = self.dH.read_data(data_file)
                    
                for (i, row) in data.iterrows():
                    info = {}
                    for key in row.keys():
                        if (key not in self.keys_to_exclude):
                            modified_key = key.replace(' ', '_')
                            info[modified_key] = row[key]
                    docs.append(info)
                
                r = requests.post(url + dataset,
                                 headers = {
                                     'Content-Type': 'application/json',
                                     'Accept': 'application/json'
                                 }, data = json.dumps(docs))
                    
                response = r.json()
                if(response['_status'] == 'OK'):
                    return json.dumps({'exitStatus': 'Success'})
                else:
                    arr = []
                    for (i,item) in enumerate(response["_items"]):
                        if(item['_status'] != 'OK' and item['_issues'] not in arr):
                            #print('Item ' + str(i) + ': ', item)
                            arr.append(item['_issues'])
                            
                    return json.dumps({ 'exitStatus': 'Failure', 'logs': arr })
