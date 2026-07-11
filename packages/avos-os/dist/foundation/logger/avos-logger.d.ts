export declare class AvosLogger {
    private readonly scope;
    constructor(scope?: string);
    info(message: string, data?: any): void;
    warn(message: string, data?: any): void;
    error(message: string, data?: any): void;
}
