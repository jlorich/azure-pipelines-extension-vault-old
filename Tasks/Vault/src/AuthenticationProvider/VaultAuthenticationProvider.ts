import { injectable } from "inversify";

/**
 * An authentication provider for Vault
 */
@injectable()
export abstract class VaultAuthenticationProvider {
    /**
     * Configures the file system and process environment variables necessary to run Vault
     * in an authenticated manner.
     * 
     * @returns Variables to set for auth in the spawned process env
     */
    abstract authenticate() : Promise<{ [key: string]: string; }>;
}