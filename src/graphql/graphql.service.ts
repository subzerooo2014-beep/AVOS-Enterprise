import { Injectable } from "@nestjs/common";

@Injectable()
export class GraphqlService{
 findAll(){ return []; }
 create(dto:any){ return dto; }
}
