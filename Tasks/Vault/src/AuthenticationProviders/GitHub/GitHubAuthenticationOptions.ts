import { injectable } from "inversify";
import { 
    endpointAuthorizationParameter
} from "../../Options";

/**
 * Task options specificed for a Github authenticated Vault endpoint
 */
@injectable()
export class GitHubAuthenticationOptions {
    @endpointAuthorizationParameter("vaultConnectedServiceName", "apitoken")
    public personalAccessToken : string = ""; 
}