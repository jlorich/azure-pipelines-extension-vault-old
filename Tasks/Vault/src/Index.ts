import "reflect-metadata";
import { Container } from "inversify";
import { TaskResult } from "azure-pipelines-task-lib/task";
import task = require('azure-pipelines-task-lib/task');

import { VaultTask } from './VaultTask';
import { VaultCommandRunner } from "./VaultCommandRunner";
import { TaskOptions } from './TaskOptions';
import { VaultAuthenticationProvider } from './AuthenticationProvider/VaultAuthenticationProvider'
import { TokenAuthenticationProvider } from './AuthenticationProvider/TokenAuthenticationProvider'


let container = new Container();
let options = new TaskOptions();

container.bind(VaultTask).toSelf()
container.bind(TaskOptions).toSelf()
container.bind(VaultCommandRunner).toSelf();
container.bind(VaultAuthenticationProvider).to(TokenAuthenticationProvider)

var vaultTask = container.get<VaultTask>(VaultTask);

vaultTask.run().then(function() 
{
    task.setResult(TaskResult.Succeeded, "Vault successfully ran");
}, function() {
    task.setResult(TaskResult.Failed, "Vault failed to run");
});
