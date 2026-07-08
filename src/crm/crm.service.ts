import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CrmMapper } from "./mappers/crm.mapper";
import { CrmPolicy } from "./policies/crm.policy";
import { buildCrmWhere, normalizeCrmPaging } from "./helpers/crm-query.helper";
import { createCrmNumber } from "./helpers/crm-number.helper";
import { calculateCrmScore } from "./helpers/crm-score.helper";
import { createCrmTimelineEvent, appendCrmTimeline } from "./helpers/crm-timeline.helper";
import { createCrmActivity, appendCrmActivity } from "./helpers/crm-activity.helper";
import { groupCrmPipeline } from "./helpers/crm-pipeline.helper";
import { buildCustomer360 } from "./helpers/crm-customer360.helper";
import { calculateCrmPriority } from "./helpers/crm-priority.helper";
import { getFollowUpBucket, normalizeFollowUpDate } from "./helpers/crm-followup.helper";
import { calculateRawPipelineValue, calculateWeightedPipelineValue } from "./helpers/crm-forecast.helper";
import { normalizeBulkIds } from "./helpers/crm-bulk.helper";
import { toCrmExportRows } from "./helpers/crm-export.helper";
import { normalizeImportedCrmRow } from "./helpers/crm-import.helper";
import { CrmSerializer } from "./serializers/crm.serializer";
import { groupBySegment } from "./helpers/crm-segmentation.helper";
import { findDuplicateGroups } from "./helpers/crm-duplicate.helper";
import { calculateDataQuality } from "./helpers/crm-quality.helper";
import { mergeCrmPayload } from "./helpers/crm-merge.helper";
import { getAutomationTags } from "./helpers/crm-automation.helper";

@Injectable()
export class CrmService {
  constructor(private readonly prisma: PrismaService) {}

  private delegate() {
    const client = this.prisma as any;

    if (!client.crm) {
      throw new BadRequestException("Prisma delegate 'crm' is not available.");
    }

    return client.crm;
  }

  private optionalDelegate(name: string): any {
    const client = this.prisma as any;
    return client?.[name] ?? null;
  }

  async findAll(query: any = {}) {
    const { page, limit, skip, take } = normalizeCrmPaging(query);
    const where = buildCrmWhere(query);

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
      items: CrmSerializer.collection(items),
      meta: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const record = await this.delegate().findUnique({ where: { id } });

    if (!record) {
      throw new NotFoundException("CRM record not found");
    }

    return CrmSerializer.item(record);
  }

  async create(dto: any) {
    const data = CrmMapper.toCreate({
      ...dto,
      number: dto?.number ?? createCrmNumber(),
    });

    data.score = calculateCrmScore(data);
    data.priority = data.priority ?? calculateCrmPriority(data);
    data.timeline = [createCrmTimelineEvent("CREATED", data)];
    data.activities = [
      createCrmActivity("CREATED", "CRM record created", {
        status: data.status,
      }),
    ];

    return this.delegate().create({ data });
  }

  async update(id: string, dto: any) {
    const record = await this.delegate().findUnique({ where: { id } });
    CrmPolicy.ensureCanUpdate(record);

    const data = CrmMapper.toUpdate(dto);

    data.score = calculateCrmScore({
      ...record,
      ...data,
    });
    data.priority = calculateCrmPriority({ ...record, ...data });

    data.timeline = appendCrmTimeline(
      record,
      createCrmTimelineEvent("UPDATED", data),
    );

    data.activities = appendCrmActivity(
      record,
      createCrmActivity("UPDATED", "CRM record updated", data),
    );

    return this.delegate().update({
      where: { id },
      data,
    });
  }

  async dashboard() {
    const delegate = this.delegate();

    const [
      total,
      newCount,
      contacted,
      qualified,
      opportunity,
      won,
      lost,
      inactive,
      allOpenItems,
      overdueItems,
    ] = await Promise.all([
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
      pipelineValue: calculateRawPipelineValue(allOpenItems),
      weightedPipelineValue: calculateWeightedPipelineValue(allOpenItems),
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

    return groupCrmPipeline(CrmSerializer.collection(items));
  }

  async segments() {
    const items = await this.delegate().findMany({
      orderBy: { createdAt: "desc" },
      take: 1000,
    });

    return groupBySegment(CrmSerializer.collection(items));
  }

  async duplicates() {
    const items = await this.delegate().findMany({
      orderBy: { createdAt: "desc" },
      take: 5000,
    });

    return findDuplicateGroups(items);
  }

  async dataQuality() {
    const items = await this.delegate().findMany({
      orderBy: { createdAt: "desc" },
      take: 5000,
    });

    const scored = items.map((item: any) => ({
      id: item.id,
      number: item.number,
      name: item.name,
      score: calculateDataQuality(item),
      missing: {
        phone: !item.phone,
        email: !item.email,
        source: !item.source,
        assignedToId: !item.assignedToId,
        nextFollowUpAt: !item.nextFollowUpAt,
      },
    }));

    const average = scored.length
      ? Number((scored.reduce((sum: number, item: any) => sum + item.score, 0) / scored.length).toFixed(2))
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

    return CrmSerializer.collection(items)
      .map((item: any) => ({
        ...item,
        automationTags: getAutomationTags(item),
      }))
      .filter((item: any) => item.automationTags.length > 0);
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
      rawPipelineValue: calculateRawPipelineValue(items),
      weightedPipelineValue: calculateWeightedPipelineValue(items),
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

    return CrmSerializer.collection(items).map((item) => ({
      ...item,
      followUpBucket: getFollowUpBucket(item.nextFollowUpAt),
    }));
  }

  async changeStatus(id: string, status: string) {
    CrmPolicy.ensureValidStatus(status);

    const record = await this.delegate().findUnique({ where: { id } });
    CrmPolicy.ensureExists(record);

    const data: any = {
      status,
      score: calculateCrmScore({ ...record, status }),
      priority: calculateCrmPriority({ ...record, status }),
      timeline: appendCrmTimeline(
        record,
        createCrmTimelineEvent("STATUS_CHANGED", {
          from: record.status,
          to: status,
        }),
      ),
      activities: appendCrmActivity(
        record,
        createCrmActivity("STATUS_CHANGED", "CRM status changed", {
          from: record.status,
          to: status,
        }),
      ),
    };

    return this.delegate().update({
      where: { id },
      data,
    });
  }

  async assign(id: string, assignedToId: string) {
    const record = await this.delegate().findUnique({ where: { id } });
    CrmPolicy.ensureExists(record);

    const data: any = {
      assignedToId,
      score: calculateCrmScore({ ...record, assignedToId }),
      priority: calculateCrmPriority({ ...record, assignedToId }),
      timeline: appendCrmTimeline(
        record,
        createCrmTimelineEvent("ASSIGNED", { assignedToId }),
      ),
      activities: appendCrmActivity(
        record,
        createCrmActivity("ASSIGNED", "CRM record assigned", { assignedToId }),
      ),
    };

    return this.delegate().update({
      where: { id },
      data,
    });
  }

  async scheduleFollowUp(id: string, nextFollowUpAt: string) {
    const record = await this.delegate().findUnique({ where: { id } });
    CrmPolicy.ensureExists(record);

    const date = normalizeFollowUpDate(nextFollowUpAt);

    if (!date) {
      throw new BadRequestException("Invalid follow-up date");
    }

    const data: any = {
      nextFollowUpAt: date,
      timeline: appendCrmTimeline(
        record,
        createCrmTimelineEvent("FOLLOW_UP_SCHEDULED", { nextFollowUpAt }),
      ),
      activities: appendCrmActivity(
        record,
        createCrmActivity("FOLLOW_UP_SCHEDULED", "Follow-up scheduled", {
          nextFollowUpAt,
        }),
      ),
    };

    return this.delegate().update({
      where: { id },
      data,
    });
  }

  async addNote(id: string, note: string) {
    const record = await this.delegate().findUnique({ where: { id } });
    CrmPolicy.ensureExists(record);

    const currentNotes = [record.notes, note].filter(Boolean).join("\n");

    return this.delegate().update({
      where: { id },
      data: {
        notes: currentNotes,
        timeline: appendCrmTimeline(record, createCrmTimelineEvent("NOTE_ADDED", { note })),
        activities: appendCrmActivity(record, createCrmActivity("NOTE", note, { note })),
      },
    });
  }

  async addActivity(id: string, dto: any) {
    const record = await this.delegate().findUnique({ where: { id } });
    CrmPolicy.ensureExists(record);

    const activity = createCrmActivity(
      dto?.type ?? "NOTE",
      dto?.description ?? dto?.note ?? "CRM activity",
      dto ?? {},
    );

    return this.delegate().update({
      where: { id },
      data: {
        activities: appendCrmActivity(record, activity),
        timeline: appendCrmTimeline(record, createCrmTimelineEvent("ACTIVITY_ADDED", activity)),
      },
    });
  }

  async customer360(id: string) {
    const record = await this.delegate().findUnique({ where: { id } });
    CrmPolicy.ensureExists(record);

    const salesDelegate = this.optionalDelegate("sale");
    const vehicleDelegate = this.optionalDelegate("vehicle");
    const taskDelegate = this.optionalDelegate("task");

    const [sales, vehicles, tasks] = await Promise.all([
      salesDelegate?.findMany
        ? salesDelegate.findMany({
            where: {
              OR: [
                { customerId: (record as any).customerId ?? undefined },
                { customerEmail: (record as any).email ?? undefined },
                { customerPhone: (record as any).phone ?? undefined },
              ],
            },
            take: 50,
            orderBy: { createdAt: "desc" },
          })
        : [],
      vehicleDelegate?.findMany
        ? vehicleDelegate.findMany({
            where: {
              customerId: (record as any).customerId ?? undefined,
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

    return buildCustomer360(record, sales, vehicles, tasks);
  }

  async exportRows(query: any = {}) {
    const where = buildCrmWhere(query);
    const items = await this.delegate().findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 5000,
    });

    return toCrmExportRows(items);
  }

  async importRows(rows: any[]) {
    if (!Array.isArray(rows)) {
      throw new BadRequestException("rows must be an array");
    }

    const created: any[] = [];

    for (const row of rows) {
      const normalized = normalizeImportedCrmRow(row);
      if (!normalized.name) continue;

      created.push(
        await this.create({
          ...normalized,
          source: normalized.source ?? "IMPORT",
        }),
      );
    }

    return {
      imported: created.length,
      items: created,
    };
  }

  async bulkStatus(dto: any) {
    const ids = normalizeBulkIds(dto?.ids);
    const status = dto?.status;

    if (!ids.length) {
      throw new BadRequestException("ids are required");
    }

    CrmPolicy.ensureValidStatus(status);

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

  async bulkAssign(dto: any) {
    const ids = normalizeBulkIds(dto?.ids);
    const assignedToId = dto?.assignedToId;

    if (!ids.length) {
      throw new BadRequestException("ids are required");
    }

    if (!assignedToId) {
      throw new BadRequestException("assignedToId is required");
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

  async merge(dto: any) {
    const primaryId = dto?.primaryId;
    const secondaryId = dto?.secondaryId;

    if (!primaryId || !secondaryId) {
      throw new BadRequestException("primaryId and secondaryId are required");
    }

    if (primaryId === secondaryId) {
      throw new BadRequestException("Cannot merge the same CRM record");
    }

    const [primary, secondary] = await Promise.all([
      this.delegate().findUnique({ where: { id: primaryId } }),
      this.delegate().findUnique({ where: { id: secondaryId } }),
    ]);

    CrmPolicy.ensureExists(primary);
    CrmPolicy.ensureExists(secondary);

    const merged = mergeCrmPayload(primary, secondary);

    const updated = await this.delegate().update({
      where: { id: primaryId },
      data: {
        ...merged,
        timeline: appendCrmTimeline(
          merged,
          createCrmTimelineEvent("MERGED", { secondaryId }),
        ),
      },
    });

    await this.delegate().delete({ where: { id: secondaryId } });

    return updated;
  }

  async convertToSale(id: string, dto: any = {}) {
    const record = await this.delegate().findUnique({ where: { id } });
    CrmPolicy.ensureExists(record);

    const salesDelegate = this.optionalDelegate("sale");

    if (!salesDelegate?.create) {
      throw new BadRequestException("Sales delegate is not available.");
    }

    const sale = await salesDelegate.create({
      data: {
        number: `SALE-${Date.now()}`,
        status: "OPEN",
        customerId: dto.customerId ?? (record as any).customerId ?? undefined,
        customerName: (record as any).name ?? undefined,
        customerPhone: (record as any).phone ?? undefined,
        customerEmail: (record as any).email ?? undefined,
        vehicleId: dto.vehicleId ?? (record as any).vehicleId ?? undefined,
        total: Number(dto.total ?? (record as any).expectedValue ?? 0),
        notes: dto.notes ?? (record as any).notes ?? undefined,
      },
    });

    await this.changeStatus(id, "OPPORTUNITY");

    return {
      crm: id,
      sale,
    };
  }

  async remove(id: string) {
    const record = await this.delegate().findUnique({ where: { id } });
    CrmPolicy.ensureCanDelete(record);

    return this.delegate().delete({
      where: { id },
    });
  }
}
