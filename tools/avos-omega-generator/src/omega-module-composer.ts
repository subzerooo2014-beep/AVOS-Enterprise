import { OmegaCapabilityBlueprint } from "./omega-generator.types";
import { toPascalCase } from "./omega-name.utilities";

export class OmegaModuleComposer {
  compose(
    namespace: string,
    capabilities: OmegaCapabilityBlueprint[],
  ): string {
    const imports = capabilities
      .map((item) => {
        const name = `${toPascalCase(item.capability)}Module`;
        return `import { ${name} } from "./${item.capability}/${item.capability}.module";`;
      })
      .join("\n");

    const modules = capabilities
      .map((item) => `    ${toPascalCase(item.capability)}Module,`)
      .join("\n");

    const className = `${toPascalCase(namespace)}GeneratedModule`;

    return `${imports}
import { Module } from "@nestjs/common";

@Module({
  imports: [
${modules}
  ],
  exports: [
${modules}
  ],
})
export class ${className} {}
`;
  }
}