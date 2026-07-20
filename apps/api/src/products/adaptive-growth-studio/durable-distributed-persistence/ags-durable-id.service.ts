import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";

@Injectable()
export class AgsDurableIdService {
  create(prefix: string): string {
    return prefix + ":" + randomUUID();
  }
}