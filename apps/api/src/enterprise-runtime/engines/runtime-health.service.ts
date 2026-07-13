import { Injectable } from "@nestjs/common";

@Injectable()
export class RuntimeHealthService {
  health() {
    return {
      status: "healthy",
      uptime: process.uptime(),
    };
  }
}
