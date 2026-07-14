import { Injectable } from "@nestjs/common";
import { MediaPolicy } from "../policies/media.policy";
@Injectable()
export class MediaUploadService {
  constructor(private readonly policy: MediaPolicy) {}
  upload(urls: string[]) {
    this.policy.validate(urls);
    return urls.map((url) => ({
      id: `media_${Date.now()}_${Math.random().toString(36).slice(2,6)}`,
      url,
    }));
  }
}
