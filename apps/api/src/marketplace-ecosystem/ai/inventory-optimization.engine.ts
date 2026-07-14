import { Injectable } from "@nestjs/common";
@Injectable()
export class InventoryOptimizationEngine {
  evaluate(input: { stock: number; monthlySales: number; leadTimeDays: number }) {
    const reorderPoint = Math.ceil((input.monthlySales / 30) * input.leadTimeDays);
    return {
      reorderPoint,
      action: input.stock <= reorderPoint ? "REORDER" : "HOLD",
    };
  }
}
