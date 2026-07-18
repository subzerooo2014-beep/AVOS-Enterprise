import { Injectable } from "@nestjs/common";

@Injectable()
export class TemplateRegistry {
  private readonly templates = new Map<string, string>();

  register(id: string, template: string): void {
    this.templates.set(id, template);
  }

  resolve(id: string): string | undefined {
    return this.templates.get(id);
  }

  list() {
    return [...this.templates.keys()];
  }

  count(): number {
    return this.templates.size;
  }
}
