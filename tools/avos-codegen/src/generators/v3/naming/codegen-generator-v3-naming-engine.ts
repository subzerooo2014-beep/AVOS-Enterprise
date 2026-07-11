import {
  CodeGenGeneratorV3Names,
  CodeGenGeneratorV3Request,
} from "../contracts/codegen-generator-v3.contracts";

export class CodeGenGeneratorV3NamingEngine {
  create(
    request:
      CodeGenGeneratorV3Request,
  ): CodeGenGeneratorV3Names {
    const moduleName =
      request.moduleName.trim();

    const entityName =
      request.entityName?.trim() ||
      moduleName;

    const routeName =
      request.routeName?.trim() ||
      this.toKebabCase(
        moduleName,
      );

    return {
      moduleName,
      entityName,
      routeName,
      pascalModule:
        this.toPascalCase(
          moduleName,
        ),
      pascalEntity:
        this.toPascalCase(
          entityName,
        ),
      camelModule:
        this.toCamelCase(
          moduleName,
        ),
      camelEntity:
        this.toCamelCase(
          entityName,
        ),
      kebabModule:
        this.toKebabCase(
          moduleName,
        ),
      kebabEntity:
        this.toKebabCase(
          entityName,
        ),
      constantModule:
        this.toConstantCase(
          moduleName,
        ),
    };
  }

  toWords(
    value: string,
  ): string[] {
    return value
      .replace(
        /([a-z0-9])([A-Z])/g,
        "$1 $2",
      )
      .replace(
        /[^A-Za-z0-9]+/g,
        " ",
      )
      .trim()
      .split(/\s+/)
      .filter(Boolean);
  }

  toPascalCase(
    value: string,
  ): string {
    return this.toWords(value)
      .map(
        (word) =>
          word.charAt(0).toUpperCase() +
          word.slice(1).toLowerCase(),
      )
      .join("");
  }

  toCamelCase(
    value: string,
  ): string {
    const pascal =
      this.toPascalCase(value);

    return pascal
      ? pascal.charAt(0).toLowerCase() +
          pascal.slice(1)
      : "";
  }

  toKebabCase(
    value: string,
  ): string {
    return this.toWords(value)
      .map(
        (word) =>
          word.toLowerCase(),
      )
      .join("-");
  }

  toConstantCase(
    value: string,
  ): string {
    return this.toWords(value)
      .map(
        (word) =>
          word.toUpperCase(),
      )
      .join("_");
  }
}
