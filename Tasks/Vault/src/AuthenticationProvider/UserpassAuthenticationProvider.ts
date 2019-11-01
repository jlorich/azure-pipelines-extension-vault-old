import { injectable } from "inversify";
import { VaultAuthenticationProvider } from "./VaultAuthenticationProvider";
import { UserpassAuthenticationOptions } from "./UserpassAuthenticationOptions";

/**
 * Token authentication provider for Vault
 */
@injectable()
export class UserpassAuthenticationProvider extends VaultAuthenticationProvider {

    constructor(private options : UserpassAuthenticationOptions) {
        super();
    }

    /**
     * Loads the ARM connected service information into the environment
     */
    public async authenticate() : Promise<{ [key: string]: string; }> {
        // if (!this.options.providerAzureConnectedServiceName) {
        //     throw new Error("No Azure connection specified")
        // }

        return {
            VAULT_TOKEN: ""
        };
    }
}
