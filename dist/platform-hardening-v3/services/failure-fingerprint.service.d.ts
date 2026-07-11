import { ErrorClassification } from "../interfaces/error-classification.interface";
export declare class FailureFingerprintService {
    create(input: {
        error: unknown;
        classification: ErrorClassification;
        method?: string;
        path?: string;
    }): string;
    private getMessage;
    private normalizeMessage;
    private normalizePath;
}
