import { Injectable } from "@nestjs/common";

@Injectable()
export class PublisherEngineResourceService {

  resources() {
    return {
      memory: process.memoryUsage(),
      cpu: process.cpuUsage(),
      uptime: process.uptime(),
    };
  }

}
