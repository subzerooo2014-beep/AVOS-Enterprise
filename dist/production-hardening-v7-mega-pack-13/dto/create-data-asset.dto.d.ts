export declare class CreateDataAssetDto {
    name: string;
    description?: string;
    domain: string;
    owner: string;
    steward: string;
    classification: "public" | "internal" | "confidential" | "restricted";
    containsPersonalData?: boolean;
    containsSensitiveData?: boolean;
    sourceSystem: string;
    storageLocation: string;
    tags?: string[];
}
