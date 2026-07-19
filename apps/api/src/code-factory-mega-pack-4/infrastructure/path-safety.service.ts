import { BadRequestException, Injectable } from "@nestjs/common";
import * as path from "node:path";

@Injectable()
export class PathSafetyService {
  resolveInside(root: string, relativePath: string): string {
    const normalized = relativePath.replace(/\\/g, "/").replace(/^\/+/, "");
    if (!normalized || normalized.includes("\0")) {
      throw new BadRequestException("Invalid relative path.");
    }

    const resolvedRoot = path.resolve(root);
    const resolvedPath = path.resolve(resolvedRoot, normalized);
    const prefix = resolvedRoot.endsWith(path.sep)
      ? resolvedRoot
      : `${resolvedRoot}${path.sep}`;

    if (resolvedPath !== resolvedRoot && !resolvedPath.startsWith(prefix)) {
      throw new BadRequestException(
        `Path escapes workspace boundary: ${relativePath}`
      );
    }

    return resolvedPath;
  }
}