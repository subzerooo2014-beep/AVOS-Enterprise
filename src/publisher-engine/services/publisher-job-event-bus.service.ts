import { Injectable } from "@nestjs/common";
import { PublisherJobEventService } from "./publisher-job-event.service";

@Injectable()
export class PublisherJobEventBusService {

  private readonly events:any[]=[];

  constructor(
    private readonly factory:PublisherJobEventService,
  ){}

  publish(type:string,payload:any){

    const event=this.factory.create(type,payload);

    this.events.unshift(event);

    if(this.events.length>5000){
      this.events.length=5000;
    }

    return event;

  }

  latest(limit=100){
    return this.events.slice(0,limit);
  }

}
