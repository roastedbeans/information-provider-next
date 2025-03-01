import { createObjectCsvWriter as createCsvWriter } from 'csv-writer';
import fs from 'fs';
import path from 'path';

const csvFilePath = path.resolve(`./ip_formatted_logs.csv`);

// Define CSV headers
const csvHeaders = [
	{ id: 'request_url', title: 'request.url' },
	{ id: 'request_method', title: 'request.method' },
	{ id: 'request_authorization', title: 'request.header.authorization' },
	{ id: 'request_user_agent', title: 'request.headers.user-agent' },
	{ id: 'request_api_tran_id', title: 'request.header.x-api-tran-id' },
	{ id: 'request_api_type', title: 'request.header.x-api-type' },
	{ id: 'request_x_csrf_token', title: 'request.header.x-csrf-token' },
	{ id: 'request_cookie', title: 'request.headers.cookie' },
	{ id: 'request_set_cookie', title: 'request.headers.set_cookie' },
	{ id: 'request_content_length', title: 'request.headers.content-length' },
	{ id: 'request_body', title: 'request.body' },
	{ id: 'response_body', title: 'response.body' },
	{ id: 'response_status', title: 'response.status' },
	{ id: 'attack_type', title: 'attack.type' },
];

// Initialize CSV file with headers if it doesn't exist
export const initializeCsv = async () => {
	if (!fs.existsSync(csvFilePath)) {
		const csvWriter = createCsvWriter({
			path: csvFilePath,
			header: csvHeaders,
		});
		await csvWriter.writeRecords([]); // Write empty records to create the file with headers
	}
};

// Append a new request to the CSV file
export const logger = async (
	request: string,
	requestBody: string,
	responseBody: string,
	responseStatusCode: string
) => {
	await initializeCsv(); // Ensure the CSV file exists
	const req = JSON.parse(request);

	const csvWriter = createCsvWriter({
		path: csvFilePath,
		header: csvHeaders,
		append: true, // Append to the existing file
	});

	await csvWriter.writeRecords([
		{
			request_url: req?.url || '',
			request_method: req?.method || '',
			request_authorization: req?.headers?.authorization || '',
			request_user_agent: req?.headers?.['user-agent'] || '',
			request_api_tran_id: req?.headers?.['x-api-tran-id'] || '',
			request_api_type: req?.headers?.['x-api-type'] || '',
			request_x_csrf_token: req?.headers?.['x-csrf-token'] || '',
			request_cookie: req?.headers?.cookie || '',
			request_set_cookie: req?.headers?.['set-cookie'] || '',
			request_content_length: req?.headers?.['content-length'] || '',
			request_body: JSON.stringify(requestBody),
			response_body: JSON.stringify(responseBody),
			response_status: responseStatusCode,
			attack_type: req?.headers?.['attack-type'] || '',
		},
	]);

	console.log(request, requestBody, responseBody, responseStatusCode);
};
