export declare class AiToolRegistryService {
    private tools;
    register(name: string, fn: Function): void;
    execute(name: string, payload: any): Promise<any>;
}
