import path = require("path");
import fs = require("fs");
import os = require("os");
import task = require('azure-pipelines-task-lib/task');

import { injectable } from "inversify";
import { VaultClient } from "./VaultClient";
import { TaskOptions } from './TaskOptions';

@injectable()
export class VaultTask {

    constructor(
        private vault : VaultClient,
        private options: TaskOptions)
    {
        
    }

    public async run() {
        await this.vault.initialize();

        switch(this.options.command) {
            case 'kvGet':
                let kvGetResponse = await this.vault.keyValue.get(this.options.key);
                this.setResultVariables(kvGetResponse.data.data);
                
                break;

            case 'kvPut':
                let data = JSON.parse(this.options.data);
                await this.vault.keyValue.put(this.options.key, data)
                
                break;
            default:
                throw new Error("Invalid command");
        }
    }

    /**
     * Sets all key/value pairs in data as environment variables
     * 
     * Note: all / values will be replaced with underscores
     * 
     * @param data The data to set
     * @param prefix A prefix string to invlude on all environment variable names
     */
    private setResultVariables(data: { [key: string]: string; }, prefix = "") {
        // Strip trailing slash
        prefix = prefix.replace(/\/+$/, "");

        if (prefix != "") {
            prefix = prefix + "_";
        }

        for(let key in data) {
            let value = data[key];
            let safekey = key.replace("/", "_");
            task.setVariable(prefix + safekey, value, true);
        }
    }
}