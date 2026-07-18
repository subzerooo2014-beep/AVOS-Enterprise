import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";

@Injectable()
export class PlatformDependencyIdService {
  create(prefix: string): string {
    return `${prefix}:${Date.now()}:${randomUUID()}`;
  }
}