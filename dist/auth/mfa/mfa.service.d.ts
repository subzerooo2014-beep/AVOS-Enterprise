export declare class MfaService {
    generate(): {
        code: string;
    };
    verify(code: string): code is "123456";
}
