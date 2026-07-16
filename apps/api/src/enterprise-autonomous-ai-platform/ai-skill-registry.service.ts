import { Injectable } from "@nestjs/common";
import type { AiSkillRecord } from "./enterprise-autonomous-ai.types";

@Injectable()
export class AiSkillRegistryService {
  private readonly skills = new Map<string, AiSkillRecord>();

  register(skill: AiSkillRecord): AiSkillRecord {
    this.skills.set(skill.id, { ...skill });
    return { ...skill };
  }

  list(): AiSkillRecord[] {
    return Array.from(this.skills.values()).map((skill) => ({ ...skill }));
  }

  count(): number {
    return this.skills.size;
  }
}
