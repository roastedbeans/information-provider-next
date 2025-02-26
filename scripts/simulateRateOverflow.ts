import { faker } from '@faker-js/faker';
// Initialize Prisma and constants

const otherBankAPI = 'http://localhost:4200';
const otherOrgCode = 'bond123456';
const orgCode = 'anya123456';
const caCode = 'certauth00';
const orgSerialCode = 'anyaserial00';
const clientId = 'wcf8rjy6kphudsnea0l3ytkpdhqrvcxz1578m4q7xv9zb2tgca';
const clientSecret = 'a0l3ytkpdhqrvcfz926btm4q7xv9zb2tgc8rjy6kphudsnew5o';

class APIError extends Error {
	statusCode: number;
	errorCode: string;
	originalError: any;

	constructor(message: string, statusCode: number, errorCode: string, originalError?: any) {
		super(message);
		this.name = 'APIError';
		this.statusCode = statusCode;
		this.errorCode = errorCode;
		this.originalError = originalError;
	}
}

// Logger utility
const logger = {
	error: (message: string, error?: any) => {
		console.error(`[ERROR] ${message}`, error);
	},
	warn: (message: string) => {
		console.warn(`[WARN] ${message}`);
	},
	info: (message: string) => {
		console.info(`[INFO] ${message}`);
	},
};

// Generate transaction ID with error handling
export const generateTIN = (subject: string): string => {
	//subject classification code
	try {
		// grant code 10 uppercase letters + numbers
		const grantCode = faker.string.alphanumeric(14).toUpperCase();
		const xApiTranId = `${orgCode}${subject}${grantCode}`;

		return xApiTranId;
	} catch (error) {
		return '00000000000000';
	}
};

// Utility function for API calls
async function makeAPICall<T>(url: string, options: RequestInit, errorPrefix: string): Promise<T> {
	try {
		const response = await fetch(url, options);

		if (!response.ok) {
			throw new APIError(`${errorPrefix} failed`, response.status, response.statusText, await response.text());
		}

		return await response.json();
	} catch (error) {
		if (error instanceof APIError) {
			throw error;
		}
		throw new APIError(`${errorPrefix} failed`, 500, 'INTERNAL_ERROR', error);
	}
}

export const getIA101 = async () => {
	try {
		const options = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'x-api-tran-id': generateTIN('S'),
				'X-CSRF-Token': '',
				Cookie: '',
				'Set-Cookie': '',

				'attack-type': 'Rate Overflow',
			},
			body: new URLSearchParams({
				grant_type: 'client_credentials',
				client_id: clientId,
				client_secret: clientSecret,
				scope: 'ca',
			}),
		};

		logger.info('Requesting token');
		return await makeAPICall('http://localhost:3000/api/oauth/2.0/token', options, 'Token request');
	} catch (error) {
		logger.error('Error in getIA101', error);
		throw error;
	}
};

// Generate rate overflow attack with excessive requests
export const simulateRateOverflow = async () => {
	const requests = Array.from({ length: 1000 }, () => getIA101());
	await Promise.all(requests);
};

simulateRateOverflow();
