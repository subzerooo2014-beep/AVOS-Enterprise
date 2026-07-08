import { Injectable } from "@nestjs/common";

@Injectable()
export class MonitoringEngineService{
  health(){
    return{
      system:"HEALTHY",
      ai:"ONLINE",
      queues:"NORMAL",
      database:"CONNECTED",
    };
  }
}
