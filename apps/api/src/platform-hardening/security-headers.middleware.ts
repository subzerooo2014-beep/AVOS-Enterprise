import {
  Injectable,
  NestMiddleware,
} from "@nestjs/common";

import {
  AvosNextFunction,
  AvosRequest,
  AvosResponse,
} from "./request-context.middleware";

@Injectable()
export class SecurityHeadersMiddleware
  implements NestMiddleware
{
  use(
    _request: AvosRequest,
    response: AvosResponse,
    next: AvosNextFunction,
  ): void {
    response.setHeader(
      "X-Content-Type-Options",
      "nosniff",
    );

    response.setHeader(
      "X-Frame-Options",
      "DENY",
    );

    response.setHeader(
      "Referrer-Policy",
      "strict-origin-when-cross-origin",
    );

    response.setHeader(
      "Permissions-Policy",
      [
        "camera=()",
        "microphone=()",
        "geolocation=()",
        "payment=()",
        "usb=()",
      ].join(", "),
    );

    response.setHeader(
      "Cross-Origin-Opener-Policy",
      "same-origin",
    );

    response.setHeader(
      "Cross-Origin-Resource-Policy",
      "same-site",
    );

    response.setHeader(
      "X-DNS-Prefetch-Control",
      "off",
    );

    response.setHeader(
      "X-Permitted-Cross-Domain-Policies",
      "none",
    );

    response.removeHeader(
      "X-Powered-By",
    );

    const production =
      String(
        process.env.NODE_ENV ??
        "development",
      ).toLowerCase() ===
      "production";

    if (production) {
      response.setHeader(
        "Strict-Transport-Security",
        "max-age=31536000; includeSubDomains",
      );
    }

    next();
  }
}
