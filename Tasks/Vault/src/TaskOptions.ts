import task = require('azure-pipelines-task-lib/task');
import { injectable } from "inversify";

/**
 * Strong-type accessor for Task configuration
 */
@injectable()
export class TaskOptions {

    // Basic
    readonly command : string | undefined;
    readonly cwd : string | undefined;
    readonly scriptLocation : string | undefined;
    readonly scriptPath : string | undefined;
    readonly script : string | undefined;
    readonly tempDir : string | undefined;
}