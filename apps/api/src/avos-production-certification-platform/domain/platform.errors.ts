export class PlatformValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PlatformValidationError';
  }
}

export class HumanApprovalRequiredError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'HumanApprovalRequiredError';
  }
}
