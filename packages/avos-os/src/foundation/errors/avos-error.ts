export class AvosError extends Error {
  constructor(
    message: string,
    public readonly code = "AVOS_ERROR",
    public readonly details?: any,
  ) {
    super(message);
    this.name = "AvosError";
  }
}
