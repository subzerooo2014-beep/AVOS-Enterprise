import { HttpException, Injectable } from "@nestjs/common";
import { ErrorCategory } from "../enums/error-category.enum";
import { IncidentSeverity } from "../enums/incident-severity.enum";
import { ErrorClassification } from "../interfaces/error-classification.interface";

@Injectable()
export class ErrorClassificationService {
  classify(error: unknown): ErrorClassification {
    const statusCode =
      error instanceof HttpException
        ? error.getStatus()
        : 500;

    if (statusCode === 400 || statusCode === 422) {
      return {
        category: ErrorCategory.VALIDATION,
        severity: IncidentSeverity.WARNING,
        statusCode,
        retryable: false,
        operational: true,
      };
    }

    if (statusCode === 401) {
      return {
        category: ErrorCategory.AUTHENTICATION,
        severity: IncidentSeverity.WARNING,
        statusCode,
        retryable: false,
        operational: true,
      };
    }

    if (statusCode === 403) {
      return {
        category: ErrorCategory.AUTHORIZATION,
        severity: IncidentSeverity.WARNING,
        statusCode,
        retryable: false,
        operational: true,
      };
    }

    if (statusCode === 404) {
      return {
        category: ErrorCategory.NOT_FOUND,
        severity: IncidentSeverity.INFO,
        statusCode,
        retryable: false,
        operational: true,
      };
    }

    if (statusCode === 409) {
      return {
        category: ErrorCategory.CONFLICT,
        severity: IncidentSeverity.WARNING,
        statusCode,
        retryable: false,
        operational: true,
      };
    }

    if (statusCode === 429) {
      return {
        category: ErrorCategory.RATE_LIMIT,
        severity: IncidentSeverity.WARNING,
        statusCode,
        retryable: true,
        operational: true,
      };
    }

    if (
      statusCode === 408 ||
      statusCode === 504 ||
      this.containsAny(error, [
        "timeout",
        "timed out",
        "operationtimeouterror",
      ])
    ) {
      return {
        category: ErrorCategory.TIMEOUT,
        severity: IncidentSeverity.ERROR,
        statusCode,
        retryable: true,
        operational: true,
      };
    }

    if (
      this.containsAny(error, [
        "prisma",
        "database",
        "postgres",
        "sql",
        "connection pool",
      ])
    ) {
      return {
        category: ErrorCategory.DATABASE,
        severity: IncidentSeverity.CRITICAL,
        statusCode,
        retryable: true,
        operational: false,
      };
    }

    if (
      this.containsAny(error, [
        "fetch failed",
        "econnrefused",
        "enotfound",
        "external service",
        "upstream",
      ])
    ) {
      return {
        category: ErrorCategory.EXTERNAL_SERVICE,
        severity: IncidentSeverity.ERROR,
        statusCode,
        retryable: true,
        operational: true,
      };
    }

    if (statusCode >= 500) {
      return {
        category: ErrorCategory.INTERNAL,
        severity: IncidentSeverity.ERROR,
        statusCode,
        retryable: false,
        operational: false,
      };
    }

    return {
      category: ErrorCategory.UNKNOWN,
      severity: IncidentSeverity.WARNING,
      statusCode,
      retryable: false,
      operational: true,
    };
  }

  private containsAny(
    error: unknown,
    values: string[],
  ): boolean {
    const text = this.toSearchableText(error);

    return values.some((value) =>
      text.includes(value.toLowerCase()),
    );
  }

  private toSearchableText(error: unknown): string {
    if (error instanceof Error) {
      return `${error.name} ${error.message} ${error.stack ?? ""}`
        .toLowerCase();
    }

    try {
      return JSON.stringify(error).toLowerCase();
    } catch {
      return String(error).toLowerCase();
    }
  }
}
