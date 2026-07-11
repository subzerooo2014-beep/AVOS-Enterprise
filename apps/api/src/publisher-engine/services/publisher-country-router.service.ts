import { Injectable } from "@nestjs/common";

@Injectable()
export class PublisherCountryRouterService {
  private readonly routes: Record<string,string> = {
    AE: "website",
    SA: "dealer_network",
    QA: "website",
    KW: "website",
    BH: "website",
    OM: "website",
  };

  resolve(country?: string | null) {
    return this.routes[String(country ?? "").toUpperCase()] ?? "internal";
  }
}
