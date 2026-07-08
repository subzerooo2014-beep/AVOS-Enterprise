import { Injectable } from "@nestjs/common";

@Injectable()
export class AiToolRegistryService {
  private tools = new Map<string, Function>();

  register(name: string, fn: Function) {
    this.tools.set(name, fn);
  }

  async execute(name: string, payload: any) {
    const tool = this.tools.get(name);
    if (!tool) return { error: "TOOL_NOT_FOUND", name };
    return tool(payload);
  }
}
