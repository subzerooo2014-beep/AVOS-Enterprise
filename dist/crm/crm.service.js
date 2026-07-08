"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrmService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const crm_mapper_1 = require("./mappers/crm.mapper");
const crm_policy_1 = require("./policies/crm.policy");
const crm_query_helper_1 = require("./helpers/crm-query.helper");
const crm_number_helper_1 = require("./helpers/crm-number.helper");
const crm_score_helper_1 = require("./helpers/crm-score.helper");
const crm_timeline_helper_1 = require("./helpers/crm-timeline.helper");
const crm_activity_helper_1 = require("./helpers/crm-activity.helper");
const crm_pipeline_helper_1 = require("./helpers/crm-pipeline.helper");
const crm_customer360_helper_1 = require("./helpers/crm-customer360.helper");
const crm_priority_helper_1 = require("./helpers/crm-priority.helper");
const crm_followup_helper_1 = require("./helpers/crm-followup.helper");
const crm_forecast_helper_1 = require("./helpers/crm-forecast.helper");
const crm_bulk_helper_1 = require("./helpers/crm-bulk.helper");
const crm_export_helper_1 = require("./helpers/crm-export.helper");
const crm_import_helper_1 = require("./helpers/crm-import.helper");
const crm_serializer_1 = require("./serializers/crm.serializer");
const crm_segmentation_helper_1 = require("./helpers/crm-segmentation.helper");
const crm_duplicate_helper_1 = require("./helpers/crm-duplicate.helper");
const crm_quality_helper_1 = require("./helpers/crm-quality.helper");
const crm_merge_helper_1 = require("./helpers/crm-merge.helper");
const crm_automation_helper_1 = require("./helpers/crm-automation.helper");
let CrmService = class CrmService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    delegate() {
        const client = this.prisma;
        if (!client.crm) {
            throw new common_1.BadRequestException("Prisma delegate 'crm' is not available.");
        }
        return client.crm;
    }
    optionalDelegate(name) {
        const client = this.prisma;
        return client?.[name] ?? null;
    }
    async findAll(query = {}) {
        const { page, limit, skip, take } = (0, crm_query_helper_1.normalizeCrmPaging)(query);
        const where = (0, crm_query_helper_1.buildCrmWhere)(query);
        const [items, total] = await Promise.all([
            this.delegate().findMany({
                where,
                skip,
                take,
                orderBy: { createdAt: "desc" },
            }),
            this.delegate().count({ where }),
        ]);
        return {
            items: crm_serializer_1.CrmSerializer.collection(items),
            meta: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(id) {
        const record = await this.delegate().findUnique({ where: { id } });
        if (!record) {
            throw new common_1.NotFoundException("CRM record not found");
        }
        return crm_serializer_1.CrmSerializer.item(record);
    }
    async create(dto) {
        const data = crm_mapper_1.CrmMapper.toCreate({
            ...dto,
            number: dto?.number ?? (0, crm_number_helper_1.createCrmNumber)(),
        });
        data.score = (0, crm_score_helper_1.calculateCrmScore)(data);
        data.priority = data.priority ?? (0, crm_priority_helper_1.calculateCrmPriority)(data);
        data.timeline = [(0, crm_timeline_helper_1.createCrmTimelineEvent)("CREATED", data)];
        data.activities = [
            (0, crm_activity_helper_1.createCrmActivity)("CREATED", "CRM record created", {
                status: data.status,
            }),
        ];
        return this.delegate().create({ data });
    }
    async update(id, dto) {
        const record = await this.delegate().findUnique({ where: { id } });
        crm_policy_1.CrmPolicy.ensureCanUpdate(record);
        const data = crm_mapper_1.CrmMapper.toUpdate(dto);
        data.score = (0, crm_score_helper_1.calculateCrmScore)({
            ...record,
            ...data,
        });
        data.priority = (0, crm_priority_helper_1.calculateCrmPriority)({ ...record, ...data });
        data.timeline = (0, crm_timeline_helper_1.appendCrmTimeline)(record, (0, crm_timeline_helper_1.createCrmTimelineEvent)("UPDATED", data));
        data.activities = (0, crm_activity_helper_1.appendCrmActivity)(record, (0, crm_activity_helper_1.createCrmActivity)("UPDATED", "CRM record updated", data));
        return this.delegate().update({
            where: { id },
            data,
        });
    }
    async dashboard() {
        const delegate = this.delegate();
        const [total, newCount, contacted, qualified, opportunity, won, lost, inactive, allOpenItems, overdueItems,] = await Promise.all([
            delegate.count(),
            delegate.count({ where: { status: "NEW" } }),
            delegate.count({ where: { status: "CONTACTED" } }),
            delegate.count({ where: { status: "QUALIFIED" } }),
            delegate.count({ where: { status: "OPPORTUNITY" } }),
            delegate.count({ where: { status: "WON" } }),
            delegate.count({ where: { status: "LOST" } }),
            delegate.count({ where: { status: "INACTIVE" } }),
            delegate.findMany({
                where: {
                    status: {
                        in: ["NEW", "CONTACTED", "QUALIFIED", "OPPORTUNITY"],
                    },
                },
                take: 500,
            }),
            delegate.findMany({
                where: {
                    nextFollowUpAt: {
                        lt: new Date(),
                    },
                    status: {
                        in: ["NEW", "CONTACTED", "QUALIFIED", "OPPORTUNITY"],
                    },
                },
                take: 100,
                orderBy: { nextFollowUpAt: "asc" },
            }),
        ]);
        const active = newCount + contacted + qualified + opportunity;
        return {
            total,
            newCount,
            contacted,
            qualified,
            opportunity,
            won,
            lost,
            inactive,
            active,
            winRate: total ? Number(((won / total) * 100).toFixed(2)) : 0,
            lossRate: total ? Number(((lost / total) * 100).toFixed(2)) : 0,
            conversionRate: total ? Number(((won / total) * 100).toFixed(2)) : 0,
            pipelineValue: (0, crm_forecast_helper_1.calculateRawPipelineValue)(allOpenItems),
            weightedPipelineValue: (0, crm_forecast_helper_1.calculateWeightedPipelineValue)(allOpenItems),
            overdueFollowUps: overdueItems.length,
            pipelineHealth: {
                active,
                final: won + lost + inactive,
                opportunityRatio: total ? Number(((opportunity / total) * 100).toFixed(2)) : 0,
            },
        };
    }
    async pipeline() {
        const items = await this.delegate().findMany({
            orderBy: { createdAt: "desc" },
            take: 500,
        });
        return (0, crm_pipeline_helper_1.groupCrmPipeline)(crm_serializer_1.CrmSerializer.collection(items));
    }
    async segments() {
        const items = await this.delegate().findMany({
            orderBy: { createdAt: "desc" },
            take: 1000,
        });
        return (0, crm_segmentation_helper_1.groupBySegment)(crm_serializer_1.CrmSerializer.collection(items));
    }
    async duplicates() {
        const items = await this.delegate().findMany({
            orderBy: { createdAt: "desc" },
            take: 5000,
        });
        return (0, crm_duplicate_helper_1.findDuplicateGroups)(items);
    }
    async dataQuality() {
        const items = await this.delegate().findMany({
            orderBy: { createdAt: "desc" },
            take: 5000,
        });
        const scored = items.map((item) => ({
            id: item.id,
            number: item.number,
            name: item.name,
            score: (0, crm_quality_helper_1.calculateDataQuality)(item),
            missing: {
                phone: !item.phone,
                email: !item.email,
                source: !item.source,
                assignedToId: !item.assignedToId,
                nextFollowUpAt: !item.nextFollowUpAt,
            },
        }));
        const average = scored.length
            ? Number((scored.reduce((sum, item) => sum + item.score, 0) / scored.length).toFixed(2))
            : 0;
        return {
            average,
            total: scored.length,
            items: scored,
        };
    }
    async automationQueue() {
        const items = await this.delegate().findMany({
            where: {
                status: {
                    in: ["NEW", "CONTACTED", "QUALIFIED", "OPPORTUNITY"],
                },
            },
            take: 1000,
            orderBy: { createdAt: "desc" },
        });
        return crm_serializer_1.CrmSerializer.collection(items)
            .map((item) => ({
            ...item,
            automationTags: (0, crm_automation_helper_1.getAutomationTags)(item),
        }))
            .filter((item) => item.automationTags.length > 0);
    }
    async forecast() {
        const items = await this.delegate().findMany({
            where: {
                status: {
                    in: ["NEW", "CONTACTED", "QUALIFIED", "OPPORTUNITY", "WON"],
                },
            },
            take: 1000,
            orderBy: { createdAt: "desc" },
        });
        return {
            rawPipelineValue: (0, crm_forecast_helper_1.calculateRawPipelineValue)(items),
            weightedPipelineValue: (0, crm_forecast_helper_1.calculateWeightedPipelineValue)(items),
            records: items.length,
            generatedAt: new Date().toISOString(),
        };
    }
    async overdueFollowUps() {
        const items = await this.delegate().findMany({
            where: {
                nextFollowUpAt: {
                    lt: new Date(),
                },
                status: {
                    in: ["NEW", "CONTACTED", "QUALIFIED", "OPPORTUNITY"],
                },
            },
            orderBy: { nextFollowUpAt: "asc" },
            take: 200,
        });
        return crm_serializer_1.CrmSerializer.collection(items).map((item) => ({
            ...item,
            followUpBucket: (0, crm_followup_helper_1.getFollowUpBucket)(item.nextFollowUpAt),
        }));
    }
    async changeStatus(id, status) {
        crm_policy_1.CrmPolicy.ensureValidStatus(status);
        const record = await this.delegate().findUnique({ where: { id } });
        crm_policy_1.CrmPolicy.ensureExists(record);
        const data = {
            status,
            score: (0, crm_score_helper_1.calculateCrmScore)({ ...record, status }),
            priority: (0, crm_priority_helper_1.calculateCrmPriority)({ ...record, status }),
            timeline: (0, crm_timeline_helper_1.appendCrmTimeline)(record, (0, crm_timeline_helper_1.createCrmTimelineEvent)("STATUS_CHANGED", {
                from: record.status,
                to: status,
            })),
            activities: (0, crm_activity_helper_1.appendCrmActivity)(record, (0, crm_activity_helper_1.createCrmActivity)("STATUS_CHANGED", "CRM status changed", {
                from: record.status,
                to: status,
            })),
        };
        return this.delegate().update({
            where: { id },
            data,
        });
    }
    async assign(id, assignedToId) {
        const record = await this.delegate().findUnique({ where: { id } });
        crm_policy_1.CrmPolicy.ensureExists(record);
        const data = {
            assignedToId,
            score: (0, crm_score_helper_1.calculateCrmScore)({ ...record, assignedToId }),
            priority: (0, crm_priority_helper_1.calculateCrmPriority)({ ...record, assignedToId }),
            timeline: (0, crm_timeline_helper_1.appendCrmTimeline)(record, (0, crm_timeline_helper_1.createCrmTimelineEvent)("ASSIGNED", { assignedToId })),
            activities: (0, crm_activity_helper_1.appendCrmActivity)(record, (0, crm_activity_helper_1.createCrmActivity)("ASSIGNED", "CRM record assigned", { assignedToId })),
        };
        return this.delegate().update({
            where: { id },
            data,
        });
    }
    async scheduleFollowUp(id, nextFollowUpAt) {
        const record = await this.delegate().findUnique({ where: { id } });
        crm_policy_1.CrmPolicy.ensureExists(record);
        const date = (0, crm_followup_helper_1.normalizeFollowUpDate)(nextFollowUpAt);
        if (!date) {
            throw new common_1.BadRequestException("Invalid follow-up date");
        }
        const data = {
            nextFollowUpAt: date,
            timeline: (0, crm_timeline_helper_1.appendCrmTimeline)(record, (0, crm_timeline_helper_1.createCrmTimelineEvent)("FOLLOW_UP_SCHEDULED", { nextFollowUpAt })),
            activities: (0, crm_activity_helper_1.appendCrmActivity)(record, (0, crm_activity_helper_1.createCrmActivity)("FOLLOW_UP_SCHEDULED", "Follow-up scheduled", {
                nextFollowUpAt,
            })),
        };
        return this.delegate().update({
            where: { id },
            data,
        });
    }
    async addNote(id, note) {
        const record = await this.delegate().findUnique({ where: { id } });
        crm_policy_1.CrmPolicy.ensureExists(record);
        const currentNotes = [record.notes, note].filter(Boolean).join("\n");
        return this.delegate().update({
            where: { id },
            data: {
                notes: currentNotes,
                timeline: (0, crm_timeline_helper_1.appendCrmTimeline)(record, (0, crm_timeline_helper_1.createCrmTimelineEvent)("NOTE_ADDED", { note })),
                activities: (0, crm_activity_helper_1.appendCrmActivity)(record, (0, crm_activity_helper_1.createCrmActivity)("NOTE", note, { note })),
            },
        });
    }
    async addActivity(id, dto) {
        const record = await this.delegate().findUnique({ where: { id } });
        crm_policy_1.CrmPolicy.ensureExists(record);
        const activity = (0, crm_activity_helper_1.createCrmActivity)(dto?.type ?? "NOTE", dto?.description ?? dto?.note ?? "CRM activity", dto ?? {});
        return this.delegate().update({
            where: { id },
            data: {
                activities: (0, crm_activity_helper_1.appendCrmActivity)(record, activity),
                timeline: (0, crm_timeline_helper_1.appendCrmTimeline)(record, (0, crm_timeline_helper_1.createCrmTimelineEvent)("ACTIVITY_ADDED", activity)),
            },
        });
    }
    async customer360(id) {
        const record = await this.delegate().findUnique({ where: { id } });
        crm_policy_1.CrmPolicy.ensureExists(record);
        const salesDelegate = this.optionalDelegate("sale");
        const vehicleDelegate = this.optionalDelegate("vehicle");
        const taskDelegate = this.optionalDelegate("task");
        const [sales, vehicles, tasks] = await Promise.all([
            salesDelegate?.findMany
                ? salesDelegate.findMany({
                    where: {
                        OR: [
                            { customerId: record.customerId ?? undefined },
                            { customerEmail: record.email ?? undefined },
                            { customerPhone: record.phone ?? undefined },
                        ],
                    },
                    take: 50,
                    orderBy: { createdAt: "desc" },
                })
                : [],
            vehicleDelegate?.findMany
                ? vehicleDelegate.findMany({
                    where: {
                        customerId: record.customerId ?? undefined,
                    },
                    take: 50,
                    orderBy: { createdAt: "desc" },
                })
                : [],
            taskDelegate?.findMany
                ? taskDelegate.findMany({
                    where: {
                        crmId: id,
                    },
                    take: 50,
                    orderBy: { createdAt: "desc" },
                })
                : [],
        ]);
        return (0, crm_customer360_helper_1.buildCustomer360)(record, sales, vehicles, tasks);
    }
    async exportRows(query = {}) {
        const where = (0, crm_query_helper_1.buildCrmWhere)(query);
        const items = await this.delegate().findMany({
            where,
            orderBy: { createdAt: "desc" },
            take: 5000,
        });
        return (0, crm_export_helper_1.toCrmExportRows)(items);
    }
    async importRows(rows) {
        if (!Array.isArray(rows)) {
            throw new common_1.BadRequestException("rows must be an array");
        }
        const created = [];
        for (const row of rows) {
            const normalized = (0, crm_import_helper_1.normalizeImportedCrmRow)(row);
            if (!normalized.name)
                continue;
            created.push(await this.create({
                ...normalized,
                source: normalized.source ?? "IMPORT",
            }));
        }
        return {
            imported: created.length,
            items: created,
        };
    }
    async bulkStatus(dto) {
        const ids = (0, crm_bulk_helper_1.normalizeBulkIds)(dto?.ids);
        const status = dto?.status;
        if (!ids.length) {
            throw new common_1.BadRequestException("ids are required");
        }
        crm_policy_1.CrmPolicy.ensureValidStatus(status);
        const result = await this.delegate().updateMany({
            where: {
                id: {
                    in: ids,
                },
            },
            data: {
                status,
            },
        });
        return {
            updated: result.count ?? 0,
            status,
        };
    }
    async bulkAssign(dto) {
        const ids = (0, crm_bulk_helper_1.normalizeBulkIds)(dto?.ids);
        const assignedToId = dto?.assignedToId;
        if (!ids.length) {
            throw new common_1.BadRequestException("ids are required");
        }
        if (!assignedToId) {
            throw new common_1.BadRequestException("assignedToId is required");
        }
        const result = await this.delegate().updateMany({
            where: {
                id: {
                    in: ids,
                },
            },
            data: {
                assignedToId,
            },
        });
        return {
            updated: result.count ?? 0,
            assignedToId,
        };
    }
    async merge(dto) {
        const primaryId = dto?.primaryId;
        const secondaryId = dto?.secondaryId;
        if (!primaryId || !secondaryId) {
            throw new common_1.BadRequestException("primaryId and secondaryId are required");
        }
        if (primaryId === secondaryId) {
            throw new common_1.BadRequestException("Cannot merge the same CRM record");
        }
        const [primary, secondary] = await Promise.all([
            this.delegate().findUnique({ where: { id: primaryId } }),
            this.delegate().findUnique({ where: { id: secondaryId } }),
        ]);
        crm_policy_1.CrmPolicy.ensureExists(primary);
        crm_policy_1.CrmPolicy.ensureExists(secondary);
        const merged = (0, crm_merge_helper_1.mergeCrmPayload)(primary, secondary);
        const updated = await this.delegate().update({
            where: { id: primaryId },
            data: {
                ...merged,
                timeline: (0, crm_timeline_helper_1.appendCrmTimeline)(merged, (0, crm_timeline_helper_1.createCrmTimelineEvent)("MERGED", { secondaryId })),
            },
        });
        await this.delegate().delete({ where: { id: secondaryId } });
        return updated;
    }
    async convertToSale(id, dto = {}) {
        const record = await this.delegate().findUnique({ where: { id } });
        crm_policy_1.CrmPolicy.ensureExists(record);
        const salesDelegate = this.optionalDelegate("sale");
        if (!salesDelegate?.create) {
            throw new common_1.BadRequestException("Sales delegate is not available.");
        }
        const sale = await salesDelegate.create({
            data: {
                number: `SALE-${Date.now()}`,
                status: "OPEN",
                customerId: dto.customerId ?? record.customerId ?? undefined,
                customerName: record.name ?? undefined,
                customerPhone: record.phone ?? undefined,
                customerEmail: record.email ?? undefined,
                vehicleId: dto.vehicleId ?? record.vehicleId ?? undefined,
                total: Number(dto.total ?? record.expectedValue ?? 0),
                notes: dto.notes ?? record.notes ?? undefined,
            },
        });
        await this.changeStatus(id, "OPPORTUNITY");
        return {
            crm: id,
            sale,
        };
    }
    async remove(id) {
        const record = await this.delegate().findUnique({ where: { id } });
        crm_policy_1.CrmPolicy.ensureCanDelete(record);
        return this.delegate().delete({
            where: { id },
        });
    }
};
exports.CrmService = CrmService;
exports.CrmService = CrmService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CrmService);
//# sourceMappingURL=crm.service.js.map