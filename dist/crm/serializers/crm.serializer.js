"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrmSerializer = void 0;
const crm_priority_helper_1 = require("../helpers/crm-priority.helper");
const crm_recommendation_helper_1 = require("../helpers/crm-recommendation.helper");
const crm_followup_helper_1 = require("../helpers/crm-followup.helper");
const crm_segmentation_helper_1 = require("../helpers/crm-segmentation.helper");
const crm_sla_helper_1 = require("../helpers/crm-sla.helper");
const crm_quality_helper_1 = require("../helpers/crm-quality.helper");
const crm_automation_helper_1 = require("../helpers/crm-automation.helper");
class CrmSerializer {
    static item(item) {
        if (!item)
            return null;
        const qualityScore = (0, crm_quality_helper_1.calculateDataQuality)(item);
        return {
            ...item,
            priority: item.priority ?? (0, crm_priority_helper_1.calculateCrmPriority)(item),
            segment: (0, crm_segmentation_helper_1.getCrmSegment)(item),
            slaStatus: (0, crm_sla_helper_1.getCrmSlaStatus)(item),
            dataQualityScore: qualityScore,
            dataQualityLabel: (0, crm_quality_helper_1.getDataQualityLabel)(qualityScore),
            automationTags: (0, crm_automation_helper_1.getAutomationTags)(item),
            nextBestAction: (0, crm_recommendation_helper_1.getNextBestAction)(item),
            followUpBucket: (0, crm_followup_helper_1.getFollowUpBucket)(item.nextFollowUpAt),
            createdAt: item.createdAt instanceof Date ? item.createdAt.toISOString() : item.createdAt,
            updatedAt: item.updatedAt instanceof Date ? item.updatedAt.toISOString() : item.updatedAt,
            nextFollowUpAt: item.nextFollowUpAt instanceof Date ? item.nextFollowUpAt.toISOString() : item.nextFollowUpAt,
        };
    }
    static collection(items) {
        return Array.isArray(items) ? items.map((item) => this.item(item)) : [];
    }
}
exports.CrmSerializer = CrmSerializer;
//# sourceMappingURL=crm.serializer.js.map