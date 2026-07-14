import { Injectable } from "@nestjs/common";
@Injectable()
export class KnowledgePolicy {
  validate(type: string, label: string) {
    if (!type || !label) throw new Error("Knowledge node type and label required");
    return true;
  }
}
