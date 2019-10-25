import task = require('azure-pipelines-task-lib/task');
import { injectable } from "inversify";

/**
 * Strong-type accessor for Task configuration
 */
@injectable()
export class TaskOptions {

    // Basic
    readonly command : string | undefined;
    readonly provider : string | undefined;
    readonly backend : string | undefined;

    // Azure
    readonly providerAzureConnectedServiceName : string | undefined;
    readonly backendAzureUseProviderConnectedServiceForBackend : boolean | undefined;
    readonly backendAzureConnectedServiceName : string | undefined;
    readonly backendAzureStorageAccountName : string | undefined;
    readonly backendAzureProviderStorageAccountName : string | undefined;
    readonly backendAzureContainerName : string | undefined;
    readonly backendAzureStateFileKey : string | undefined;

    // CLI
    readonly scriptLocation : string | undefined;
    readonly scriptPath : string | undefined;
    readonly script : string | undefined;
    readonly initialize : boolean | undefined;

    // Advanced
    readonly cwd : string | undefined;
    readonly args : string | undefined;
    readonly tempDir : string | undefined;
}