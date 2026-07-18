import { Injectable } from "@nestjs/common";

@Injectable()
export class NamingQualityService {
  validate(name: string): boolean {
    return /^[A-Za-z][A-Za-z0-9_-]*$/.test(name);
  }
}
