import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import type { FlowBudget } from "./core-flow-economics.types";

@Injectable()
export class CoreFlowBudgetService {
  private readonly budgets = new Map<string, FlowBudget>();

  create(dto: any) {
    const budget: FlowBudget = {
      id: `budget_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      flow: String(dto?.flow ?? "unknown"),
      currency: String(dto?.currency ?? "AED"),
      limit: Math.max(Number(dto?.limit ?? 0), 0),
      consumed: 0,
      reserved: 0,
      status: "draft",
      createdAt: new Date().toISOString(),
    };
    this.budgets.set(budget.id, budget);
    return budget;
  }

  findAll(query: any = {}) {
    return Array.from(this.budgets.values())
      .filter((item) => !query.flow || item.flow === query.flow)
      .filter((item) => !query.status || item.status === query.status)
      .slice()
      .reverse();
  }

  findOne(id: string) {
    const budget = this.budgets.get(id);
    if (!budget) throw new NotFoundException("Flow budget not found");
    return budget;
  }

  activate(id: string) {
    const budget = this.findOne(id);
    budget.status = "active";
    return budget;
  }

  reserve(id: string, amount: number) {
    const budget = this.findOne(id);
    const normalized = Math.max(Number(amount || 0), 0);
    if (budget.consumed + budget.reserved + normalized > budget.limit) {
      budget.status = "exceeded";
      throw new BadRequestException("Flow budget limit exceeded.");
    }
    budget.reserved += normalized;
    return budget;
  }

  consume(id: string, amount: number) {
    const budget = this.findOne(id);
    const normalized = Math.max(Number(amount || 0), 0);
    if (budget.consumed + normalized > budget.limit) {
      budget.status = "exceeded";
      throw new BadRequestException("Flow budget limit exceeded.");
    }
    budget.consumed += normalized;
    budget.reserved = Math.max(budget.reserved - normalized, 0);
    return budget;
  }

  suspend(id: string) {
    const budget = this.findOne(id);
    budget.status = "suspended";
    return budget;
  }

  dashboard() {
    const budgets = Array.from(this.budgets.values());
    return {
      total: budgets.length,
      active: budgets.filter((item) => item.status === "active").length,
      exceeded: budgets.filter((item) => item.status === "exceeded").length,
      totalLimit: budgets.reduce((sum, item) => sum + item.limit, 0),
      totalConsumed: budgets.reduce((sum, item) => sum + item.consumed, 0),
      totalReserved: budgets.reduce((sum, item) => sum + item.reserved, 0),
      generatedAt: new Date().toISOString(),
    };
  }
}
