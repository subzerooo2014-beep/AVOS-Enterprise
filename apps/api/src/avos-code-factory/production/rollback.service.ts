import { Injectable } from "@nestjs/common";
import * as fs from "fs";
import * as path from "path";
import { createFactoryId } from "../utils/factory-id.util";

@Injectable()
export class FactoryRollbackService {
  private readonly rollbackBase = path.resolve(
    process.cwd(),
    "..",
    "..",
    ".avos",
    "factory-build-rollbacks",
  );

  createBackup(workspacePath: string) {
    if (!fs.existsSync(workspacePath)) {
      return undefined;
    }

    fs.mkdirSync(this.rollbackBase, { recursive: true });
    const backupPath = path.join(
      this.rollbackBase,
      createFactoryId("workspace-backup").replace(/:/g, "-"),
    );

    fs.cpSync(workspacePath, backupPath, {
      recursive: true,
      force: true,
    });

    return backupPath;
  }

  restore(workspacePath: string, backupPath?: string) {
    if (fs.existsSync(workspacePath)) {
      fs.rmSync(workspacePath, { recursive: true, force: true });
    }

    if (backupPath && fs.existsSync(backupPath)) {
      fs.cpSync(backupPath, workspacePath, {
        recursive: true,
        force: true,
      });
    }
  }
}
