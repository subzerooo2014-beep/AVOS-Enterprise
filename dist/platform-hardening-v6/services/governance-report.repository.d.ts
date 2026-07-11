import { PrismaService } from "../../prisma/prisma.service";
export declare class GovernanceReportRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    get complianceModel(): any;
    get evidenceModel(): any;
    createCompliance(data: Record<string, unknown>): any;
    findComplianceById(id: string): any;
    findComplianceSnapshots(limit: number): any;
    findLatestCompliance(): any;
    countCompliance(): any;
    createEvidence(data: Record<string, unknown>): any;
    findEvidenceById(id: string): any;
    findEvidencePackages(limit: number): any;
    findLatestEvidence(): any;
    countEvidence(): any;
}
