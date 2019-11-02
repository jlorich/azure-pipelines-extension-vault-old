import task = require('azure-pipelines-task-lib/task');
import { injectable } from "inversify";
import {
    endpointAuthorizationScheme,
    endpointDataParameter,
    taskVariable,
    endpointUrl
} from "./Options"

/**
 * Strong-type accessor for Task configuration
 */
@injectable()
export class TaskOptions {

    // Basic
    readonly command : string = "";
    readonly path : string = "";
    readonly key : string = "";
    readonly data : string = "";
    readonly prefix : string = "";
    
    @endpointUrl("vaultConnectedServiceName")
    public baseUrl : string = "";

    @endpointAuthorizationScheme("vaultConnectedServiceName")
    public authMethod : string = "";

    @endpointDataParameter("vaultConnectedServiceName", "vaultTLSVerify")
    public tlsVerify : string = ""; 

    @taskVariable("Agent.TempDirectory")
    readonly tempDir : string | undefined;
}