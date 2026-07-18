import { Injectable } from "@nestjs/common";
import { createHash } from "crypto";

@Injectable()
export class ChecksumService {
  calculate(content: string): string {
    return createHash("sha256").update(content).digest("hex");
  }
}
