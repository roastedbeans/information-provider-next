import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secure-secret';

export const generateTIN = (prefix: string) => {
	const date = new Date();

	const timestamp = date
		.toISOString()
		.replace(/[-:.TZ]/g, '')
		.slice(0, 14); // YYYYMMDDHHMMSS

	return prefix + timestamp;
};

/**
 * Simulate a JWT Token Manipulation Attack
 */
const jwtTokenManipulationAttack = async (url: string) => {
	try {
		// Generate a fake JWT token
		const fakePayload = {
			iss: 'certification-authority',
			aud: 'fake-client-id',
			jti: 'fake-jti',
			exp: 9999999999, // Far future expiry
			scope: 'ca',
		};

		// Use a weak secret to sign the token
		const fakeToken = jwt.sign(fakePayload, 'weak-secret');

		// Use the fake token in a request
		const headers = {
			Authorization: `Bearer ${fakeToken}`,
			'x-api-tran-id': generateTIN('IA102'),
		};

		const body = {
			sign_tx_id: 'ORG2025001_CA20250001_20250117120000_RITFHJGITORP',
			user_ci: '1234567890123456789012345678901234567890123456789012345678901234',
			real_name: 'John Doe',
			phone_num: '+821012345678',
			request_title: 'Request for personal information',
			device_code: 'PC',
			device_browser: 'WB',
			return_app_scheme_url: 'mydata://auth',
			consent_type: '0',
			consent_cnt: 1,
			consent_list: [
				{
					tx_id: 'MD1234567890_0987654321_1234567890_20250117120000_E349RU3IDKFJ',
					consent_title: 'Consent to share personal information',
					consent: '958675948576879',
					consent_len: 15,
				},
			],
		};

		const response = await fetch(url, {
			method: 'POST',
			headers: headers,
			body: JSON.stringify(body),
		});

		console.log('JWT Token Manipulation Attack:');
		console.log(`Status Code: ${response.status}`);
		console.log(`Response: ${await response.text()}\n`);
	} catch (error) {
		console.error('Error during JWT Token Manipulation Attack:', error);
	}
};

/**
 * Simulate a SQL Injection Attack
 */
const sqlInjectionAttack = async (url: string) => {
	try {
		const payloads = [
			"' OR '1'='1",
			"' OR 'a'='a",
			"' OR 1=1 --",
			"' OR 'a'='a' --",
			"' UNION SELECT null, null, null --",
		];

		for (const payload of payloads) {
			const headers = {
				Authorization: 'Bearer valid-token', // Replace with a valid token
				'x-api-tran-id': generateTIN('IA102'),
			};

			const body = {
				sign_tx_id: payload, // Inject payload into sign_tx_id
				user_ci: '1234567890123456789012345678901234567890123456789012345678901234',
				real_name: 'John Doe',
				phone_num: '+821012345678',
				request_title: 'Request for personal information',
				device_code: 'PC',
				device_browser: 'WB',
				return_app_scheme_url: 'mydata://auth',
				consent_type: '0',
				consent_cnt: 1,
				consent_list: [
					{
						tx_id: 'MD1234567890_0987654321_1234567890_20250117120000_E349RU3IDKFJ',
						consent_title: 'Consent to share personal information',
						consent: '958675948576879',
						consent_len: 15,
					},
				],
			};

			const response = await fetch(url, {
				method: 'POST',
				headers: headers,
				body: JSON.stringify(body),
			});

			console.log(`SQL Injection Payload: ${payload}`);
			console.log(`Status Code: ${response.status}`);
			console.log(`Response: ${await response.text()}\n`);
		}
	} catch (error) {
		console.error('Error during SQL Injection Attack:', error);
	}
};

/**
 * Simulate a Brute Force Attack
 */
const bruteForceAttack = async (url: string) => {
	try {
		const clientId = 'valid-client-id'; // Replace with a valid client_id
		const clientSecretList = ['secret1', 'secret2', 'secret3', 'password', '123456']; // Common passwords

		for (const secret of clientSecretList) {
			const headers = {
				'Content-Type': 'application/x-www-form-urlencoded',
				'x-api-tran-id': generateTIN('IA101'),
			};

			const body = new URLSearchParams({
				grant_type: 'client_credential',
				client_id: clientId,
				client_secret: secret,
				scope: 'ca',
			});

			const response = await fetch(url, {
				method: 'POST',
				headers: headers,
				body: body,
			});

			console.log(`Brute Force Attempt: client_secret = ${secret}`);
			console.log(`Status Code: ${response.status}`);
			console.log(`Response: ${await response.text()}\n`);
		}
	} catch (error) {
		console.error('Error during Brute Force Attack:', error);
	}
};

/**
 * Simulate a Denial of Service (DoS) Attack
 */
const dosAttack = async (url: string, numRequests: number = 100) => {
	try {
		for (let i = 0; i < numRequests; i++) {
			const headers = {
				Authorization: 'Bearer valid-token', // Replace with a valid token
				'x-api-tran-id': generateTIN('IA102'),
			};

			const body = {
				sign_tx_id: 'ORG2025001_CA20250001_20250117120000_RITFHJGITORP',
				user_ci: '1234567890123456789012345678901234567890123456789012345678901234',
				real_name: 'John Doe',
				phone_num: '+821012345678',
				request_title: 'Request for personal information',
				device_code: 'PC',
				device_browser: 'WB',
				return_app_scheme_url: 'mydata://auth',
				consent_type: '0',
				consent_cnt: 1,
				consent_list: [
					{
						tx_id: 'MD1234567890_0987654321_1234567890_20250117120000_E349RU3IDKFJ',
						consent_title: 'Consent to share personal information',
						consent: '958675948576879',
						consent_len: 15,
					},
				],
			};

			const response = await fetch(url, {
				method: 'POST',
				headers: headers,
				body: JSON.stringify(body),
			});

			console.log(`DoS Request ${i + 1}:`);
			console.log(`Status Code: ${response.status}`);
			console.log(`Response: ${await response.text()}\n`);
		}
	} catch (error) {
		console.error('Error during DoS Attack:', error);
	}
};

/**
 * Simulate Invalid Parameter Injection
 */
const invalidParameterAttack = async (url: string) => {
	try {
		const headers = {
			Authorization: 'Bearer valid-token', // Replace with a valid token
			'x-api-tran-id': generateTIN('IA102'),
		};

		// Test invalid sign_tx_id
		const invalidSignTxIdBody = {
			sign_tx_id: 'invalid_tx_id', // Invalid sign_tx_id
			user_ci: '1234567890123456789012345678901234567890123456789012345678901234',
			real_name: 'John Doe',
			phone_num: '+821012345678',
			request_title: 'Request for personal information',
			device_code: 'PC',
			device_browser: 'WB',
			return_app_scheme_url: 'mydata://auth',
			consent_type: '0',
			consent_cnt: 1,
			consent_list: [
				{
					tx_id: 'MD1234567890_0987654321_1234567890_20250117120000_E349RU3IDKFJ',
					consent_title: 'Consent to share personal information',
					consent: '958675948576879',
					consent_len: 15,
				},
			],
		};

		const response1 = await fetch(url, {
			method: 'POST',
			headers: headers,
			body: JSON.stringify(invalidSignTxIdBody),
		});

		console.log('Invalid Parameter Attack (sign_tx_id):');
		console.log(`Status Code: ${response1.status}`);
		console.log(`Response: ${await response1.text()}\n`);

		// Test missing consent_list
		const missingConsentListBody = {
			sign_tx_id: 'ORG2025001_CA20250001_20250117120000_RITFHJGITORP',
			user_ci: '1234567890123456789012345678901234567890123456789012345678901234',
			real_name: 'John Doe',
			phone_num: '+821012345678',
			request_title: 'Request for personal information',
			device_code: 'PC',
			device_browser: 'WB',
			return_app_scheme_url: 'mydata://auth',
			consent_type: '0',
			consent_cnt: 1,
			// Missing consent_list
		};

		const response2 = await fetch(url, {
			method: 'POST',
			headers: headers,
			body: JSON.stringify(missingConsentListBody),
		});

		console.log('Invalid Parameter Attack (missing consent_list):');
		console.log(`Status Code: ${response2.status}`);
		console.log(`Response: ${await response2.text()}\n`);
	} catch (error) {
		console.error('Error during Invalid Parameter Attack:', error);
	}
};

/**
 * Main function to run all attack simulations
 */
const runAttackSimulations = async () => {
	const tokenUrl = 'http://localhost:3000/api/oauth/2.0/token';
	const signRequestUrl = 'http://localhost:3000/api/ca/sign_request';
	const signResultUrl = 'http://localhost:3000/api/ca/sign_result';

	console.log('Starting Attack Simulations...\n');

	// JWT Token Manipulation Attack
	await jwtTokenManipulationAttack(signRequestUrl);

	// SQL Injection Attack
	await sqlInjectionAttack(signRequestUrl);

	// Brute Force Attack
	await bruteForceAttack(tokenUrl);

	// Denial of Service (DoS) Attack
	await dosAttack(signRequestUrl, 50); // 50 requests for simulation

	// Invalid Parameter Attack
	await invalidParameterAttack(signRequestUrl);

	console.log('All Attack Simulations Completed.');
};

// Run the attack simulations
runAttackSimulations()
	.catch((e) => {
		console.error('Error during attack simulations:', e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
