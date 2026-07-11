import { createHash } from "crypto";
import {
  canonicalizeGovernanceJson,
} from "./governance-canonical-json.util";

export function governanceSha256Text(
  value: string,
): string {
  return createHash("sha256")
    .update(value, "utf8")
    .digest("hex");
}

export function governanceSha256Json(
  value: unknown,
): string {
  return governanceSha256Text(
    canonicalizeGovernanceJson(value),
  );
}

export function buildGovernanceAuditHash(
  input: {
    sequence: number;
    type: string;
    aggregateType: string;
    aggregateId: string;
    actor: unknown;
    payloadHash: string;
    previousHash: string;
    createdAt: string;
  },
): string {
  return governanceSha256Json(input);
}
