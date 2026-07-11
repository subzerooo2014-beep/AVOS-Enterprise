import { Injectable } from "@nestjs/common";
import { createHash } from "node:crypto";
import { ErrorClassification } from "../interfaces/error-classification.interface";

@Injectable()
export class FailureFingerprintService {
  create(input: {
    error: unknown;
    classification: ErrorClassification;
    method?: string;
    path?: string;
  }): string {
    const normalizedMessage =
      this.normalizeMessage(this.getMessage(input.error));

    const source = [
      input.classification.category,
      input.classification.statusCode,
      input.method ?? "unknown-method",
      this.normalizePath(input.path ?? "unknown-path"),
      normalizedMessage,
    ].join("|");

    return createHash("sha256")
      .update(source)
      .digest("hex")
      .slice(0, 24);
  }

  private getMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }

    if (
      typeof error === "object" &&
      error !== null &&
      "message" in error
    ) {
      return String(
        (error as { message?: unknown }).message ?? "",
      );
    }

    return String(error);
  }

  private normalizeMessage(message: string): string {
    return message
      .toLowerCase()
      .replace(
        /[0-9a-f]{8}-[0-9a-f-]{27,}/gi,
        "{uuid}",
      )
      .replace(/\b\d+\b/g, "{number}")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 500);
  }

  private normalizePath(path: string): string {
    return path
      .replace(
        /\/[0-9a-f]{8}-[0-9a-f-]{27,}/gi,
        "/{id}",
      )
      .replace(/\/\d+/g, "/{id}")
      .split("?")[0];
  }
}
