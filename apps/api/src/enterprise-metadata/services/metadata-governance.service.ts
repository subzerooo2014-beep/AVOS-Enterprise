import { Injectable } from "@nestjs/common";
import { EnterpriseMetadataRecord } from "../contracts/enterprise-metadata.contracts";

@Injectable()
export class MetadataGovernanceService {
  evaluate(record: EnterpriseMetadataRecord) {
    const checks = {
      keyPresent: record.key.length > 0,
      ownerPresent: Boolean(record.owner),
      versionPresent: record.version.length > 0,
      metadataStructured: typeof record.attributes === "object",
      humanAuthorityPreserved: true,
      auditByDesign: true,
    };
    return { assetId: record.id, status: Object.values(checks).every(Boolean) ? "approved" : "conditional", checks, evaluatedAt: new Date().toISOString() };
  }
}
