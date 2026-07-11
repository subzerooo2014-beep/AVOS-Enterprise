import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  GovernanceJsonValue,
  RuntimeExecutionLock,
  RuntimeLockStatus,
} from "../contracts";
import {
  AcquireRuntimeLockDto,
  ReleaseRuntimeLockDto,
} from "../dto";
import {
  RuntimeGovernanceStore,
} from "../stores/runtime-governance.store";

@Injectable()
export class RuntimeExecutionLockService {
  constructor(
    private readonly store:
      RuntimeGovernanceStore,
  ) {}

  acquire(
    dto:
      AcquireRuntimeLockDto,
  ): RuntimeExecutionLock {
    this.expireLocks();

    const conflict =
      this.store
        .listExecutionLocks()
        .find(
          (lock) =>
            lock.status ===
              RuntimeLockStatus.ACTIVE &&
            lock.key === dto.key,
        );

    if (conflict) {
      throw new BadRequestException(
        `Runtime lock already exists for key ${dto.key}`,
      );
    }

    const acquiredAt =
      new Date().toISOString();

    const expiresAt =
      new Date(
        Date.now() +
        dto.ttlSeconds * 1000,
      ).toISOString();

    const lock:
      RuntimeExecutionLock = {
      id:
        randomUUID(),
      key:
        dto.key,
      type:
        dto.type,
      status:
        RuntimeLockStatus.ACTIVE,
      environment:
        dto.environment,
      namespace:
        dto.namespace,
      service:
        dto.service,
      resourceId:
        dto.resourceId,
      changeExecutionId:
        dto.changeExecutionId,
      owner:
        dto.actor,
      acquiredAt,
      expiresAt,
      metadata:
        (dto.metadata ?? {}) as Record<
          string,
          GovernanceJsonValue
        >,
    };

    return this.store
      .saveExecutionLock(lock);
  }

  release(
    id: string,
    dto:
      ReleaseRuntimeLockDto,
  ): RuntimeExecutionLock {
    const lock =
      this.get(id);

    if (
      lock.status !==
      RuntimeLockStatus.ACTIVE
    ) {
      throw new BadRequestException(
        `Runtime lock is not active. Current status: ${lock.status}`,
      );
    }

    lock.status =
      RuntimeLockStatus.RELEASED;

    lock.releasedAt =
      new Date().toISOString();

    lock.releaseReason =
      dto.reason;

    lock.metadata = {
      ...lock.metadata,
      releasedBy:
        dto.actor.id,
    };

    return this.store
      .saveExecutionLock(lock);
  }

  forceRelease(
    id: string,
    dto:
      ReleaseRuntimeLockDto,
  ): RuntimeExecutionLock {
    const lock =
      this.get(id);

    lock.status =
      RuntimeLockStatus.FORCE_RELEASED;

    lock.releasedAt =
      new Date().toISOString();

    lock.releaseReason =
      dto.reason;

    lock.metadata = {
      ...lock.metadata,
      forceReleasedBy:
        dto.actor.id,
    };

    return this.store
      .saveExecutionLock(lock);
  }

  list():
    RuntimeExecutionLock[] {
    this.expireLocks();

    return this.store
      .listExecutionLocks();
  }

  get(
    id: string,
  ): RuntimeExecutionLock {
    const lock =
      this.store
        .getExecutionLock(id);

    if (!lock) {
      throw new NotFoundException(
        `Runtime execution lock ${id} was not found`,
      );
    }

    return lock;
  }

  private expireLocks(): void {
    const now =
      Date.now();

    for (
      const lock of
      this.store
        .listExecutionLocks()
    ) {
      if (
        lock.status ===
          RuntimeLockStatus.ACTIVE &&
        new Date(
          lock.expiresAt,
        ).getTime() <= now
      ) {
        lock.status =
          RuntimeLockStatus.EXPIRED;

        lock.releasedAt =
          new Date().toISOString();

        lock.releaseReason =
          "Lock TTL expired";

        this.store
          .saveExecutionLock(lock);
      }
    }
  }
}
