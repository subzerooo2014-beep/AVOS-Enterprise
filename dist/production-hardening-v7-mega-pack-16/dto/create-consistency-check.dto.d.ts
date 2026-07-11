export declare class CreateConsistencyCheckDto {
    name: string;
    category: "integrity" | "versioning" | "health" | "evidence" | "certification" | "runtime" | "governance";
    required?: boolean;
    score: number;
    message?: string;
}
