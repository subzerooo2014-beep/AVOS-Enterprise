import { Injectable } from "@nestjs/common";

@Injectable()
export class PublisherLanguageRouterService {
  resolve(language?: string | null) {
    const value = String(language ?? "ar").toLowerCase();

    if (["ar","en"].includes(value)) {
      return value;
    }

    return "en";
  }
}
