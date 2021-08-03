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

export class BitCapitalAuthenticate implements INodeType {
	description: INodeTypeDescription = {
			displayName: 'BitCapital Authenticate',
			name: 'bitCapitalAuthenticate',
			icon: 'file:bitcapital.svg',
			group: ['bitcapital'],
			version: 1,
			description: 'Authenticate in BitCapital API',
			defaults: {
					name: 'BitCapitalAuthenticate',
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
					// Node properties which the user gets displayed and
					// can change on the node.
			],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
			let responseData;
			const credentials = this.getCredentials('bitCapitalApi') as IDataObject;

			const options: OptionsWithUri = {
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/x-www-form-urlencoded',
					'Authorization': `Basic ${Buffer.from(credentials.clientId + ':' + credentials.clientSecret).toString('base64')}`,
				},
				method: 'POST',
				form: {
					grant_type: 'client_credentials',
				},
				json: true,
				uri: `${credentials.baseURL}/oauth/token`,
			};


			responseData = await this.helpers.request(options);
			return [this.helpers.returnJsonArray(responseData)];
			
	}
}
