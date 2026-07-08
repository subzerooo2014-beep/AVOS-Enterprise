import { Injectable } from "@nestjs/common";

@Injectable()
export class GrpcService{
 findAll(){ return []; }
 create(dto:any){ return dto; }
}
