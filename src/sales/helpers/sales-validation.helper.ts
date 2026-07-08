import { BadRequestException } from "@nestjs/common";

export function ensurePositiveMoney(value: number, field: string) {
  if (value < 0) {
    throw new BadRequestException(`${field} cannot be negative`);
  }
}

export function ensureRequired(value: any, field: string) {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    throw new BadRequestException(`${field} is required`);
  }
}
