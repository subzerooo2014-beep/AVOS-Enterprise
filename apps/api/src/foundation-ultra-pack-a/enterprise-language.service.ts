import { Injectable } from "@nestjs/common";
import { EnterpriseTerm } from "./foundation-ultra-pack-a.types";
import { FoundationFileStoreService } from "./foundation-file-store.service";

@Injectable()
export class EnterpriseLanguageService {
  constructor(private readonly store: FoundationFileStoreService) {
    this.seed();
  }

  private now(): string {
    return new Date().toISOString();
  }

  private id(): string {
    return `term:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`;
  }

  private seed(): void {
    if (this.list().length > 0) return;
    const definitions = [
      ["Capability", "Capability", "A reusable, contract-governed unit of business or technical ability.", "architecture"],
      ["Engine", "Engine", "A specialized runtime that performs a coherent class of intelligent or operational work.", "runtime"],
      ["Platform", "Platform", "A governed composition of capabilities, services, contracts and operating controls.", "architecture"],
      ["Product", "Product", "A market-facing value proposition built on certified AVOS platform capabilities.", "product"],
      ["Agent", "Agent", "A bounded autonomous actor operating under policies, permissions and Human Final Authority.", "intelligence"],
      ["Workflow", "Workflow", "An orchestrated sequence of governed activities and decisions.", "orchestration"],
      ["Decision", "Decision", "A traceable outcome with evidence, authority, confidence and audit history.", "governance"],
      ["Policy", "Policy", "A versioned rule that constrains or directs runtime behavior.", "governance"],
      ["Contract", "Contract", "A versioned compatibility boundary between AVOS assets.", "architecture"],
      ["Blueprint", "Blueprint", "The continuously synchronized architectural source of truth.", "architecture"],
      ["Digital DNA", "DigitalDna", "The identity, purpose, dependencies, rules, metrics and evolution record of an AVOS asset.", "identity"],
      ["Digital Genome", "DigitalGenome", "The complete architectural composition of a platform or ecosystem.", "identity"],
    ];
    for (const [term, canonicalName, definition, domain] of definitions) {
      this.create({
        term,
        canonicalName,
        definition,
        aliases: [],
        forbiddenAliases: [],
        domain,
        version: "1.0.0",
        status: "active",
      });
    }
  }

  create(input: Omit<EnterpriseTerm, "id" | "createdAt" | "updatedAt">): EnterpriseTerm {
    const timestamp = this.now();
    const record: EnterpriseTerm = {
      ...input,
      id: this.id(),
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    this.store.writeJson(`language/${record.id}.json`, record);
    return record;
  }

  list(): EnterpriseTerm[] {
    return this.store
      .listJson<EnterpriseTerm>("language")
      .sort((a, b) => a.term.localeCompare(b.term));
  }

  resolve(value: string): EnterpriseTerm | null {
    const normalized = value.trim().toLowerCase();
    return (
      this.list().find((term) => {
        const candidates = [term.term, term.canonicalName, ...term.aliases].map((x) => x.toLowerCase());
        return candidates.includes(normalized);
      }) ?? null
    );
  }

  validateText(text: string): {
    valid: boolean;
    forbiddenTerms: string[];
    knownTerms: string[];
  } {
    const normalized = text.toLowerCase();
    const terms = this.list();
    const forbiddenTerms = terms
      .flatMap((term) => term.forbiddenAliases)
      .filter((alias) => normalized.includes(alias.toLowerCase()));
    const knownTerms = terms
      .filter((term) => normalized.includes(term.term.toLowerCase()))
      .map((term) => term.term);
    return { valid: forbiddenTerms.length === 0, forbiddenTerms, knownTerms };
  }
}