import { PlatformHardeningService } from "./platform-hardening.service";
export declare class PlatformHardeningController {
    private readonly service;
    constructor(service: PlatformHardeningService);
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
    errorTest(): void;
}
