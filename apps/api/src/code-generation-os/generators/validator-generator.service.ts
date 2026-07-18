import { Injectable } from "@nestjs/common";

@Injectable()
export class ValidatorGeneratorService {
  generate(name: string): string {
    const className = name.replace(/[^a-zA-Z0-9]/g, "");
    return `export class ${className}Validator {
  validate(input: unknown): { valid: boolean; errors: string[] } {
    return { valid: input !== null && input !== undefined, errors: [] };
  }
}
`;
  }
}
