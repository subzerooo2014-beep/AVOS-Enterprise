import { Injectable } from "@nestjs/common";

@Injectable()
export class InterceptorGeneratorService {
  generate(name: string): string {
    const className = name.replace(/[^a-zA-Z0-9]/g, "");
    return `import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class ${className}Interceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle();
  }
}
`;
  }
}
