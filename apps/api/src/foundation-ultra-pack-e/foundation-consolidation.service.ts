import { Injectable } from "@nestjs/common";
import * as fs from "fs";
import * as path from "path";
import {
  FoundationConsolidation,
  FoundationPackSnapshot,
} from "./foundation-ultra-pack-e.types";
import { FoundationUltraPackEFileStoreService } from "./foundation-ultra-pack-e-file-store.service";

@Injectable()
export class FoundationConsolidationService {
  constructor(
    private readonly store: FoundationUltraPackEFileStoreService,
  ) {}

  private now(): string {
    return new Date().toISOString();
  }

  private id(prefix: string): string {
    return `${prefix}:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`;
  }

  private readCertification(
    folder: string,
    key: FoundationPackSnapshot["key"],
    name: string,
    version: string,
  ): FoundationPackSnapshot {
    const target = path.join(
      process.cwd(),
      ".avos",
      folder,
      "certification",
      "latest.json",
    );

    if (!fs.existsSync(target)) {
      return {
        key,
        name,
        version,
        certified: false,
        score: 0,
        checks: {},
      };
    }

    try {
      const parsed = JSON.parse(fs.readFileSync(target, "utf8")) as {
        version?: string;
        status?: string;
        score?: number;
        checks?: Record<string, boolean>;
      };

      return {
        key,
        name,
        version: parsed.version ?? version,
        certified:
          parsed.status === "certified" &&
          parsed.score === 100,
        score: parsed.score ?? 0,
        checks: parsed.checks ?? {},
      };
    } catch {
      return {
        key,
        name,
        version,
        certified: false,
        score: 0,
        checks: {},
      };
    }
  }

  snapshot(): FoundationPackSnapshot[] {
    return [
      this.readCertification(
        "foundation-ultra-pack-a",
        "A",
        "Digital Constitution, Enterprise Language, Digital DNA and Living Blueprint",
        "FUPA-1.0.0",
      ),
      this.readCertification(
        "foundation-ultra-pack-b",
        "B",
        "Data, Metadata and Contracts",
        "FUPB-1.0.0",
      ),
      this.readCertification(
        "foundation-ultra-pack-c",
        "C",
        "Governance, Policy, Security and Privacy",
        "FUPC-1.0.0",
      ),
      this.readCertification(
        "foundation-ultra-pack-d",
        "D",
        "Architecture Intelligence, Runtime Observability and Evolution Control",
        "FUPD-1.0.0",
      ),
    ];
  }

  consolidate(approvedBy?: string): FoundationConsolidation {
    const packs = this.snapshot();

    const checks: Record<string, boolean> = {
      packACertified: packs.some((pack) => pack.key === "A" && pack.certified),
      packBCertified: packs.some((pack) => pack.key === "B" && pack.certified),
      packCCertified: packs.some((pack) => pack.key === "C" && pack.certified),
      packDCertified: packs.some((pack) => pack.key === "D" && pack.certified),
      allScores100: packs.every((pack) => pack.score === 100),
      humanFinalAuthority:
        approvedBy === undefined || approvedBy.startsWith("human:"),
      globalComplianceReadinessGate: packs.every((pack) =>
        Object.entries(pack.checks).some(
          ([key, value]) =>
            key === "globalComplianceReadinessGate" &&
            value === true,
        ),
      ),
      stableCoreArchitecture: packs.every((pack) =>
        Object.entries(pack.checks).some(
          ([key, value]) =>
            key === "stableCoreArchitecture" &&
            value === true,
        ),
      ),
      auditability: packs.every((pack) =>
        Object.entries(pack.checks).some(
          ([key, value]) =>
            key === "auditability" &&
            value === true,
        ),
      ),
    };

    const passed = Object.values(checks).every(Boolean);
    const score = Math.round(
      (Object.values(checks).filter(Boolean).length /
        Object.keys(checks).length) *
        100,
    );

    const result: FoundationConsolidation = {
      id: this.id("foundation-consolidation"),
      version: "AVOS-FOUNDATION-ULTRA-1.0.0",
      status:
        passed && approvedBy
          ? "certified"
          : passed
            ? "passed"
            : "failed",
      score,
      packs: [
        ...packs,
        {
          key: "E",
          name: "Value Intelligence, Trust, Decision Governance and Foundation Consolidation",
          version: "FUPE-1.0.0",
          certified: Boolean(approvedBy),
          score: passed ? 100 : score,
          checks,
        },
      ],
      checks,
      approvedBy,
      createdAt: this.now(),
    };

    this.store.writeJson("consolidation/latest.json", result);
    this.store.writeJson(`consolidation/${result.id}.json`, result);

    return result;
  }

  status(): FoundationConsolidation | null {
    return this.store.readJson<FoundationConsolidation | null>(
      "consolidation/latest.json",
      null,
    );
  }
}