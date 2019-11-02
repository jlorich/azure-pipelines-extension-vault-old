import { injectable } from "inversify";
import { 
    endpointAuthorizationParameter,
} from "../../Options";

@injectable()
export class UserpassAuthenticationOptions {
    @endpointAuthorizationParameter("vaultConnectedServiceName", "username")
    public username : string = ""; 

    @endpointAuthorizationParameter("vaultConnectedServiceName", "password")
    public password : string = ""; 
}