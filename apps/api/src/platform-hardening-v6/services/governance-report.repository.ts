import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class GovernanceReportRepository {
  constructor(
    private readonly prisma:
      PrismaService,
  ) {}

  get complianceModel(): any {
    return (this.prisma as any)
      .governanceComplianceSnapshot;
  }

  get evidenceModel(): any {
    return (this.prisma as any)
      .governanceEvidencePackage;
  }

  createCompliance(
    data: Record<string, unknown>,
  ) {
    return this.complianceModel.create({
      data,
    });
  }

  findComplianceById(
    id: string,
  ) {
    return this.complianceModel.findUnique({
      where: { id },
    });
  }

  findComplianceSnapshots(
    limit: number,
  ) {
    return this.complianceModel.findMany({
      orderBy: {
        generatedAt: "desc",
      },
      take: Math.min(
        Math.max(limit, 1),
        1000,
      ),
    });
  }

  findLatestCompliance() {
    return this.complianceModel.findFirst({
      orderBy: {
        generatedAt: "desc",
      },
    });
  }

  countCompliance() {
    return this.complianceModel.count();
  }

  createEvidence(
    data: Record<string, unknown>,
  ) {
    return this.evidenceModel.create({
      data,
    });
  }

  findEvidenceById(
    id: string,
  ) {
    return this.evidenceModel.findUnique({
      where: { id },
    });
  }

  findEvidencePackages(
    limit: number,
  ) {
    return this.evidenceModel.findMany({
      orderBy: {
        generatedAt: "desc",
      },
      take: Math.min(
        Math.max(limit, 1),
        1000,
      ),
    });
  }

  findLatestEvidence() {
    return this.evidenceModel.findFirst({
      orderBy: {
        generatedAt: "desc",
      },
    });
  }

  countEvidence() {
    return this.evidenceModel.count();
  }
}
