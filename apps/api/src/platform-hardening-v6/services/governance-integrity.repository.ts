import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class GovernanceIntegrityRepository {
  constructor(
    private readonly prisma:
      PrismaService,
  ) {}

  get auditModel(): any {
    return (this.prisma as any)
      .persistentAuditEvent;
  }

  get policyVersionModel(): any {
    return (this.prisma as any)
      .persistentPolicyVersion;
  }

  get scanModel(): any {
    return (this.prisma as any)
      .governanceIntegrityScan;
  }

  findAuditAscending() {
    return this.auditModel.findMany({
      orderBy: {
        sequence: "asc",
      },
    });
  }

  findPolicyVersionsAscending() {
    return this.policyVersionModel.findMany({
      orderBy: [
        {
          policyId: "asc",
        },
        {
          version: "asc",
        },
      ],
    });
  }

  findUnsignedAudit(limit = 500) {
    return this.auditModel.findMany({
      where: {
        OR: [
          { signature: null },
          { signedAt: null },
          { signatureKeyId: null },
          { signatureAlgorithm: null },
        ],
      },
      orderBy: {
        sequence: "asc",
      },
      take: limit,
    });
  }

  findUnsignedPolicyVersions(limit = 500) {
    return this.policyVersionModel.findMany({
      where: {
        OR: [
          { policySignature: null },
          { signedAt: null },
          { signatureKeyId: null },
          { signatureAlgorithm: null },
        ],
      },
      orderBy: [
        {
          policyId: "asc",
        },
        {
          version: "asc",
        },
      ],
      take: limit,
    });
  }

  updateAuditSignature(
    id: string,
    data: Record<string, unknown>,
  ) {
    return this.auditModel.update({
      where: { id },
      data,
    });
  }

  updatePolicySignature(
    id: string,
    data: Record<string, unknown>,
  ) {
    return this.policyVersionModel.update({
      where: { id },
      data,
    });
  }

  createScan(
    data: Record<string, unknown>,
  ) {
    return this.scanModel.create({
      data,
    });
  }

  findScans(limit = 100) {
    return this.scanModel.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: Math.min(
        Math.max(limit, 1),
        1000,
      ),
    });
  }

  findLatestScan() {
    return this.scanModel.findFirst({
      orderBy: {
        createdAt: "desc",
      },
    });
  }
}
