export class CodeGenError extends Error {
  constructor(
    message: string,
    readonly code:
      string = "CODEGEN_ERROR",
    readonly causeValue?: unknown,
  ) {
    super(message);
    this.name =
      new.target.name;
  }
}

export class CodeGenValidationError
  extends CodeGenError {
  constructor(
    message: string,
    causeValue?: unknown,
  ) {
    super(
      message,
      "CODEGEN_VALIDATION_ERROR",
      causeValue,
    );
  }
}

export class CodeGenEngineNotFoundError
  extends CodeGenError {
  constructor(key: string) {
    super(
      `CodeGen engine was not found: ${key}`,
      "CODEGEN_ENGINE_NOT_FOUND",
    );
  }
}

export class CodeGenDuplicateEngineError
  extends CodeGenError {
  constructor(key: string) {
    super(
      `CodeGen engine is already registered: ${key}`,
      "CODEGEN_DUPLICATE_ENGINE",
    );
  }
}

export class CodeGenKernelStateError
  extends CodeGenError {
  constructor(message: string) {
    super(
      message,
      "CODEGEN_KERNEL_STATE_ERROR",
    );
  }
}
