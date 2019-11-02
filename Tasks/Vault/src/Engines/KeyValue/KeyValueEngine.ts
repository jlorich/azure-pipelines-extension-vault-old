const url = require("url");
import { RestClient } from "typed-rest-client/RestClient"
import { KeyValueGetResponse } from "./KeyValueGetResponse"
import { KeyValuePutRequest } from "./KeyValuePutRequest"
import { KeyValuePutResponse } from "./KeyValuePutResponse"

/**
 * A Key-value engine API Accessor
 */
export class KeyValueEngine {
    constructor(private client : RestClient) {

    }

    public async get(path : string) : Promise<KeyValueGetResponse> {
        let response = await this.client.get<KeyValueGetResponse>(path);

        if (response.statusCode >= 400 || !response.result) {
            throw new Error(`KeyValue Get Error ${response.statusCode} - ${response.result}`)
        }

        return response.result;
    }

    public async put(
        path : string,
        data: { [key: string]: string; },
        cas : Number | undefined = undefined
    ) : Promise<KeyValuePutResponse> {
        let request = new KeyValuePutRequest(data, cas);
        let response = await this.client.create<KeyValuePutResponse>(path, request);

        if (response.statusCode >= 400 || !response.result) {
            throw new Error(`KeyValue Put Error ${response.statusCode} - ${response.result}`)
        }

        return response.result;
    }
}