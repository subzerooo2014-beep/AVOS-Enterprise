import { Injectable } from "@nestjs/common";
import {
  FailureCategory,
  FailureDiagnosisRequest,
  FailureSeverity
} from "./failure-diagnosis.contracts";

@Injectable()
export class FailureClassificationService {
  classify(
    request: FailureDiagnosisRequest
  ): {
    category: FailureCategory;
    severity: FailureSeverity;
  } {
    const source = [
      request.message,
      request.stack ?? "",
      request.command ?? ""
    ]
      .join("\n")
      .toLowerCase();

    return {
      category: this.detectCategory(source),
      severity: this.detectSeverity(
        source,
        request.exitCode
      )
    };
  }

  private detectCategory(
    source: string
  ): FailureCategory {
    if (
      source.includes("ts2306") ||
      source.includes("ts2307") ||
      source.includes("typescript") ||
      source.includes("type error")
    ) {
      return "typescript";
    }

    if (
      source.includes("cannot find module") ||
      source.includes("module not found") ||
      source.includes("peer dependency") ||
      source.includes("dependency")
    ) {
      return "dependency";
    }

    if (
      source.includes("eaddrinuse") ||
      source.includes("connection refused") ||
      source.includes("uncaught") ||
      source.includes("runtime")
    ) {
      return "runtime";
    }

    if (
      source.includes("enoent") ||
      source.includes("eacces") ||
      source.includes("permission denied") ||
      source.includes("file not found")
    ) {
      return "filesystem";
    }

    if (
      source.includes("environment variable") ||
      source.includes("configuration") ||
      source.includes("config")
    ) {
      return "configuration";
    }

    if (
      source.includes("validation failed") ||
      source.includes("invalid payload") ||
      source.includes("bad request")
    ) {
      return "validation";
    }

    if (
      source.includes("unauthorized") ||
      source.includes("forbidden") ||
      source.includes("security")
    ) {
      return "security";
    }

    return "unknown";
  }

  private detectSeverity(
    source: string,
    exitCode?: number
  ): FailureSeverity {
    if (
      source.includes("fatal") ||
      source.includes("corruption") ||
      source.includes("data loss") ||
      source.includes("security breach")
    ) {
      return "critical";
    }

    if (
      source.includes("build failed") ||
      source.includes("compilation failed") ||
      source.includes("cannot start") ||
      (typeof exitCode === "number" && exitCode > 0)
    ) {
      return "high";
    }

    if (
      source.includes("warning") ||
      source.includes("deprecated")
    ) {
      return "low";
    }

    return "medium";
  }
}
