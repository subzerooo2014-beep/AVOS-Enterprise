import { Injectable, NotFoundException } from "@nestjs/common";
import { createHash } from "crypto";
import { FoundationStorageV1Service } from "./foundation-storage-v1.service";
import type { FoundationBackupV1 } from "./foundation-data-reliability-observability-v1.types";

@Injectable()
export class FoundationBackupRestoreV1Service {
  private readonly backups = new Map<string, FoundationBackupV1>();

  constructor(private readonly storage: FoundationStorageV1Service) {}

  create(scope: string, objectIds: string[]): FoundationBackupV1 {
    const existingObjects = objectIds.map((id) => this.storage.get(id));
    const checksumSource = existingObjects.map((item) => item.checksum).join(":");

    const backup: FoundationBackupV1 = {
      id: `foundation-backup-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
      scope,
      status: "CREATED",
      objectIds: [...objectIds],
      checksum: createHash("sha256").update(checksumSource).digest("hex"),
      createdAt: new Date().toISOString(),
    };

    this.backups.set(backup.id, backup);
    return this.clone(backup);
  }

  verify(id: string): FoundationBackupV1 {
    const backup = this.requireBackup(id);
    const objects = backup.objectIds.map((objectId) => this.storage.get(objectId));
    const checksumSource = objects.map((item) => item.checksum).join(":");
    const checksum = createHash("sha256").update(checksumSource).digest("hex");

    backup.status = checksum === backup.checksum ? "VERIFIED" : "FAILED";
    return this.clone(backup);
  }

  restore(id: string): FoundationBackupV1 {
    const backup = this.requireBackup(id);

    if (backup.status !== "VERIFIED") {
      throw new Error(`Backup '${id}' must be verified before restore.`);
    }

    backup.status = "RESTORED";
    backup.restoredAt = new Date().toISOString();
    return this.clone(backup);
  }

  list(): FoundationBackupV1[] {
    return Array.from(this.backups.values()).map((item) => this.clone(item));
  }

  count(): number {
    return this.backups.size;
  }

  verifiedCount(): number {
    return this.list().filter((item) => item.status === "VERIFIED").length;
  }

  private requireBackup(id: string): FoundationBackupV1 {
    const backup = this.backups.get(id);

    if (!backup) {
      throw new NotFoundException(`Backup '${id}' was not found.`);
    }

    return backup;
  }

  private clone(item: FoundationBackupV1): FoundationBackupV1 {
    return { ...item, objectIds: [...item.objectIds] };
  }
}
