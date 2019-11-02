import "reflect-metadata";
import { Container } from "inversify";
import { TaskResult } from "azure-pipelines-task-lib/task";
import task = require('azure-pipelines-task-lib/task');

import { VaultTask } from './VaultTask';
import { VaultCommandRunner } from "./VaultCommandRunner";
import { Options } from './Options'

import { TaskOptions } from './TaskOptions';
import { VaultAuthenticationProvider } from './AuthenticationProvider/VaultAuthenticationProvider'
import { TokenAuthenticationProvider } from './AuthenticationProvider/Token/TokenAuthenticationProvider'
import { TokenAuthenticationOptions } from './AuthenticationProvider/TokenAuthenticationOptions'
import { UserpassAuthenticationProvider } from './AuthenticationProvider/Userpass/UserpassAuthenticationProvider'
import { UserpassAuthenticationOptions } from './AuthenticationProvider/Userpass/UserpassAuthenticationOptions'


let container = new Container();

// Bind Vault task classes for DI
container.bind(VaultTask).toSelf()
container.bind(VaultCommandRunner).toSelf();
container.bind<TaskOptions>(TaskOptions).toDynamicValue((context) => {
    return Options.load(TaskOptions); 
});

let options = container.get(TaskOptions);

// Bind appropriate auth and auth options providers
switch (options.authMethod) {
    case "endpoint-auth-scheme-token":
        container.bind(VaultAuthenticationProvider).to(TokenAuthenticationProvider);
        container.bind<TokenAuthenticationOptions>(TokenAuthenticationOptions).toDynamicValue((context) => {
            return Options.load(TokenAuthenticationOptions); 
        });

        break;
    case "endpoint-auth-scheme-userpass":
        container.bind(VaultAuthenticationProvider).to(UserpassAuthenticationProvider);
        container.bind<UserpassAuthenticationOptions>(UserpassAuthenticationOptions).toDynamicValue((context) => {
            return Options.load(UserpassAuthenticationOptions); 
        });

        break;
    default:
        break;
}

// Get and run the Vault task
var vaultTask = container.get<VaultTask>(VaultTask);

vaultTask.run().then(function() 
{
    task.setResult(TaskResult.Succeeded, "Vault successfully ran");
}, function(reason) {
    task.setResult(TaskResult.Failed, "Vault failed to run");
});
