import { Injectable } from "@nestjs/common";
import { TemplateRegistry } from "../registry/template.registry";

@Injectable()
export class TemplateResolverService {
  constructor(private readonly registry: TemplateRegistry) {}

  resolve(id: string): string {
    const template = this.registry.resolve(id);
    if (!template) {
      throw new Error(`Template not found: ${id}`);
    }
    return template;
  }
}
