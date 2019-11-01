import task = require('azure-pipelines-task-lib/task');
import { interfaces, Container, injectable } from "inversify";
import "reflect-metadata";

const valueMetadataKey = Symbol("devopsTaskMetadataKey");

enum TaskInputType {
    Default = 1,
    TaskVariable,
    EndpointAuthorizationParameter,
    EndpointDataParameter,
    EndpointAuthorizationScheme,
    EndpointUrl
}

/**
 * Metadata to identify properties with the type of data that should be loaded
 */
class OptionMetadata {
    constructor (
        public type: TaskInputType = TaskInputType.Default,
        public id: string = "",
        public key : string = "",
        public required : boolean = false) {

    }
}

/**
 * Marks this property for to be set with the given TaskVariable when the class
 * is insantiated with Options.load
 */
export function taskVariable(id : string, required : boolean = true) :any {
    return function(target : any, propertyKey: string, descriptor: PropertyDescriptor) {
        Reflect.defineMetadata(valueMetadataKey, new OptionMetadata(TaskInputType.TaskVariable, id, "", required), target, propertyKey)
    }
}

/**
 * Marks this property for to be set with the given endpointAuthroizationScheme value for
 * a service connection when the class is insantiated with Options.load
 */
export function endpointAuthorizationScheme(id : string, required = true) :any {
    return function(target : any, propertyKey: string, descriptor: PropertyDescriptor) {
        Reflect.defineMetadata(valueMetadataKey, new OptionMetadata(TaskInputType.EndpointAuthorizationScheme, id, "", required), target, propertyKey)
    }
}

/**
 * Marks this property for to be set with the given endpointAuthorizationParameter value for 
 * a service connection when the class is insantiated with Options.load
 */
export function endpointAuthorizationParameter(id : string, key : string, required : boolean = true) :any {
    return function(target : any, propertyKey: string, descriptor: PropertyDescriptor) {
        Reflect.defineMetadata(valueMetadataKey, new OptionMetadata(TaskInputType.EndpointAuthorizationParameter, id, key, required), target, propertyKey)
    }
}

/**
 * Marks this property for to be set with the given endpointDataParameter value for 
 * a service connection when the class is insantiated with Options.load
 */
export function endpointDataParameter(id : string, key : string, required : boolean = true) :any {
    return function(target : any, propertyKey: string, descriptor: PropertyDescriptor) {
        Reflect.defineMetadata(valueMetadataKey, new OptionMetadata(TaskInputType.EndpointDataParameter, id, key, required), target, propertyKey)
    }
}

/**
 * Marks this property for to be set with the given EndpointUrl value for 
 * a service connection when the class is insantiated with Options.load
 */
export function endpointUrl(id : string, required : boolean = true) :any {
    return function(target : any, propertyKey: string, descriptor: PropertyDescriptor) {
        Reflect.defineMetadata(valueMetadataKey, new OptionMetadata(TaskInputType.EndpointDataParameter, id, "", required), target, propertyKey)
    }
}

/**
 * Strongly-typed options class builder for Azure Pipeline Tasks
 */
@injectable()
export class Options {

    private getProperty<T, K extends keyof T>(o: T, name: K) {
        return o[name];
    }

    private static getTypeofProperty<T, K extends keyof T>(o: T, name: K) {
        return typeof o[name];
    }

    private static setProperty<T, K extends keyof T>(o: T, name: K, value : any) {
        return o[name] = value;
    }

    /**
     * Returns the parsed value of this config
     */
    public static load<T>(type: { new (): T }) : T {
        let options : T = new type();

        for (let propertyKey in options) {
            let metadata = Reflect.getMetadata(valueMetadataKey, options, propertyKey) as OptionMetadata;

            let type = metadata && metadata.type || TaskInputType.Default;
            let value : any;
            let scheme : any;

            switch (type) {
                case TaskInputType.Default:
                    value = this.getInputVariableFromProperty(options, propertyKey)
                    break;
                case TaskInputType.TaskVariable:
                    value = task.getTaskVariable(metadata.id);
                    break;
                case TaskInputType.EndpointAuthorizationScheme:
                    value = task.getEndpointAuthorizationScheme(metadata.id, metadata.required);
                    break;
                case TaskInputType.EndpointAuthorizationParameter:
                    scheme = task.getEndpointAuthorizationScheme(metadata.id, metadata.required);
                    value = task.getEndpointAuthorizationParameter(scheme, metadata.key, metadata.required);
                    break;
                case TaskInputType.EndpointDataParameter:
                    scheme = task.getEndpointAuthorizationScheme(metadata.id, metadata.required);
                    value = task.getEndpointDataParameter(scheme, metadata.key, metadata.required);
                    break;
                case TaskInputType.EndpointUrl:
                    value = task.getEndpointUrl(metadata.id, metadata.required);
                    break;
            }

            this.setProperty(options, propertyKey, value);
        }

        return options;
    }

    private static getInputVariableFromProperty(options : any, id : string) : any{
        let propertyType = this.getTypeofProperty(options, id);

        let value : any;

        switch (propertyType){
            case "string":
                value = task.getInput(id);
                break;
            case "boolean":
                value = task.getBoolInput(id);
                break;
            default:
                value = "";
        }

        return value
    }
}

// Extend inversify to support configuration options binding
// Leaving this commented out as it doesn't work and isn't a priority - but would be nice for config
// declare module "inversify" {
//     interface Container {
//         configure<T>(func: (token: any) => T) : interfaces.BindingInWhenOnSyntax<T>;
//     }
// }
    
// Container.prototype.configure = function<T> (key : interfaces.ServiceIdentifier<T>) : interfaces.BindingInWhenOnSyntax<T> {
//     return this.bind<T>(key).toDynamicValue((context) => {
//         return Options.load<T>(); 
//     });
// }
