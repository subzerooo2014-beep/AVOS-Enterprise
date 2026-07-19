import { Injectable } from "@nestjs/common";
import { InspectionEvidence } from "./inspection-certification.types";
import { InspectionPluginResult } from "./inspection-plugin.types";

@Injectable()
export class EvidenceCollectorService {
  collect(results: readonly InspectionPluginResult[]): InspectionEvidence[] {
    const evidence: InspectionEvidence[] = [];

    for (const result of results) {
      evidence.push({
        key: `${result.pluginId}.status`,
        value: result.status,
      });
      evidence.push({
        key: `${result.pluginId}.durationMs`,
        value: result.durationMs,
      });

      for (const item of result.evidence) {
        evidence.push({
          key: `${result.pluginId}.${item.key}`,
          value: item.value,
        });
      }
    }

    return evidence;
  }
}
