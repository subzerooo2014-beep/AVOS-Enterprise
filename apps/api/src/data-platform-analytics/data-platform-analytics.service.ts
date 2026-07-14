import { Injectable } from "@nestjs/common";
@Injectable()
export class DataPlatformAnalyticsService {
  health() {
    return {
      success: true,
      system: "AVOS Data Platform, Analytics & Intelligence OS",
      status: "healthy",
    };
  }
}
