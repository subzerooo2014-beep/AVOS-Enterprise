import { Injectable } from "@nestjs/common";
import * as fs from "fs";
import * as path from "path";
import { createFactoryId } from "../utils/factory-id.util";

@Injectable()
export class FactoryOutputPackagerService {
  private readonly packageBase = path.resolve(
    process.cwd(),
    "..",
    "..",
    ".avos",
    "factory-output-packages",
  );

  packageWorkspace(workspacePath: string, projectId: string) {
    fs.mkdirSync(this.packageBase, { recursive: true });

    const outputPath = path.join(
      this.packageBase,
      createFactoryId("factory-output").replace(/:/g, "-"),
    );

    fs.cpSync(workspacePath, outputPath, {
      recursive: true,
      force: true,
    });

    fs.writeFileSync(
      path.join(outputPath, ".avos-package.json"),
      JSON.stringify(
        {
          projectId,
          sourceWorkspace: workspacePath,
          packagedAt: new Date().toISOString(),
          generatedBy: "avos-code-factory",
          humanFinalAuthority: true,
        },
        null,
        2,
      ),
      "utf8",
    );

    return outputPath;
  }
}
