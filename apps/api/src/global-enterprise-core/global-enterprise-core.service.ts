import { Injectable } from "@nestjs/common";

@Injectable()
export class GlobalEnterpriseCoreService {
  health() {
    return {
      success: true,
      system: "AVOS Global Enterprise Core",
      status: "healthy",
    };
  }
}
