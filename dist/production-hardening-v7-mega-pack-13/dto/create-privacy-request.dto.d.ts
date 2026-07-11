export declare class CreatePrivacyRequestDto {
    subjectReference: string;
    requestType: "access" | "correction" | "deletion" | "restriction" | "export";
    assetIds: string[];
    requestedBy?: string;
}
