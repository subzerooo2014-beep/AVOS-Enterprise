export class OperationTimeoutError extends Error {
  constructor(
    public readonly timeoutMs: number,
    public readonly operationName = "operation",
  ) {
    super(`${operationName} exceeded timeout of ${timeoutMs}ms`);
    this.name = "OperationTimeoutError";
  }
}

export async function withTimeout<T>(
  operation: Promise<T>,
  timeoutMs: number,
  operationName = "operation",
): Promise<T> {
  if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) {
    return operation;
  }

  let timer: NodeJS.Timeout | undefined;

  const timeoutPromise = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      reject(new OperationTimeoutError(timeoutMs, operationName));
    }, timeoutMs);

    timer.unref?.();
  });

  try {
    return await Promise.race([operation, timeoutPromise]);
  } finally {
    if (timer) {
      clearTimeout(timer);
    }
  }
}
