import { Injectable } from "@nestjs/common";
@Injectable()
export class BlueprintVersionService{
 current(){return "1.0.0";}
 create(tag:string){return{version:tag,createdAt:new Date().toISOString()};}
}
