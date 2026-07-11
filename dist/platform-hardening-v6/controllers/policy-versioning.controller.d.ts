import { CreateVersionedPolicyDto } from "../dto/create-versioned-policy.dto";
import { RollbackPolicyDto } from "../dto/rollback-policy.dto";
import { UpdateVersionedPolicyDto } from "../dto/update-versioned-policy.dto";
import { PolicyVersioningService } from "../services/policy-versioning.service";
export declare class PolicyVersioningController {
    private readonly policies;
    constructor(policies: PolicyVersioningService);
    findAll(): Promise<{
        success: boolean;
        summary: {
            totalPolicies: any;
            totalVersions: any;
            enabledPolicies: any;
            disabledPolicies: any;
            averageVersionsPerPolicy: number;
        };
        policies: any;
    }>;
    findOne(id: string): Promise<{
        success: boolean;
        policy: any;
    }>;
    history(id: string, limit?: string): Promise<{
        success: boolean;
        versions: any;
    }>;
    compare(id: string, fromVersion: number, toVersion: number): Promise<{
        success: boolean;
        comparison: import("..").PolicyVersionComparison;
    }>;
    create(dto: CreateVersionedPolicyDto, request: any): Promise<{
        success: boolean;
        result: {
            policy: any;
            version: any;
        };
    }>;
    update(id: string, dto: UpdateVersionedPolicyDto, request: any): Promise<{
        success: boolean;
        result: {
            policy: any;
            version: any;
        };
    }>;
    rollback(id: string, dto: RollbackPolicyDto, request: any): Promise<{
        success: boolean;
        result: {
            policy: any;
            version: any;
            restoredFromVersion: number;
        };
    }>;
    private getContext;
}
