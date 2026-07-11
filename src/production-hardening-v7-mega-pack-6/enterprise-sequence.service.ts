import { Injectable } from "@nestjs/common";

@Injectable()
export class EnterpriseSequenceService {
  private sequence = 0;

  next(prefix: string): string {
    this.sequence =
      (this.sequence + 1) % 1000000;

    const timestamp =
      new Date()
        .toISOString()
        .replace(/[-:TZ.]/g, "")
        .slice(0, 14);

    const suffix = String(
      this.sequence,
    ).padStart(6, "0");

    return `${prefix}-${timestamp}-${suffix}`;
  }
}
