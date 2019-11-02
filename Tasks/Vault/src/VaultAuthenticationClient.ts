import { RestClient } from 'typed-rest-client/RestClient'
import { TaskOptions } from './TaskOptions'
const url = require('url');

export class VaultAuthenticationClient extends RestClient {
    constructor(private taskOptions : TaskOptions) {
       super("azure-pipelines-vault-extension", url.resolve(taskOptions.baseUrl, "v1"));
    }
}

