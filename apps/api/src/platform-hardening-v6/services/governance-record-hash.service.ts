import { Injectable } from "@nestjs/common";
import { createHash } from "node:crypto";

@Injectable()
export class GovernanceRecordHashService {
  create(payload: unknown): string {
    return createHash("sha256")
      .update(this.stableStringify(payload))
      .digest("hex");
  }

  private stableStringify(
    value: unknown,
  ): string {
    return JSON.stringify(
      this.normalize(value),
    );
  }

  private normalize(
    value: unknown,
  ): unknown {
    if (Array.isArray(value)) {
      return value.map((item) =>
        this.normalize(item),
      );
    }

    if (
      value &&
      typeof value === "object"
    ) {
      return Object.keys(
        value as Record<string, unknown>,
      )
        .sort()
        .reduce(
          (
            result,
            key,
          ) => {
            result[key] =
              this.normalize(
                (
                  value as Record<
                    string,
                    unknown
                  >
                )[key],
              );

            return result;
          },
          {} as Record<string, unknown>,
        );
    }

    return value;
  }
}
