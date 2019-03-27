import settings
import socket
import json

def start_service():
	port = settings.SERVICE_PORT + 1
	
	s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
	while port < 8000:
		try:
			s.bind((settings.HOST, port))
			break
		except:
			port += 1
			
	s.close()
	
	if port < 8000:
		return json.dumps({ 'exitStatus': 'Success', 'port': port })
	else:
		return json.dumps({ 'exitStatus': 'Success', 'log': 'No available port' })
