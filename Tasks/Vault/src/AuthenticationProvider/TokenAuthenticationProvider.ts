import { injectable } from "inversify";
import { VaultAuthenticationProvider } from "./VaultAuthenticationProvider";
import { TokenAuthenticationOptions } from "./TokenAuthenticationOptions";

/**
 * Token authentication provider for Vault
 */
@injectable()
export class TokenAuthenticationProvider extends VaultAuthenticationProvider {

    constructor(private options : TokenAuthenticationOptions) {
        super();
    }

    /**
     * Loads the ARM connected service information into the environment
     */
    public async authenticate() : Promise<{ [key: string]: string; }> {
        return {
            VAULT_SKIP_VERIFY: String(this.options.tlsVerify == "false"),
            VAULT_ADDR: this.options.url,
            VAULT_TOKEN: this.options.token
        };
    }
}
