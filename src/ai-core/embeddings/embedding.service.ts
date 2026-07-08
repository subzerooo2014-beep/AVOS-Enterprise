import { Injectable } from "@nestjs/common";

@Injectable()
export class EmbeddingService {
  async embed(text: string) {
    return {
      dimensions: 1536,
      vector: Array.from({ length: 16 }, (_, i) => (text.length + i) / 100),
    };
  }
}
