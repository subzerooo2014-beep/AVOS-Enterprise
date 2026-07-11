export class AvosLogger {
  constructor(private readonly scope = "AVOS") {}

  info(message: string, data?: any) {
    console.log(`[${this.scope}] INFO: ${message}`, data ?? "");
  }

  warn(message: string, data?: any) {
    console.warn(`[${this.scope}] WARN: ${message}`, data ?? "");
  }

  error(message: string, data?: any) {
    console.error(`[${this.scope}] ERROR: ${message}`, data ?? "");
  }
}
