import {
	IExecuteFunctions,
} from 'n8n-core';

import {
	IDataObject,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

import {
	OptionsWithUri,
} from 'request';

export class BitCapitalRequest implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'BitCapitalRequest',
		name: 'bitCapitalRequest',
		icon: 'file:bitcapital.svg',
		group: ['transform'],
		version: 1,
		description: 'Does a Generic Request in Bit Capital API',
		defaults: {
			name: 'BitCapital Request',
			color: '#1A82e2',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'bitCapitalApi',
				required: true,
			},
		],
		properties: [
			{
				name: 'accessToken',
				type: 'string',
				required: true,
				displayName: 'Access Token',
				description: 'The Access Token of the current session',
				default: '',
			},
			{
				name: 'path',
				type: 'string',
				required: false,
				displayName: 'Path',
				description: 'The path of the endpoint',
				default: '/status',
			},
			{
				name: 'body',
				type: 'string',
				required: false,
				displayName: 'Body',
				description: 'The Body of the request to be sent',
				default: '',
			},
			{
				name: 'method',
				type: 'options',
				required: false,
				options: [
					{ name: 'GET', value: 'GET'},
					{ name: 'POST', value: 'POST'},
					{ name: 'PUT', value: 'PUT'},
					{ name: 'HEAD', value: 'HEAD'},
					{ name: 'DELETE', value: 'DELETE'},
				],
				displayName: 'Method',
				description: 'The HTTP request method to be used',
				default: '',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
			let responseData;
			const credentials = this.getCredentials('bitCapitalApi') as IDataObject;
			const body = this.getNodeParameter('body', 0)?.toString() || undefined;
			const method = this.getNodeParameter('method', 0)?.toString() || 'GET';
			const path = this.getNodeParameter('path', 0)?.toString() || '/';

			if (!credentials.clientSecret) {
				throw new Error('No Client Secret for request signing...');
			}

			const headers = RequestUtil.sign(credentials.clientSecret.toString(), {
				method, body,
				url: path,
			});
			const options: OptionsWithUri = {
				headers: {
					'Accept': 'application/json',
					'Authorization': `Bearer ${this.getNodeParameter('accessToken', 0)}`,
					'Content-Type': 'application/json',
					...headers,
				},
				method, body,
				uri: `${credentials.baseURL}${path}`,
			};

			responseData = await this.helpers.request(options);
			return [this.helpers.returnJsonArray(responseData)];
			
	}
}


import * as CryptoJS from 'crypto-js';

export interface RequestSigningHeaders {
	'X-Request-Signature': string;
	'X-Request-Timestamp': string;
}

export interface RequestSigningOptions {
	method: string;
	url: string;
	body?: string;
	timestamp?: string;
}

export class RequestUtil {
	static sign(secret: string, req: RequestSigningOptions): RequestSigningHeaders {
		const now = req.timestamp ? req.timestamp : Date.now();
		const payload = [req.method, req.url, now];

		// Check if should sign body as well
		if (req.body && (req.method.toUpperCase() === 'POST' || req.method.toUpperCase() === 'PUT')) {
			payload.push(req.body);
		}

		// Generate signature using HMAC SHA 256
		const signature = CryptoJS.HmacSHA256(payload.join(','), secret);

		return {
			'X-Request-Signature': signature.toString(),
			'X-Request-Timestamp': now.toString(),
		};
	}
}