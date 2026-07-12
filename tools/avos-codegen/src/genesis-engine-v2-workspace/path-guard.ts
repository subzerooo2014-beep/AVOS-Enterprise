import path from "node:path";

export class WorkspacePathGuard {
  resolveSafe(rootDirectory: string, relativePath: string): string {
    const root = path.resolve(rootDirectory);
    const target = path.resolve(root, relativePath);

    if (target !== root && !target.startsWith(`${root}${path.sep}`)) {
      throw new Error(
        `Unsafe workspace path detected: ${relativePath}`,
      );
    }

    return target;
  }
}
