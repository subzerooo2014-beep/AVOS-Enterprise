import { Injectable } from "@nestjs/common";
@Injectable()
export class RollbackEngineService{
 rollback(id:string){
  return{success:true,snapshot:id,rolledBackAt:new Date().toISOString()};
 }
}
