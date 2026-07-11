import { Injectable } from "@nestjs/common";
import { AvosBrainService } from "../../avos-brain/avos-brain.service";

@Injectable()
export class EventDispatcherService {

  constructor(
    private readonly brain: AvosBrainService,
  ) {}

  async dispatch(event:any){

    try{

      await this.brain.processEvent(event.id);

    }catch(e){

      console.error("Dispatcher:",e);

    }

    return {
      dispatched:true,
      eventId:event.id,
    };
  }
}
