import {
  Injectable,
} from "@nestjs/common";

@Injectable()
export class PlatformHardeningService {
  status() {
    const production =
      String(
        process.env.NODE_ENV ??
        "development",
      ).toLowerCase() ===
      "production";

    return {
      success: true,

      system:
        "AVOS Platform Hardening",

      version:
        "v1",

      environment:
        process.env.NODE_ENV ??
        "development",

      protections: {
        requestId:
          true,

        structuredErrors:
          true,

        securityHeaders:
          true,

        databaseErrorMapping:
          true,

        internalErrorMasking:
          production,

        hsts:
          production,

        poweredByHidden:
          true,
      },

      recommendations: [
        production
          ? null
          : "Set NODE_ENV=production before public deployment.",

        String(
          process.env
            .WEBHOOK_SIGNATURE_REQUIRED ??
          "false",
        ).toLowerCase() ===
        "true"
          ? null
          : "Enable mandatory webhook signatures before production.",

        String(
          process.env
            .PUBLISHER_DELIVERY_MODE ??
          "mock",
        ).toLowerCase() ===
        "production"
          ? null
          : "Replace mock publisher credentials before production.",
      ].filter(Boolean),

      checkedAt:
        new Date(),
    };
  }
}
