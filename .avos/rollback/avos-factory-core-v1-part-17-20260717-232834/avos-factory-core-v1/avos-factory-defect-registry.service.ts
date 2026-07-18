import {
  BadRequestException,
  Injectable
} from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  AvosFactoryDefectRecord,
  AvosFactoryValidationFinding
} from "./avos-factory-validation.contracts";
import {
  AvosFactoryValidationEngineService
} from "./avos-factory-validation-engine.service";

@Injectable()
export class AvosFactoryDefectRegistryService {
  private readonly defects: AvosFactoryDefectRecord[] = [];

  constructor(
    private readonly validation: AvosFactoryValidationEngineService
  ) {}

  createFromReport(reportId: string): AvosFactoryDefectRecord[] {
    const report = this.validation.get(reportId);

    if (!report) {
      throw new BadRequestException(`Validation report not found: ${reportId}`);
    }

    const created = report.findings
      .filter((finding) => finding.status === "failed")
      .map((finding) => this.fromFinding(finding));

    this.defects.unshift(...created);
    return created.map((defect) => structuredClone(defect));
  }

  update(input: {
    defectId: string;
    status: AvosFactoryDefectRecord["status"];
    owner?: string;
    resolution?: string;
  }): AvosFactoryDefectRecord {
    const defect = this.defects.find(
      (candidate) => candidate.id === input.defectId
    );

    if (!defect) {
      throw new BadRequestException(`Defect not found: ${input.defectId}`);
    }

    defect.status = input.status;
    defect.owner = input.owner ?? defect.owner;
    defect.resolution = input.resolution ?? defect.resolution;

    if (
      input.status === "resolved" ||
      input.status === "accepted-risk"
    ) {
      defect.resolvedAt = new Date().toISOString();
    }

    return structuredClone(defect);
  }

  list(limit = 100): AvosFactoryDefectRecord[] {
    return this.defects
      .slice(0, Math.max(1, Math.min(limit, 1000)))
      .map((defect) => structuredClone(defect));
  }

  private fromFinding(
    finding: AvosFactoryValidationFinding
  ): AvosFactoryDefectRecord {
    return {
      id: randomUUID(),
      subjectId: finding.subjectId,
      findingId: finding.id,
      title: finding.message,
      severity: finding.severity,
      status: "open",
      createdAt: new Date().toISOString()
    };
  }
}
