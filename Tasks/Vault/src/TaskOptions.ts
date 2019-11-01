import task = require('azure-pipelines-task-lib/task');
import { injectable } from "inversify";
import { endpointAuthorizationScheme, taskVariable } from "./Options"
/**
 * Strong-type accessor for Task configuration
 */
@injectable()
export class TaskOptions {

    // Basic
    readonly command : string = "";
    readonly cwd : string = "";
    readonly scriptLocation : string = "";
    readonly scriptPath : string = "";
    readonly script : string = "";

    @endpointAuthorizationScheme("vaultConnectedServiceName")
    public authMethod : string = "";

    @taskVariable("Agent.TempDirectory")
    readonly tempDir : string | undefined;
}