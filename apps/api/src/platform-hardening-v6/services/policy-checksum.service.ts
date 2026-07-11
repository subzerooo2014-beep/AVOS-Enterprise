import { Injectable } from "@nestjs/common";
import { createHash } from "node:crypto";
import { PolicyVersionPayload } from "../interfaces/policy-version-payload.interface";

@Injectable()
export class PolicyChecksumService {
  create(payload: PolicyVersionPayload): string {
    const normalized = {
      id: payload.id,
      name: payload.name.trim(),
      description: payload.description.trim(),
      enabled: payload.enabled,
      methods: [...payload.methods]
        .map((item) => item.toUpperCase())
        .sort(),
      pathPrefixes: [...payload.pathPrefixes]
        .map((item) => item.trim())
        .sort(),
      requireApprovalToken:
        payload.requireApprovalToken,
      blockInProduction:
        payload.blockInProduction,
      severity: payload.severity,
    };

    return createHash("sha256")
      .update(JSON.stringify(normalized))
      .digest("hex");
  }
}
