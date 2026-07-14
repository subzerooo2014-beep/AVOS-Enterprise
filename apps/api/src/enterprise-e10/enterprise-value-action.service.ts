import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { EnterpriseValueAction } from "./enterprise-e10.types";
import { EnterpriseValueOpportunityService } from "./enterprise-value-opportunity.service";

@Injectable()
export class EnterpriseValueActionService {
  private readonly actions = new Map<string, EnterpriseValueAction>();

  constructor(
    private readonly opportunities: EnterpriseValueOpportunityService,
  ) {}

  create(opportunityId: string, action: string): EnterpriseValueAction {
    this.opportunities.get(opportunityId);

    const valueAction: EnterpriseValueAction = {
      id: randomUUID(),
      opportunityId,
      action,
      approved: true,
      executed: false,
      createdAt: new Date().toISOString(),
    };

    this.actions.set(valueAction.id, valueAction);
    return valueAction;
  }

  execute(id: string): EnterpriseValueAction {
    const action = this.actions.get(id);
    if (!action) {
      throw new Error(`Value action not found: ${id}`);
    }

    if (!action.approved) {
      throw new Error(`Value action is not approved: ${id}`);
    }

    action.executed = true;
    action.executedAt = new Date().toISOString();
    return action;
  }

  list(): EnterpriseValueAction[] {
    return [...this.actions.values()];
  }

  count(): number {
    return this.actions.size;
  }

  executedCount(): number {
    return this.list().filter((item) => item.executed).length;
  }
}