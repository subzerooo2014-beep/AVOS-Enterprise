import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
  health() {
    return {
      name: "AVOS",
      status: "OK",
      api: "running"
    };
  }
}
