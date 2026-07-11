import { Injectable } from "@nestjs/common";

@Injectable()
export class PublisherEngineClockService{

  now(){
    return new Date();
  }

  timestamp(){
    return Date.now();
  }

}
