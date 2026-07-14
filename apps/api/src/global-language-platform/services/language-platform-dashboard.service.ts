import { Injectable } from "@nestjs/common";

@Injectable()
export class LanguagePlatformDashboardService {
  summary() {
    return {
      languagePacks: 0,
      activeLanguages: 0,
      translationMemoryRecords: 0,
      terminologyEntries: 0,
      dictionaries: 0,
      localizationKeys: 0,
      qualityScore: 100,
      healthStatus: "healthy",
    };
  }
}
