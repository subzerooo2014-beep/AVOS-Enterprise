import { Injectable } from "@nestjs/common";

@Injectable()
export class VehiclePublicUrlService {
  private readonly websiteBaseUrl =
    (
      process.env.AVOS_WEBSITE_URL ??
      process.env.WEBSITE_BASE_URL ??
      "https://avos.ae"
    ).replace(/\/+$/, "");

  vehicle(slug: string): string {
    if (!slug?.trim()) {
      throw new Error(
        "Vehicle slug is required to build the public URL",
      );
    }

    return `${this.websiteBaseUrl}/vehicles/${encodeURIComponent(
      slug.trim(),
    )}`;
  }

  canonical(slug: string): string {
    return this.vehicle(slug);
  }

  sitemap(): string {
    return `${this.websiteBaseUrl}/sitemap.xml`;
  }
}
