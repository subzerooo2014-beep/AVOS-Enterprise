import { Injectable } from "@nestjs/common";
@Injectable()
export class EnterpriseIntegrationHubService {
  health() {
    return {
      success: true,
      system: "AVOS Enterprise Integration Hub",
      status: "healthy",
    };
  }
}
