export declare class PasswordService {
    static hash(password: string): Promise<string>;
    static verify(password: string, hash: string): Promise<boolean>;
}
