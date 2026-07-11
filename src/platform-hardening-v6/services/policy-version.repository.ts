import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class PolicyVersionRepository {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  get policyModel(): any {
    return (this.prisma as any).persistentRuntimePolicy;
  }

  get versionModel(): any {
    return (this.prisma as any).persistentPolicyVersion;
  }

  findPolicy(id: string) {
    return this.policyModel.findUnique({
      where: { id },
      include: {
        currentVersionRecord: true,
      },
    });
  }

  findPolicies() {
    return this.policyModel.findMany({
      include: {
        currentVersionRecord: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
  }

  findVersion(
    policyId: string,
    version: number,
  ) {
    return this.versionModel.findUnique({
      where: {
        policyId_version: {
          policyId,
          version,
        },
      },
    });
  }

  findVersions(
    policyId: string,
    limit: number,
  ) {
    return this.versionModel.findMany({
      where: { policyId },
      orderBy: {
        version: "desc",
      },
      take: limit,
    });
  }

  countPolicies() {
    return this.policyModel.count();
  }

  countVersions() {
    return this.versionModel.count();
  }

  transaction<T>(
    callback: (tx: any) => Promise<T>,
  ): Promise<T> {
    return (this.prisma as any).$transaction(callback);
  }
}
