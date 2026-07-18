export class ProjectKindNotFoundError extends Error {
  constructor(kind: string) {
    super(`Project kind "${kind}" is not registered.`);
    this.name = "ProjectKindNotFoundError";
  }
}
export class ProjectGeneratorPolicyError extends Error {
  constructor(public readonly reasons: string[]) {
    super("Project generation request was blocked by policy.");
    this.name = "ProjectGeneratorPolicyError";
  }
}
