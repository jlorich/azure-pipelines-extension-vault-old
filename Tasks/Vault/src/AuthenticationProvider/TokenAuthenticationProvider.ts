import { injectable } from "inversify";
import task = require('azure-pipelines-task-lib/task');
import { VaultAuthenticationProvider } from "./VaultAuthenticationProvider";
import { TaskOptions } from "../TaskOptions";

/**
 * Token authentication provider for Vault
 */
@injectable()
export class TokenAuthenticationProvider extends VaultAuthenticationProvider {

    constructor(private options : TaskOptions) {
        super();
    }

    /**
     * Loads the ARM connected service information into the environment
     */
    public async authenticate() : Promise<{ [key: string]: string; }> {
        if (!this.options.providerAzureConnectedServiceName) {
            throw new Error("No Azure connection specified")
        }

        return {
            VAULT_TOKEN: ""
        };
    }
}
