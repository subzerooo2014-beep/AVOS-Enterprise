import { Injectable } from "@nestjs/common";

@Injectable()
export class PublisherMemoryStatService {
  usage() {
    const memory = process.memoryUsage();

    return {
      rss: memory.rss,
      heapUsed: memory.heapUsed,
      heapTotal: memory.heapTotal,
      external: memory.external,
      arrayBuffers: memory.arrayBuffers,
      generatedAt: new Date(),
    };
  }
}
