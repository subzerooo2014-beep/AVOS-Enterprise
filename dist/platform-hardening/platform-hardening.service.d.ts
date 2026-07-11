export declare class PlatformHardeningService {
    status(): {
        success: boolean;
        system: string;
        version: string;
        environment: string;
        protections: {
            requestId: boolean;
            structuredErrors: boolean;
            securityHeaders: boolean;
            databaseErrorMapping: boolean;
            internalErrorMasking: boolean;
            hsts: boolean;
            poweredByHidden: boolean;
        };
        recommendations: (string | null)[];
        checkedAt: Date;
    };
}
