import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { SupportCase } from "./launch-readiness.types";

@Injectable()
export class SupportSlaService {
  private readonly cases = new Map<string, SupportCase>();

  createCase(input: Omit<SupportCase, "id" | "status" | "createdAt" | "updatedAt" | "resolvedAt">): SupportCase {
    const now = new Date().toISOString();
    const supportCase: SupportCase = { ...input, id: randomUUID(), status: "OPEN", createdAt: now, updatedAt: now };
    this.cases.set(supportCase.id, supportCase);
    return { ...supportCase };
  }

  updateStatus(id: string, status: SupportCase["status"]): SupportCase {
    const supportCase = this.requireCase(id);
    supportCase.status = status;
    supportCase.updatedAt = new Date().toISOString();

    if (["RESOLVED", "CLOSED"].includes(status)) {
      supportCase.resolvedAt = supportCase.updatedAt;
    }

    this.cases.set(id, supportCase);
    return { ...supportCase };
  }

  dashboard() {
    const cases = Array.from(this.cases.values());
    const now = Date.now();

    return {
      cases: cases.length,
      open: cases.filter((item) => item.status === "OPEN").length,
      inProgress: cases.filter((item) => item.status === "IN_PROGRESS").length,
      criticalOpen: cases.filter(
        (item) => item.severity === "CRITICAL" && !["RESOLVED", "CLOSED"].includes(item.status),
      ).length,
      slaBreaches: cases.filter((item) => {
        if (["RESOLVED", "CLOSED"].includes(item.status)) return false;
        return (now - new Date(item.createdAt).getTime()) / 60000 > item.slaMinutes;
      }).length,
      generatedAt: new Date().toISOString(),
    };
  }

  private requireCase(id: string): SupportCase {
    const value = this.cases.get(id);
    if (!value) throw new Error(`Support case not found: ${id}`);
    return value;
  }
}