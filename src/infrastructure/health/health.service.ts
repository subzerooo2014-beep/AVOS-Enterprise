import { Injectable } from "@nestjs/common";

@Injectable()
export class HealthService {
  check() {
    return {
      status: "UP",
      timestamp: new Date().toISOString(),
      services: {
        api: "UP",
        database: "UNKNOWN",
        redis: "UNKNOWN",
        queue: "UNKNOWN",
      },
    };
  }
}
