import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";

@Injectable()
export class PlatformLifecycleIdService {
  create(): string {
    return randomUUID();
  }

  now(): string {
    return new Date().toISOString();
  }
}