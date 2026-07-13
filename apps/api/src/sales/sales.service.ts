import {
  BadRequestException,
  ConflictException,
  Injectable,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { EventsService } from "../events/events.service";
import { WorkflowsService } from "../workflows/workflows.service";
import { InventoryService } from "../inventory/inventory.service";
import {
  cleanFlowData,
  delegateOrThrow,
  ensureTransition,
  readCompletedOperation,
  rememberCompletedOperation,
  resolveIdempotencyKey,
} from "../core-application-flows/core-flow.utils";
import { SalesMapper } from "./mappers/sales.mapper";
import { SalesPolicy, SaleStatus } from "./policies/sales.policy";
import { buildSalesWhere, normalizeSalesPaging } from "./helpers/sales-query.helper";
import { createSalesNumber } from "./helpers/sales-number.helper";

@Injectable()
export class SalesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly inventory: InventoryService,
    private readonly events: EventsService,
    private readonly workflows: WorkflowsService,
  ) {}

  private saleDelegate(client: unknown = this.prisma) {
    return delegateOrThrow(client, "sale");
  }

  async findAll(query: any = {}) {
    const delegate = this.saleDelegate();
    const { page, limit, skip, take } = normalizeSalesPaging(query);
    const where = buildSalesWhere(query);
    const [items, total] = await Promise.all([
      delegate.findMany({ where, skip, take, orderBy: { createdAt: "desc" } }),
      delegate.count({ where }),
    ]);
    return { items, meta: { page, limit, total, pages: Math.ceil(total / limit) } };
  }

  async findOne(id: string, client: unknown = this.prisma) {
    const sale = await this.saleDelegate(client).findUnique({ where: { id } });
    SalesPolicy.ensureExists(sale);
    return sale;
  }

  async create(dto: any) {
    const data = SalesMapper.toCreate({ ...dto, number: dto?.number ?? createSalesNumber() });
    const sale = await this.saleDelegate().create({ data });
    this.events.create({
      type: "SaleCreated",
      aggregateType: "Sale",
      aggregateId: sale.id,
      payload: { number: sale.number, status: sale.status },
    });
    return sale;
  }

  async update(id: string, dto: any) {
    const sale = await this.findOne(id);
    SalesPolicy.ensureCanUpdate(sale);
    return this.saleDelegate().update({ where: { id }, data: SalesMapper.toUpdate(dto) });
  }

  async changeStatus(id: string, status: SaleStatus) {
    SalesPolicy.ensureValidStatus(status);
    const sale = await this.findOne(id);
    const transitions: Record<string, string[]> = {
      PENDING_APPROVAL: ["OPEN", "DRAFT"],
      APPROVED: ["PENDING_APPROVAL"],
      WON: ["APPROVED"],
      LOST: ["OPEN", "DRAFT", "PENDING_APPROVAL", "APPROVED"],
      CANCELLED: ["OPEN", "DRAFT", "PENDING_APPROVAL", "APPROVED"],
      CLOSED: ["WON", "LOST", "CANCELLED"],
    };
    ensureTransition(sale.status, transitions[status] ?? [sale.status], status);
    const updated = await this.saleDelegate().update({ where: { id }, data: { status } });
    this.events.create({
      type: "SaleStatusChanged",
      aggregateType: "Sale",
      aggregateId: id,
      payload: { from: sale.status, to: status },
    });
    return updated;
  }

  submit(id: string) { return this.changeStatus(id, "PENDING_APPROVAL"); }
  approve(id: string) { return this.changeStatus(id, "APPROVED"); }
  closeWon(id: string) { return this.changeStatus(id, "WON"); }
  closeLost(id: string) { return this.changeStatus(id, "LOST"); }
  cancel(id: string) { return this.changeStatus(id, "CANCELLED"); }
  close(id: string) { return this.changeStatus(id, "CLOSED"); }

  async finalizeDeal(id: string, dto: any = {}) {
    const key = resolveIdempotencyKey(dto?.idempotencyKey, ["sale-finalize", id, dto?.inventoryId]);
    const completed = readCompletedOperation(key);
    if (completed) return completed;

    const sale = await this.findOne(id);
    ensureTransition(sale.status, ["APPROVED"], "WON");
    if (!dto?.inventoryId) {
      throw new BadRequestException("inventoryId is required.");
    }

    const workflow = this.workflows.create({
      name: "sale-finalization",
      steps: [
        { name: "mark-sale-won" },
        { name: "mark-inventory-sold" },
        { name: "publish-sale-completed" },
      ],
    });

    try {
      const updatedSale = await this.changeStatus(id, "WON");
      this.workflows.completeStep(workflow.id, "mark-sale-won", { saleId: id });

      const inventory = await this.inventory.markSold(dto.inventoryId, {
        saleId: id,
        salePrice: dto?.salePrice ?? sale.total,
        idempotencyKey: `${key}:inventory`,
      });
      this.workflows.completeStep(workflow.id, "mark-inventory-sold", inventory);

      const event = this.events.create({
        type: "SaleCompleted",
        aggregateType: "Sale",
        aggregateId: id,
        payload: cleanFlowData({
          inventoryId: dto.inventoryId,
          customerId: sale.customerId,
          vehicleId: sale.vehicleId,
          total: sale.total,
        }),
      });
      this.workflows.completeStep(workflow.id, "publish-sale-completed", event);

      return rememberCompletedOperation(key, "sale-finalization", {
        sale: updatedSale,
        inventory,
        workflow: this.workflows.findOne(workflow.id),
        event,
      });
    } catch (error) {
      this.workflows.fail(workflow.id, error instanceof Error ? error.message : error);
      throw error;
    }
  }

  async remove(id: string) {
    const sale = await this.findOne(id);
    SalesPolicy.ensureCanDelete(sale);
    return this.saleDelegate().delete({ where: { id } });
  }

  async dashboard() {
    const delegate = this.saleDelegate();
    const statuses = ["OPEN", "DRAFT", "PENDING_APPROVAL", "APPROVED", "WON", "LOST", "CANCELLED", "CLOSED"];
    const counts = await Promise.all(statuses.map((status) => delegate.count({ where: { status } })));
    const byStatus = Object.fromEntries(statuses.map((status, index) => [status, counts[index]]));
    const totalSales = counts.reduce((sum, value) => sum + Number(value ?? 0), 0);
    return {
      totalSales,
      ...Object.fromEntries(statuses.map((status) => [`${status.toLowerCase()}Sales`, byStatus[status]])),
      activeSales: Number(byStatus.OPEN) + Number(byStatus.DRAFT) + Number(byStatus.PENDING_APPROVAL) + Number(byStatus.APPROVED),
      winRate: totalSales ? Number(((Number(byStatus.WON) / totalSales) * 100).toFixed(2)) : 0,
    };
  }
}
