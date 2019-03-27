from datasetsHandler import datasetsHandler
import dataImporter
from settings import HOST as host
from settings import SERVICE_PORT as host_port
import json

def importData(dataset, port):
	# Initialize the datasets handler
	dH = datasetsHandler('datasets')

	# Initialize the data importer
	dI = dataImporter.dataImporter(dH)

	# Import data (change the url according with your configuration)
	result = dI.import_data('http://' + host + ':' + str(port) + '/api/v1/', dataset)
	result = json.loads(result)
	
	if result['exitStatus'] == 'Success':
		return json.dumps({ 'exitStatus': 'Success', 'url': 'http://' + host + ':' + str(host_port) + '/api/v1/' + dataset });
	else:
		return json.dumps({ 'exitStatus': 'Failure', 'logs': result['logs'] })
