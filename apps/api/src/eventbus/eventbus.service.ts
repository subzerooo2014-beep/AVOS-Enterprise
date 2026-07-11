import { Injectable } from "@nestjs/common";

@Injectable()
export class EventbusService{
 findAll(){ return []; }
 create(dto:any){ return dto; }
}
