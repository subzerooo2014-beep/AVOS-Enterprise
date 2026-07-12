import path from "node:path";

export class GenesisV3WorkspacePathGuard {
  resolve(rootDirectory: string, relativePath: string): string {
    const root = path.resolve(rootDirectory);
    const target = path.resolve(root, relativePath);

    if (target !== root && !target.startsWith(`${root}${path.sep}`)) {
      throw new Error(`Unsafe generated workspace path: ${relativePath}`);
    }

    return target;
  }
}
