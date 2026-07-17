import { Injectable, NotFoundException } from "@nestjs/common";
import { EnterpriseDecisionRecord } from "../contracts/enterprise-decision-intelligence.contracts";

@Injectable()
export class EnterpriseDecisionMemoryService {
  private readonly records = new Map<string, EnterpriseDecisionRecord>();
  save(record: EnterpriseDecisionRecord): EnterpriseDecisionRecord { this.records.set(record.id, structuredClone(record)); return structuredClone(record); }
  findAll(): EnterpriseDecisionRecord[] { return Array.from(this.records.values()).sort((a, b) => b.createdAt.localeCompare(a.createdAt)).map(record => structuredClone(record)); }
  findById(id: string): EnterpriseDecisionRecord { const record = this.records.get(id); if (!record) throw new NotFoundException(`Decision ${id} was not found.`); return structuredClone(record); }
  count(): number { return this.records.size; }
}