import { Injectable } from "@nestjs/common";

@Injectable()
export class GlobalLanguagePlatformService {
  health() {
    return {
      success: true,
      system: "AVOS Global Language Platform",
      status: "healthy",
    };
  }
}
