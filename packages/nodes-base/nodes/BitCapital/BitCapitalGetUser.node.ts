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

export class BitCapitalGetUser implements INodeType {
	description: INodeTypeDescription = {
			displayName: 'BitCapitalGetUser',
			name: 'bitCapitalGetUser',
			icon: 'file:bitcapital.svg',
			group: ['transform'],
			version: 1,
			description: 'Retrieves a user information using the BitCapital API',
			defaults: {
					name: 'BitCapital Get User',
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
						name: 'userId',
						type: 'string',
						required: true,
						displayName: 'User ID',
						description: 'The UUID of the user to get the informations from',
            default: '',
				},
			],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
			let responseData;
			const credentials = this.getCredentials('bitCapitalApi') as IDataObject;

			const options: OptionsWithUri = {
				headers: {
					'Accept': 'application/json',
					'Authorization': `Bearer ${this.getNodeParameter('accessToken', 0)}`,
				},
				method: 'GET',
				json: true,
				uri: `${credentials.baseURL}/users/${this.getNodeParameter('userId', 0)}`,
			};

			responseData = await this.helpers.request(options);
			return [this.helpers.returnJsonArray(responseData)];
			
	}
}
