import { Injectable } from "@nestjs/common";

@Injectable()
export class PublisherMemoryCacheService {
  private readonly data = new Map<string, any>();

  get(key: string) {
    return this.data.get(key);
  }

  set(key: string, value: any) {
    this.data.set(key, value);
  }

  remove(key: string) {
    this.data.delete(key);
  }

  clear() {
    this.data.clear();
  }

  size() {
    return this.data.size;
  }
}
