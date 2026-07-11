import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";

@Injectable()
export class V6DiagnosticsTokenGuard
  implements CanActivate
{
  canActivate(
    context: ExecutionContext,
  ): boolean {
    const request =
      context
        .switchToHttp()
        .getRequest<any>();

    const supplied =
      request.headers?.[
        "x-avos-diagnostics-token"
      ];

    const expected =
      process.env.AVOS_DIAGNOSTICS_TOKEN ??
      "avos-dev-diagnostics";

    if (
      typeof supplied !== "string" ||
      supplied !== expected
    ) {
      throw new UnauthorizedException({
        success: false,
        message:
          "Valid AVOS diagnostics token is required",
      });
    }

    return true;
  }
}
