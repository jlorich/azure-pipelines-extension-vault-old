import os = require("os");
import task = require('azure-pipelines-task-lib/task');
import fs = require("fs");
import path = require("path");
import { injectable } from "inversify";
import { ToolRunner, IExecOptions, IExecSyncResult } from "azure-pipelines-task-lib/toolrunner";
import { TaskOptions } from "./TaskOptions";
import { VaultAuthenticationProvider } from "./AuthenticationProvider/VaultAuthenticationProvider";

@injectable()
export class VaultCommandRunner {
    private readonly vault : ToolRunner;

    public constructor(
        private authenticationProvider : VaultAuthenticationProvider,
        private options: TaskOptions
        
    ) {
        this.vault = this.createVaultToolRunner();
    }

   /**
     * Executes a script within an authenticated Vault environment
     * @param script The location of the script to run
     */
    public async exec(args: Array<string> = [], authenticate: boolean = true) {
        console.log("Executing vault command");

        if (!this.options.command) {
            throw new Error("No command specified");
        }

        // Handle authentication for this command
        let authenticationEnv : { [key: string]: string; } = {};

        if (authenticate) {
           authenticationEnv = await this.authenticationProvider.authenticate();
        }

        let command = this.vault;

        for (let arg of args) {
            command.arg(arg);
        }

        // if (this.options.args) {
        //     command.line(this.options.args);
        // }

        let result = await command.exec({
            cwd: path.join(process.cwd(), this.options.cwd || ""),
            env: {
                ...process.env,
                ...authenticationEnv
            },
            windowsVerbatimArguments: true
        } as unknown as IExecOptions);

        if (result > 0) {
            throw new Error("Vault initalize failed");
        }
    }

    /**
     * Executes a script within an authenticated Vault environment
     * @param script The location of the script to run
     */
    public async cli(script: string) {
        // Handle authentication for this command
        let authenticationEnv = await this.authenticationProvider.authenticate();

        let content = fs.readFileSync(script,'utf8');

        console.log(content);
        
        let tool = this.createCliToolRunner(script);

        let result = await tool.exec({
            cwd: this.options.cwd,
            env: {
                ...process.env,
                ...authenticationEnv
            },
            windowsVerbatimArguments: true
        } as unknown as IExecOptions);

        if (result > 0) {
            throw new Error("Vault CLI failed");
        }
    }

    /**
     * Creates an Azure Pipelines ToolRunner for Vault
     */
    private createVaultToolRunner() : ToolRunner {
        let vaultPath = task.which("vault", true);
        let vault: ToolRunner = task.tool(vaultPath);

        return vault;
    }

    /**
     * Creates an Azure Pipelines ToolRunner for Bash or CMD
     */
    private createCliToolRunner(scriptPath : string) : ToolRunner {
        var tool;

        if (os.type() != "Windows_NT") {
            tool = task.tool(task.which("bash", true));
            tool.arg(scriptPath);
        } else {
            tool = task.tool(task.which(scriptPath, true));
        }

        return tool;
    }
}
