import json
from datasetsHandler import datasetsHandler

def createSchema(dataset):
	dH = datasetsHandler('datasets')

	# Get the data files of the first dataset
	data_files_path = dH.get_datasets_files_path(dataset)

	# Create the schema and store it in schemas directory
	df = dH.read_data(data_files_path[0], columns = 'all')
	dv = json.loads(dH.data_validator(df))
	
	if dv['exitStatus'] == 'Failure':
		return json.dumps({'exitStatus': 'Failure', 'log': dv['logs']})
	else:
		dH.schema_extractor(df, 'schemas/' + dataset + '.schema')
		
		return json.dumps({'exitStatus': 'Success'});
