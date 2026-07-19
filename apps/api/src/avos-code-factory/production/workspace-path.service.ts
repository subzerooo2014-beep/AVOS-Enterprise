import { Injectable } from "@nestjs/common";
import * as path from "path";

@Injectable()
export class FactoryWorkspacePathService {
  private readonly basePath = path.resolve(
    process.cwd(),
    "..",
    "..",
    ".avos",
    "factory-workspaces",
  );

  getBasePath() {
    return this.basePath;
  }

  resolveWorkspace(projectSlug: string, targetDirectory?: string) {
    if (targetDirectory) {
      return path.resolve(targetDirectory);
    }
    return path.join(this.basePath, projectSlug);
  }

  resolveSafeFile(workspacePath: string, relativePath: string) {
    const normalized = relativePath.replace(/\\/g, "/").replace(/^\/+/, "");
    const absolutePath = path.resolve(workspacePath, normalized);
    const safeRoot = path.resolve(workspacePath) + path.sep;

    if (
      absolutePath !== path.resolve(workspacePath) &&
      !absolutePath.startsWith(safeRoot)
    ) {
      throw new Error(`Unsafe output path '${relativePath}'.`);
    }

    return absolutePath;
  }
}
