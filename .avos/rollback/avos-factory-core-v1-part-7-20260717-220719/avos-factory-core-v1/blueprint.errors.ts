export class BlueprintNotFoundError extends Error {
  constructor(
    blueprintId: string,
    version?: string
  ) {
    super(
      version
        ? `Blueprint "${blueprintId}" version "${version}" was not found.`
        : `Blueprint "${blueprintId}" was not found.`
    );

    this.name = "BlueprintNotFoundError";
  }
}

export class BlueprintValidationError extends Error {
  constructor(
    public readonly errors: string[]
  ) {
    super("Blueprint validation failed.");
    this.name = "BlueprintValidationError";
  }
}

export class BlueprintParsingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BlueprintParsingError";
  }
}

export class BlueprintDependencyCycleError extends Error {
  constructor(
    public readonly cycle: string[]
  ) {
    super(
      `Blueprint dependency cycle detected: ${cycle.join(" -> ")}`
    );

    this.name = "BlueprintDependencyCycleError";
  }
}
