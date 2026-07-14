import { Injectable } from "@nestjs/common";
@Injectable()
export class MemoryPolicy {
  validate(namespace: string, key: string, importance: number) {
    if (!namespace || !key) throw new Error("Memory namespace and key required");
    if (importance < 0 || importance > 100) throw new Error("Invalid memory importance");
    return true;
  }
}
