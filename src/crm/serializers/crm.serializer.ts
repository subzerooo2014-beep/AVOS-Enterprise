import { calculateCrmPriority } from "../helpers/crm-priority.helper";
import { getNextBestAction } from "../helpers/crm-recommendation.helper";
import { getFollowUpBucket } from "../helpers/crm-followup.helper";
import { getCrmSegment } from "../helpers/crm-segmentation.helper";
import { getCrmSlaStatus } from "../helpers/crm-sla.helper";
import { calculateDataQuality, getDataQualityLabel } from "../helpers/crm-quality.helper";
import { getAutomationTags } from "../helpers/crm-automation.helper";

export class CrmSerializer {
  static item(item: any): any {
    if (!item) return null;

    const qualityScore = calculateDataQuality(item);

    return {
      ...item,
      priority: item.priority ?? calculateCrmPriority(item),
      segment: getCrmSegment(item),
      slaStatus: getCrmSlaStatus(item),
      dataQualityScore: qualityScore,
      dataQualityLabel: getDataQualityLabel(qualityScore),
      automationTags: getAutomationTags(item),
      nextBestAction: getNextBestAction(item),
      followUpBucket: getFollowUpBucket(item.nextFollowUpAt),
      createdAt: item.createdAt instanceof Date ? item.createdAt.toISOString() : item.createdAt,
      updatedAt: item.updatedAt instanceof Date ? item.updatedAt.toISOString() : item.updatedAt,
      nextFollowUpAt: item.nextFollowUpAt instanceof Date ? item.nextFollowUpAt.toISOString() : item.nextFollowUpAt,
    };
  }

  static collection(items: any[]): any[] {
    return Array.isArray(items) ? items.map((item) => this.item(item)) : [];
  }
}
