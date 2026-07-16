import {
  Injectable,
  NotFoundException
} from "@nestjs/common";
import {
  MetadataClassificationRule
} from "../foundation-pack-14.types";
import { UnifiedMetadataCatalogService } from "../catalog/unified-metadata-catalog.service";
import { MetadataAuditService } from "../observability/metadata-audit.service";

@Injectable()
export class MetadataClassificationEngineService {
  private readonly rules =
    new Map<string, MetadataClassificationRule>();

  constructor(
    private readonly catalog: UnifiedMetadataCatalogService,
    private readonly audit: MetadataAuditService
  ) {}

  listRules() {
    return Array.from(this.rules.values());
  }

  getRule(id: string) {
    const rule = this.rules.get(id);

    if (!rule) {
      throw new NotFoundException(
        `Metadata classification rule not found: ${id}`
      );
    }

    return rule;
  }

  register(
    input: Omit<
      MetadataClassificationRule,
      "createdAt" | "updatedAt"
    >,
    context: {
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    const now = new Date().toISOString();

    const rule: MetadataClassificationRule = {
      ...input,
      confidence: this.clamp(input.confidence),
      createdAt: now,
      updatedAt: now
    };

    this.rules.set(rule.id, rule);

    this.audit.record({
      correlationId: context.correlationId,
      category: "classification",
      action: "classification-rule-registered",
      subjectId: rule.id,
      actorIdentityId: context.actorIdentityId,
      outcome: "success",
      metadata: {
        classification: rule.classification,
        active: rule.active
      }
    });

    return rule;
  }

  classify(input: {
    metadataId: string;
    actorIdentityId: string;
    correlationId: string;
  }) {
    const record = this.catalog.get(input.metadataId);
    const classifications = new Set(
      record.classifications
    );
    const matchedRuleIds: string[] = [];
    let confidence = record.confidence;

    for (const rule of this.listRules()) {
      if (!rule.active) {
        continue;
      }

      const value = this.resolveField(
        record as unknown as Record<string, unknown>,
        rule.field
      );

      if (this.matches(rule, value)) {
        classifications.add(rule.classification);
        matchedRuleIds.push(rule.id);
        confidence = Math.max(
          confidence,
          rule.confidence
        );
      }
    }

    const updated = this.catalog.update(
      record.id,
      {
        classifications: Array.from(classifications),
        confidence
      },
      {
        actorIdentityId: input.actorIdentityId,
        correlationId: input.correlationId
      }
    );

    this.audit.record({
      correlationId: input.correlationId,
      category: "classification",
      action: "metadata-classified",
      subjectId: record.id,
      actorIdentityId: input.actorIdentityId,
      outcome: "success",
      metadata: {
        matchedRuleIds,
        classifications: updated.classifications
      }
    });

    return {
      record: updated,
      matchedRuleIds
    };
  }

  summary() {
    return {
      totalRules: this.rules.size,
      activeRules: this.listRules().filter(
        (rule) => rule.active
      ).length
    };
  }

  private matches(
    rule: MetadataClassificationRule,
    value: unknown
  ) {
    switch (rule.operator) {
      case "equals":
        return value === rule.value;
      case "contains":
        return Array.isArray(value)
          ? value.includes(rule.value)
          : String(value ?? "").includes(
              String(rule.value ?? "")
            );
      case "exists":
        return value !== undefined && value !== null;
      case "matches":
        return new RegExp(
          String(rule.value ?? ""),
          "i"
        ).test(String(value ?? ""));
      case "in":
        return Array.isArray(rule.value)
          ? rule.value.includes(value)
          : false;
      default:
        return false;
    }
  }

  private resolveField(
    source: Record<string, unknown>,
    path: string
  ) {
    const segments = path.split(".");
    let current: unknown = source;

    for (const segment of segments) {
      if (
        typeof current !== "object" ||
        current === null
      ) {
        return undefined;
      }

      current =
        (current as Record<string, unknown>)[segment];
    }

    return current;
  }

  private clamp(value: number) {
    return Math.max(0, Math.min(100, Number(value.toFixed(2))));
  }
}
