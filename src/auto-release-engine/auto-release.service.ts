import { Injectable } from "@nestjs/common";

@Injectable()
export class AutoReleaseService {

  shouldRelease(expireAt:Date){

    return expireAt.getTime() <= Date.now();

  }

}
