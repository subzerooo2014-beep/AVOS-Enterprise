import {
  Injectable,
  NotFoundException
} from "@nestjs/common";
import {
  MetadataPolicy
} from "../foundation-pack-14.types";
import { UnifiedMetadataCatalogService } from "../catalog/unified-metadata-catalog.service";
import { MetadataAuditService } from "../observability/metadata-audit.service";

@Injectable()
export class MetadataPolicyEngineService {
  private readonly policies =
    new Map<string, MetadataPolicy>([
      [
        "metadata-policy:default",
        {
          id: "metadata-policy:default",
          name: "Default Metadata Policy",
          description:
            "Baseline metadata completeness and quality requirements.",
          applicableAssetTypes: [],
          minimumQualityScore: 70,
          minimumConfidence: 60,
          requireOwner: true,
          requireDomain: true,
          requireClassification: false,
          allowedSensitivities: [
            "public",
            "internal",
            "confidential",
            "restricted"
          ],
          active: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]
    ]);

  constructor(
    private readonly catalog: UnifiedMetadataCatalogService,
    private readonly audit: MetadataAuditService
  ) {}

  list() {
    return Array.from(this.policies.values());
  }

  get(id: string) {
    const policy = this.policies.get(id);

    if (!policy) {
      throw new NotFoundException(
        `Metadata policy not found: ${id}`
      );
    }

    return policy;
  }

  register(
    input: Omit<MetadataPolicy, "createdAt" | "updatedAt">,
    context: {
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    const now = new Date().toISOString();

    const policy: MetadataPolicy = {
      ...input,
      applicableAssetTypes: Array.from(
        new Set(input.applicableAssetTypes)
      ),
      minimumQualityScore: this.clamp(
        input.minimumQualityScore
      ),
      minimumConfidence: this.clamp(
        input.minimumConfidence
      ),
      allowedSensitivities: Array.from(
        new Set(input.allowedSensitivities)
      ),
      createdAt: now,
      updatedAt: now
    };

    this.policies.set(policy.id, policy);

    this.audit.record({
      correlationId: context.correlationId,
      category: "policy",
      action: "metadata-policy-registered",
      subjectId: policy.id,
      actorIdentityId: context.actorIdentityId,
      outcome: "success",
      metadata: {
        active: policy.active,
        minimumQualityScore:
          policy.minimumQualityScore
      }
    });

    return policy;
  }

  evaluate(input: {
    metadataId: string;
    policyId?: string;
    actorIdentityId: string;
    correlationId: string;
  }) {
    const record = this.catalog.get(input.metadataId);
    const policy = this.get(
      input.policyId ?? "metadata-policy:default"
    );

    const reasons: string[] = [];
    let passed = true;

    if (
      policy.applicableAssetTypes.length > 0 &&
      !policy.applicableAssetTypes.includes(
        record.assetType
      )
    ) {
      reasons.push(
        "Policy does not apply to this asset type."
      );
    }

    if (
      record.qualityScore <
      policy.minimumQualityScore
    ) {
      passed = false;
      reasons.push(
        `Quality score ${record.qualityScore} is below ${policy.minimumQualityScore}.`
      );
    }

    if (
      record.confidence <
      policy.minimumConfidence
    ) {
      passed = false;
      reasons.push(
        `Confidence ${record.confidence} is below ${policy.minimumConfidence}.`
      );
    }

    if (
      policy.requireOwner &&
      !record.ownerIdentityId.trim()
    ) {
      passed = false;
      reasons.push("Metadata owner is required.");
    }

    if (
      policy.requireDomain &&
      !record.domain.trim()
    ) {
      passed = false;
      reasons.push("Metadata domain is required.");
    }

    if (
      policy.requireClassification &&
      record.classifications.length === 0
    ) {
      passed = false;
      reasons.push(
        "At least one classification is required."
      );
    }

    if (
      !policy.allowedSensitivities.includes(
        record.sensitivity
      )
    ) {
      passed = false;
      reasons.push(
        "Metadata sensitivity is not allowed by policy."
      );
    }

    if (reasons.length === 0) {
      reasons.push(
        "Metadata policy requirements passed."
      );
    }

    this.audit.record({
      correlationId: input.correlationId,
      category: "policy",
      action: "metadata-policy-evaluated",
      subjectId: record.id,
      actorIdentityId: input.actorIdentityId,
      outcome: passed ? "success" : "blocked",
      metadata: {
        policyId: policy.id,
        passed,
        reasons
      }
    });

    return {
      metadataId: record.id,
      policyId: policy.id,
      passed,
      reasons,
      evaluatedAt: new Date().toISOString()
    };
  }

  summary() {
    const policies = this.list();

    return {
      total: policies.length,
      active: policies.filter(
        (policy) => policy.active
      ).length
    };
  }

  private clamp(value: number) {
    return Math.max(0, Math.min(100, Number(value.toFixed(2))));
  }
}
