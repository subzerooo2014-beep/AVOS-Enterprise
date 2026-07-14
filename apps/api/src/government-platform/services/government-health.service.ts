import { Injectable } from "@nestjs/common";
@Injectable()
export class GovernmentHealthService {
  status() {
    return {
      success: true,
      system: "AVOS Government & UAE Platform",
      status: "healthy",
      environment: "SANDBOX",
    };
  }
}
