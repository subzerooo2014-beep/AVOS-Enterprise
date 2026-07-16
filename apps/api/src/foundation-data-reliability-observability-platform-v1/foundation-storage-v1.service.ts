import { Injectable, NotFoundException } from "@nestjs/common";
import { createHash } from "crypto";
import type { FoundationStorageObjectV1 } from "./foundation-data-reliability-observability-v1.types";

@Injectable()
export class FoundationStorageV1Service {
  private readonly objects = new Map<string, FoundationStorageObjectV1>();

  put(
    namespace: string,
    key: string,
    contentType: string,
    content: string,
    metadata: Record<string, unknown> = {},
  ): FoundationStorageObjectV1 {
    const id = `${namespace}:${key}`;
    const existing = this.objects.get(id);
    const now = new Date().toISOString();

    const object: FoundationStorageObjectV1 = {
      id,
      namespace,
      key,
      contentType,
      size: Buffer.byteLength(content, "utf8"),
      checksum: createHash("sha256").update(content).digest("hex"),
      metadata: { ...metadata, content },
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };

    this.objects.set(id, object);
    return this.clone(object);
  }

  get(id: string): FoundationStorageObjectV1 {
    const object = this.objects.get(id);

    if (!object) {
      throw new NotFoundException(`Storage object '${id}' was not found.`);
    }

    return this.clone(object);
  }

  delete(id: string): boolean {
    return this.objects.delete(id);
  }

  list(): FoundationStorageObjectV1[] {
    return Array.from(this.objects.values()).map((item) => this.clone(item));
  }

  count(): number {
    return this.objects.size;
  }

  private clone(item: FoundationStorageObjectV1): FoundationStorageObjectV1 {
    return { ...item, metadata: { ...item.metadata } };
  }
}
