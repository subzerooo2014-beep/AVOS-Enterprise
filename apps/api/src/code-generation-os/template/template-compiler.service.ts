import { Injectable } from "@nestjs/common";
import { TemplateEngineService } from "./template-engine.service";

@Injectable()
export class TemplateCompilerService {
  constructor(private readonly engine: TemplateEngineService) {}

  compile(template: string, variables: Record<string, string>): string {
    return this.engine.render(template, variables).trim() + "\n";
  }
}
