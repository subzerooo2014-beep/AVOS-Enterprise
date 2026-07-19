import { Injectable } from "@nestjs/common";
import * as fs from "fs";
import * as path from "path";
import { FactoryCommandResult } from "../contracts/materialization.contracts";

@Injectable()
export class FactoryProductionVerificationService {
  verify(workspacePath: string, commands: FactoryCommandResult[]) {
    const checks: Record<string, boolean> = {
      workspaceExists: fs.existsSync(workspacePath),
      containsFiles:
        fs.existsSync(workspacePath) &&
        fs.readdirSync(workspacePath).length > 0,
      packageJsonValid: true,
      commandsPassed: commands.every((command) => command.exitCode === 0),
    };

    const packageJsonPath = path.join(workspacePath, "package.json");
    if (fs.existsSync(packageJsonPath)) {
      try {
        JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
      } catch {
        checks.packageJsonValid = false;
      }
    }

    const notes = Object.entries(checks)
      .filter(([, passed]) => !passed)
      .map(([name]) => `Verification check '${name}' failed.`);

    return {
      passed: Object.values(checks).every(Boolean),
      checks,
      notes,
    };
  }
}
