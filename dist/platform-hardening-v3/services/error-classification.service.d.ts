import { ErrorClassification } from "../interfaces/error-classification.interface";
export declare class ErrorClassificationService {
    classify(error: unknown): ErrorClassification;
    private containsAny;
    private toSearchableText;
}
