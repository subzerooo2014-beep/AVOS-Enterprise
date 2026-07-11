export declare class RegisterMegaPackValidationDto {
    packNumber: number;
    packName: string;
    version: string;
    buildPassed: boolean;
    verificationPassed: boolean;
    healthStatus: "healthy" | "degraded" | "critical";
    evidenceChainVerified: boolean;
}
