import { DynamicModule, Provider, Type } from "@nestjs/common";
import { PublisherAdapter } from "./publisher-registry.service";
export declare const PUBLISHER_ADAPTERS: unique symbol;
export interface PublisherEngineModuleOptions {
    global?: boolean;
    publisherProviders?: Provider[];
    publisherTypes?: Type<PublisherAdapter>[];
}
export declare class PublisherEngineModule {
    static forRoot(options?: PublisherEngineModuleOptions): DynamicModule;
    static registerPublishers(publisherTypes: Type<PublisherAdapter>[]): DynamicModule;
}
