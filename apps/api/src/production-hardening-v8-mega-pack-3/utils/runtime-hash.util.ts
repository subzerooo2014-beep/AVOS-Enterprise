import { createHash } from "crypto";
import { canonicalizeJson } from "./canonical-json.util";

export function sha256Text(value: string): string {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

export function sha256Json(value: unknown): string {
  return sha256Text(canonicalizeJson(value));
}

export function buildEvidenceEntryHash(input: {
  sequence: number;
  type: string;
  aggregateType: string;
  aggregateId: string;
  actor: unknown;
  payloadHash: string;
  previousHash: string;
  createdAt: string;
}): string {
  return sha256Json({
    sequence: input.sequence,
    type: input.type,
    aggregateType: input.aggregateType,
    aggregateId: input.aggregateId,
    actor: input.actor,
    payloadHash: input.payloadHash,
    previousHash: input.previousHash,
    createdAt: input.createdAt,
  });
}
