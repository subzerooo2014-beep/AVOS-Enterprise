import { Injectable } from "@nestjs/common";

@Injectable()
export class JobDispatcherService {
  dispatch(name: string, payload: unknown) {
    return {
      job: name,
      queued: true,
      payload,
    };
  }
}
