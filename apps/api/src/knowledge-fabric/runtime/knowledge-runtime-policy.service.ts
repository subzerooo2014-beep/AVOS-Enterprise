import { Injectable } from "@nestjs/common";
import { KnowledgeRecord } from "../knowledge.types";
import { KnowledgeRuntimePrincipal } from "./knowledge-runtime.types";

@Injectable()
export class KnowledgeRuntimePolicyService {
  canAccess(record: KnowledgeRecord, principal: KnowledgeRuntimePrincipal): boolean {
    const classification = record.dna.classification;
    if (classification === "PUBLIC") return true;
    if (principal.type === "SYSTEM") return true;
    if (classification === "INTERNAL") return principal.roles.length > 0 || principal.permissions.includes("knowledge:read");
    if (classification === "CONFIDENTIAL") {
      return principal.permissions.includes("knowledge:confidential:read") || record.dna.owners.includes(principal.id);
    }
    return principal.permissions.includes("knowledge:restricted:read") && record.dna.owners.includes(principal.id);
  }
}
