export declare class TokenAccountingService {
    calculate(input: string, output: string): {
        promptTokens: number;
        completionTokens: number;
        totalTokens: number;
    };
}
