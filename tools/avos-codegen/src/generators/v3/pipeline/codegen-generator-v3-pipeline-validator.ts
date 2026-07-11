import {
  CodeGenGeneratorV3ExtendedRequest,
} from "../contracts/codegen-generator-v3-extended.contracts";

export class CodeGenGeneratorV3PipelineValidator {
  validate(
    request:
      CodeGenGeneratorV3ExtendedRequest,
  ): string[] {
    const errors: string[] = [];

    if (
      request.includePrismaAdapter &&
      !request.includePrisma
    ) {
      errors.push(
        "Prisma adapter generation requires Prisma model generation",
      );
    }

    if (
      request.includePrismaAdapter &&
      !request.includeRepository
    ) {
      errors.push(
        "Prisma adapter generation requires repository generation",
      );
    }

    if (
      request.includeIntegrationTests &&
      !request.includeRepository
    ) {
      errors.push(
        "Integration test generation requires repository generation",
      );
    }

    if (
      request.includeOpenApi &&
      !request.includeController
    ) {
      errors.push(
        "OpenAPI generation requires controller generation",
      );
    }

    return errors;
  }
}
