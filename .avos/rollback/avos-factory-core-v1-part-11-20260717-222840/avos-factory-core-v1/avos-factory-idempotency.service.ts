import {
  ConflictException,
  Injectable
} from "@nestjs/common";
import {
  FactoryIdempotencyRecord
} from "./avos-factory-operational.contracts";
import {
  AvosFactoryGovernanceService
} from "./avos-factory-governance.service";

@Injectable()
export class AvosFactoryIdempotencyService {
  private readonly records =
    new Map<string, FactoryIdempotencyRecord>();

  constructor(
    private readonly governance:
      AvosFactoryGovernanceService
  ) {}

  begin(
    key: string,
    operation: string,
    actor: string
  ): FactoryIdempotencyRecord {
    this.cleanupExpired();

    const existing = this.records.get(key);

    if (existing) {
      if (existing.status === "processing") {
        throw new ConflictException(
          `Idempotent operation is already processing: ${key}`
        );
      }

      return structuredClone(existing);
    }

    const now = new Date();
    const retentionMinutes =
      this.governance.getPolicy()
        .idempotencyRetentionMinutes;

    const record: FactoryIdempotencyRecord = {
      key,
      operation,
      actor,
      status: "processing",
      createdAt: now.toISOString(),
      expiresAt: new Date(
        now.getTime() +
        retentionMinutes * 60 * 1000
      ).toISOString()
    };

    this.records.set(key, record);
    return structuredClone(record);
  }

  complete<T>(
    key: string,
    result: T
  ): FactoryIdempotencyRecord<T> {
    const existing =
      this.records.get(key);

    if (!existing) {
      throw new Error(
        `Idempotency record was not found: ${key}`
      );
    }

    const completed: FactoryIdempotencyRecord<T> = {
      ...existing,
      status: "completed",
      result: structuredClone(result)
    };

    this.records.set(key, completed);
    return structuredClone(completed);
  }

  fail(
    key: string,
    error: string
  ): FactoryIdempotencyRecord {
    const existing =
      this.records.get(key);

    if (!existing) {
      throw new Error(
        `Idempotency record was not found: ${key}`
      );
    }

    const failed: FactoryIdempotencyRecord = {
      ...existing,
      status: "failed",
      error
    };

    this.records.set(key, failed);
    return structuredClone(failed);
  }

  get(
    key: string
  ): FactoryIdempotencyRecord | undefined {
    this.cleanupExpired();

    const record =
      this.records.get(key);

    return record
      ? structuredClone(record)
      : undefined;
  }

  count(): number {
    this.cleanupExpired();
    return this.records.size;
  }

  private cleanupExpired(): void {
    const now = Date.now();

    for (const [key, record] of this.records.entries()) {
      if (
        new Date(record.expiresAt).getTime() <= now
      ) {
        this.records.delete(key);
      }
    }
  }
}
