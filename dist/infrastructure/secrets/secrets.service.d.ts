export declare class SecretsService {
    get(key: string): string | undefined;
    require(key: string): string;
}
