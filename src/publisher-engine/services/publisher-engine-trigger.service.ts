import { Injectable } from "@nestjs/common";

@Injectable()
export class PublisherEngineTriggerService {

  trigger(name: string, payload?: any) {
    return {
      id: crypto.randomUUID(),
      trigger: name,
      payload,
      createdAt: new Date(),
    };
  }
}
