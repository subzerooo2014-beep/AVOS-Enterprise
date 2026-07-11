import { Injectable } from "@nestjs/common";

@Injectable()
export class PublisherEngineEventRegistryService {

  private readonly events:any[]=[];

  publish(event:any){
    this.events.unshift(event);

    if(this.events.length>10000){
      this.events.length=10000;
    }

    return event;
  }

  latest(limit=100){
    return this.events.slice(0,limit);
  }

}
