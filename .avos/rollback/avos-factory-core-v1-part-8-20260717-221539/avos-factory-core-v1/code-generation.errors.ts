export class GenerationProviderNotFoundError extends Error {
  constructor(providerId: string) {
    super(
      `Code generation provider "${providerId}" was not found.`
    );

    this.name =
      "GenerationProviderNotFoundError";
  }
}

export class GenerationTargetNotSupportedError extends Error {
  constructor(
    providerId: string,
    target: string
  ) {
    super(
      `Provider "${providerId}" does not support target "${target}".`
    );

    this.name =
      "GenerationTargetNotSupportedError";
  }
}

export class GenerationValidationError extends Error {
  constructor(
    public readonly errors: string[]
  ) {
    super(
      "Code generation request validation failed."
    );

    this.name =
      "GenerationValidationError";
  }
}

export class GenerationOutputError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GenerationOutputError";
  }
}
