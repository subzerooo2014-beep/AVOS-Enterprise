import { Injectable } from "@nestjs/common";
@Injectable()
export class PlatformFabricDashboardService {
  summary(){
    return {
      capabilities:0,
      services:0,
      modules:0,
      dependencies:0,
      compatibilityScore:100,
      healthStatus:"healthy",
    };
  }
}
