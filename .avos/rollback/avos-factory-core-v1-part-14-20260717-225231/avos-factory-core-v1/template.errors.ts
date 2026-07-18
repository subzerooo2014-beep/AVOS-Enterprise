export class TemplateNotFoundError extends Error {
  constructor(
    templateId: string,
    version?: string
  ) {
    super(
      version
        ? `Template "${templateId}" version "${version}" was not found.`
        : `Template "${templateId}" was not found.`
    );

    this.name = "TemplateNotFoundError";
  }
}

export class TemplateValidationError extends Error {
  constructor(
    public readonly errors: string[]
  ) {
    super("Template validation failed.");
    this.name = "TemplateValidationError";
  }
}

export class TemplateRenderError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TemplateRenderError";
  }
}

export class TemplateCompositionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TemplateCompositionError";
  }
}
