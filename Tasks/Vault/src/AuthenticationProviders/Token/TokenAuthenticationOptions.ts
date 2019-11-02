import { injectable } from "inversify";
import {
    endpointAuthorizationParameter,
} from "../../Options";

@injectable()
export class TokenAuthenticationOptions {
    @endpointAuthorizationParameter("vaultConnectedServiceName", "apitoken")
    public token : string = ""; 
}