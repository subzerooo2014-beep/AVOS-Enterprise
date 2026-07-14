import { Injectable } from "@nestjs/common";
@Injectable()
export class EmiratesIdPolicy {
  validate(value: string) {
    const normalized = value.replace(/-/g, "");
    if (!/^784\d{12}$/.test(normalized)) {
      throw new Error("Invalid Emirates ID format");
    }
    return true;
  }
}
