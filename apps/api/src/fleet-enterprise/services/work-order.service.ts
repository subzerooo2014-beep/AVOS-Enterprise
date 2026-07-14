import { Injectable, NotFoundException } from "@nestjs/common";
import { MaintenancePolicy } from "../policies/maintenance.policy";
@Injectable()
export class WorkOrderService {
  private readonly orders = new Map<string, Record<string, unknown>>();
  constructor(private readonly policy: MaintenancePolicy) {}
  create(input: { fleetVehicleId: string; title: string; description: string; priority: string; estimatedCost?: number }) {
    this.policy.validate(input.title, input.description);
    const order = {
      id: `work_order_${Date.now()}`,
      ...input,
      status: "OPEN",
      createdAt: new Date().toISOString(),
    };
    this.orders.set(String(order.id), order);
    return order;
  }
  get(id: string) {
    const order = this.orders.get(id);
    if (!order) throw new NotFoundException(`Work order ${id} not found`);
    return order;
  }
  update(id: string, status: string, actualCost?: number) {
    const order = this.get(id);
    order.status = status;
    if (actualCost !== undefined) order.actualCost = actualCost;
    return order;
  }
  list() { return [...this.orders.values()]; }
}
