import { PrismaService } from "../../prisma/prisma.service";
export declare class PolicyVersionRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    get policyModel(): any;
    get versionModel(): any;
    findPolicy(id: string): any;
    findPolicies(): any;
    findVersion(policyId: string, version: number): any;
    findVersions(policyId: string, limit: number): any;
    countPolicies(): any;
    countVersions(): any;
    transaction<T>(callback: (tx: any) => Promise<T>): Promise<T>;
}
