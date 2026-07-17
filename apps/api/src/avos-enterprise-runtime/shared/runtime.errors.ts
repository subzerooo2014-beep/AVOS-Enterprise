export class RuntimeInvariantError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RuntimeInvariantError';
  }
}

export class CapabilityNotFoundError extends Error {
  constructor(id: string) {
    super(`Capability not found: ${id}`);
    this.name = 'CapabilityNotFoundError';
  }
}

export class RuntimePolicyDeniedError extends Error {
  constructor(action: string, reasons: string[]) {
    super(`Runtime policy denied ${action}: ${reasons.join(', ')}`);
    this.name = 'RuntimePolicyDeniedError';
  }
}