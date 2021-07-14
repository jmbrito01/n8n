import {
	ICredentialType,
	NodePropertyTypes,
} from 'n8n-workflow';

export class BitCapitalApi implements ICredentialType {
	name = 'bitCapitalApi';
	displayName = 'Bit Capital API';
	documentationUrl = 'bitCapitalApi';
	properties = [
		{
			displayName: 'API Base URL',
			name: 'baseURL',
			type: 'string' as NodePropertyTypes,
			default: '',
		},
		{
			displayName: 'Client ID',
			name: 'clientId',
			type: 'string' as NodePropertyTypes,
			default: 'root',
		},
		{
			displayName: 'Client Secret',
			name: 'clientSecret',
			type: 'string' as NodePropertyTypes,
			typeOptions: {
				password: true,
			},
			default: '',
		},
	];
}