export class ProjectFilesystemBoundaryError extends Error {
  constructor(path: string) {
    super(`Filesystem path escapes the configured project root: ${path}`);
    this.name = "ProjectFilesystemBoundaryError";
  }
}

export class ProjectTargetExistsError extends Error {
  constructor(path: string) {
    super(`Project target already exists and overwrite is disabled: ${path}`);
    this.name = "ProjectTargetExistsError";
  }
}

export class ProjectExecutionApprovalError extends Error {
  constructor(operation: string) {
    super(`${operation} requires Human Final Authority approval.`);
    this.name = "ProjectExecutionApprovalError";
  }
}

export class ProjectTransactionNotFoundError extends Error {
  constructor(transactionId: string) {
    super(`Project filesystem transaction was not found: ${transactionId}`);
    this.name = "ProjectTransactionNotFoundError";
  }
}

export class ProjectTransactionStateError extends Error {
  constructor(transactionId: string, state: string) {
    super(`Transaction "${transactionId}" cannot perform this operation while state is "${state}".`);
    this.name = "ProjectTransactionStateError";
  }
}
