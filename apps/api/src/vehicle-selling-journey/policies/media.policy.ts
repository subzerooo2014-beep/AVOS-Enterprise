import { Injectable } from "@nestjs/common";
@Injectable()
export class MediaPolicy {
  validate(urls: string[]) {
    if (!urls.length) throw new Error("At least one media file is required");
    if (urls.length > 30) throw new Error("Too many media files");
    return true;
  }
}
