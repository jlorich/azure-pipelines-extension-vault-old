import { injectable } from "inversify";
import { endpointAuthorizationScheme, endpointAuthorizationParameter, endpointUrl } from "../Options";

@injectable()
export class TokenAuthenticationOptions {
    @endpointUrl("vaultConnectedServiceName")
    public url : string = "";

    @endpointAuthorizationParameter("vaultConnectedServiceName", "apitoken")
    public token : string = ""; 

    @endpointAuthorizationParameter("vaultConnectedServiceName", "username")
    public username : string = ""; 

    @endpointAuthorizationParameter("vaultConnectedServiceName", "password")
    public password : string = ""; 
}