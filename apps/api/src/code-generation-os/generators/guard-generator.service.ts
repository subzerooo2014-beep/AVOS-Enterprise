import { Injectable } from "@nestjs/common";

@Injectable()
export class GuardGeneratorService {
  generate(name: string): string {
    const className = name.replace(/[^a-zA-Z0-9]/g, "");
    return `import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";

@Injectable()
export class ${className}Guard implements CanActivate {
  canActivate(_context: ExecutionContext): boolean {
    return true;
  }
}
`;
  }
}
