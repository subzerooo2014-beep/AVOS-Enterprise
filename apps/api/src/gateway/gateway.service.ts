import { Injectable } from "@nestjs/common";

@Injectable()
export class GatewayService{
 findAll(){ return []; }
 create(dto:any){ return dto; }
}
