import { PrismaService } from "../../prisma/prisma.service";
export declare class GovernanceIntegrityRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    get auditModel(): any;
    get policyVersionModel(): any;
    get scanModel(): any;
    findAuditAscending(): any;
    findPolicyVersionsAscending(): any;
    findUnsignedAudit(limit?: number): any;
    findUnsignedPolicyVersions(limit?: number): any;
    updateAuditSignature(id: string, data: Record<string, unknown>): any;
    updatePolicySignature(id: string, data: Record<string, unknown>): any;
    createScan(data: Record<string, unknown>): any;
    findScans(limit?: number): any;
    findLatestScan(): any;
}
