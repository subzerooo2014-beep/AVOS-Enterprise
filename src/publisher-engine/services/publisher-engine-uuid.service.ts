import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";

@Injectable()
export class PublisherEngineUuidService{

  create(){
    return randomUUID();
  }

}
