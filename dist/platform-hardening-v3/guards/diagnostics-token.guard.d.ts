import { CanActivate, ExecutionContext } from "@nestjs/common";
export declare class DiagnosticsTokenGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean;
}
