import { Injectable } from "@nestjs/common";
@Injectable()
export class BlueprintRepositoryService{
 private readonly items:any[]=[];
 save(bp:any){this.items.push(bp);return bp;}
 all(){return this.items;}
}
