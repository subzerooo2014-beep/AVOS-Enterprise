import { Injectable } from "@nestjs/common";
@Injectable()
export class CustomsExportPolicy {
  validate(input: { destinationCountry: string; declaredValue: number; port: string }) {
    if (!input.destinationCountry || !input.port) throw new Error("Export destination and port required");
    if (input.declaredValue <= 0) throw new Error("Invalid declared value");
    return true;
  }
}
