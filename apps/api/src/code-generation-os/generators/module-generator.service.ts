import { Injectable } from "@nestjs/common";
import { TemplateCompilerService } from "../template/template-compiler.service";
import { TemplateResolverService } from "../template/template-resolver.service";

@Injectable()
export class ModuleGeneratorService {
  constructor(
    private readonly resolver: TemplateResolverService,
    private readonly compiler: TemplateCompilerService,
  ) {}

  generate(name: string, options: Record<string, unknown> = {}): string {
    const className = this.toPascalCase(name);
    return this.compiler.compile(this.resolver.resolve("module"), {
      className,
      route: String(options.route ?? this.toKebabCase(name)),
    });
  }

  private toPascalCase(value: string): string {
    return value
      .replace(/[^a-zA-Z0-9]+(.)/g, (_match, chr: string) => chr.toUpperCase())
      .replace(/^[a-z]/, (chr) => chr.toUpperCase());
  }

  private toKebabCase(value: string): string {
    return value
      .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
      .replace(/[^a-zA-Z0-9]+/g, "-")
      .toLowerCase();
  }
}
