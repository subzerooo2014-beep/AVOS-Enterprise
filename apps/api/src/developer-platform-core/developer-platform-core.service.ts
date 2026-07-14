import { Injectable } from "@nestjs/common";
@Injectable()
export class DeveloperPlatformCoreService {
  health() {
    return {
      success: true,
      system: "AVOS Developer Platform Core",
      status: "healthy",
    };
  }
}
