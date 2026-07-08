import { Injectable } from "@nestjs/common";

@Injectable()
export class ApprovalsService{
 findAll(){ return []; }
 create(dto:any){ return dto; }
 update(id:string,dto:any){ return { id, ...dto }; }
 remove(id:string){ return { id, deleted:true }; }
}
