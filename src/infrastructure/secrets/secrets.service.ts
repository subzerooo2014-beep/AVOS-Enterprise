import { Injectable } from "@nestjs/common";

@Injectable()
export class SecretsService {
  get(key: string) {
    return process.env[key];
  }

  require(key: string) {
    const value = process.env[key];
    if (!value) throw new Error(`Missing secret: ${key}`);
    return value;
  }
}
