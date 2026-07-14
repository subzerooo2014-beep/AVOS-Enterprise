import { Injectable } from "@nestjs/common";
@Injectable()
export class DeveloperPlatformDashboardService {
  summary() {
    return {
      sdkPackages: 0,
      publishedPackages: 0,
      activeSandboxes: 0,
      cliCommands: 0,
      extensions: 0,
      plugins: 0,
    };
  }
}
