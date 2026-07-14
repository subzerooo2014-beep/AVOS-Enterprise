import { Injectable } from "@nestjs/common";
@Injectable()
export class AgentPolicy {
  validate(code: string, name: string, capability: string) {
    if (code.trim().length < 3) throw new Error("Agent code too short");
    if (name.trim().length < 3) throw new Error("Agent name too short");
    if (!capability) throw new Error("Agent capability required");
    return true;
  }
}
