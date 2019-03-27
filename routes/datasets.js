var express = require('express');
var router = express.Router();
var request = require('request');

const DATA_RESTIFICATION_KIT_URL = process.env.data_restification_kit_url;

/**
 * @param req.query.datasetName - The name of the dataset
 * @param req.query.separator - The separator of the dataset (default ',')
 */
router.post('/uploadDataset', function (req, res, next) {

	if (!req.query.datasetName) {
		return res.status(400).json({ routerStatus: 'error', log: 'You should provide datasetName' })
	}

	const datasetName = req.query.datasetName;
	const separator = req.query.separator || ',';

	const data_kit_req = request({
		url: `${DATA_RESTIFICATION_KIT_URL}/api/validateDataset?datasetName=${datasetName}&separator=${separator}`,
		method: 'POST',
	}, (error, response, body) => {
		if (error) {
			console.log(error);
			return res.status(500).json({ routerStatus: 'Failure', log: error });
		} else {
			try {
				const _body = JSON.parse(body);
				if (!(String(response.statusCode).startsWith('2'))) {
					console.log(_body);
					return res.status(500).json({ routerStatus: 'Failure', log: _body.error });
				} else {
					return res.status(200).json(_body)
				}
			} catch (error) {
				console.log(error)
				return res.status(500).json({ routerStatus: 'Failure', log: error })
			}

		}
	})
	const form = data_kit_req.form();
	form.append('dataFile', req.body.file.buffer, {
		filename: req.body.file.originalname,
		contentType: req.body.file.mimetype
	});

});

/**
 * @param req.query.datasetName - The name of the dataset
 * @param req.query.separator - The separator of the dataset (default ',')
 */
router.post('/importDataset', function (req, res, next) {

	if (!req.query.datasetName) {
		return res.status(400).json({ routerStatus: 'error', log: 'You should provide datasetName' })
	}

	const datasetName = req.query.datasetName;
	const separator = req.query.separator || ',';

	const data_kit_req = request({
		url: `${DATA_RESTIFICATION_KIT_URL}/api/importDataset?datasetName=${datasetName}&separator=${separator}`,
		method: 'POST',
	}, (error, response, body) => {
		if (error) {
			console.log(error);
			return res.status(500).json({ routerStatus: 'Failure', log: error });
		} else {
			try {
				const _body = JSON.parse(body);
				if (!String(response.statusCode).startsWith('2')) {
					console.log(_body);
					return res.status(500).json({ routerStatus: 'Failure', log: _body.error });
				} else {
					return res.status(200).json(_body)
				}
			} catch (error) {
				console.log(error)
				return res.status(500).json({ routerStatus: 'Failure', log: error })
			}
		}
	})
	const form = data_kit_req.form();
	form.append('dataFile', req.body.file.buffer, {
		filename: req.body.file.originalname,
		contentType: req.body.file.mimetype
	});

});

module.exports = router;

