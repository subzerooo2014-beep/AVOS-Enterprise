import { Injectable } from "@nestjs/common";
@Injectable()
export class GovernmentProviderPolicy {
  validate(baseUrl: string, environment: string) {
    if (!baseUrl.startsWith("https://")) throw new Error("Provider base URL must be HTTPS");
    if (!["SANDBOX", "PRODUCTION"].includes(environment)) {
      throw new Error("Invalid provider environment");
    }
    return true;
  }
}
