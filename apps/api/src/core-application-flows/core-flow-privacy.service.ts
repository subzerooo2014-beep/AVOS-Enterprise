import { Injectable } from "@nestjs/common";

@Injectable()
export class CoreFlowPrivacyService {
  private readonly sensitiveFields = new Set([
    "password",
    "token",
    "secret",
    "nationalId",
    "passportNumber",
    "creditCard",
    "cvv",
  ]);

  redact(payload: unknown): unknown {
    if (Array.isArray(payload)) {
      return payload.map((item) => this.redact(item));
    }

    if (payload && typeof payload === "object") {
      return Object.fromEntries(
        Object.entries(payload as Record<string, unknown>).map(
          ([key, value]) => [
            key,
            this.sensitiveFields.has(key)
              ? "[REDACTED]"
              : this.redact(value),
          ],
        ),
      );
    }

    return payload;
  }

  classify(payload: Record<string, unknown>) {
    const detected = Object.keys(payload).filter((key) =>
      this.sensitiveFields.has(key),
    );

    return {
      classification:
        detected.length > 0 ? "restricted" : "internal",
      sensitiveFields: detected,
      inspectedAt: new Date().toISOString(),
    };
  }
}
