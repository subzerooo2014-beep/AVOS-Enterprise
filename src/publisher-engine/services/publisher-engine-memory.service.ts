import { Injectable } from "@nestjs/common";

@Injectable()
export class PublisherEngineMemoryService {
  usage() {
    return process.memoryUsage();
  }
}
