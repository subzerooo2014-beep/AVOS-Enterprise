export class AiGeneratorValidationError extends Error {
  constructor(
    public readonly errors: string[]
  ) {
    super("AI generation request validation failed.");
    this.name = "AiGeneratorValidationError";
  }
}

export class AiGeneratorPolicyError extends Error {
  constructor(
    public readonly reasons: string[]
  ) {
    super("AI generation request was blocked by policy.");
    this.name = "AiGeneratorPolicyError";
  }
}

export class AiGeneratorApprovalRequiredError extends Error {
  constructor() {
    super(
      "AI generation requires Human Final Authority approval."
    );

    this.name =
      "AiGeneratorApprovalRequiredError";
  }
}
