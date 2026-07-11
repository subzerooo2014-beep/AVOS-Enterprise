import { Injectable } from "@nestjs/common";

export type EngineState =
  | "starting"
  | "running"
  | "stopping"
  | "stopped";

@Injectable()
export class PublisherEngineStateManagerService {

  private state:EngineState="starting";

  get(){
    return this.state;
  }

  set(state:EngineState){
    this.state=state;
    return this.state;
  }

  running(){
    return this.state==="running";
  }

}
