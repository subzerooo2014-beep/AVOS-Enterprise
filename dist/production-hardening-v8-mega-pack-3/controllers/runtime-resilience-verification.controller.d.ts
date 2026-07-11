import { RuntimeResilienceVerificationService } from "../verification/runtime-resilience-verification.service";
export declare class RuntimeResilienceVerificationController {
    private readonly verification;
    constructor(verification: RuntimeResilienceVerificationService);
    verify(): import("../verification/runtime-resilience-verification.service").RuntimeVerificationResult;
}
