import { Injectable } from "@nestjs/common";

@Injectable()
export class BlueprintAIRegistryService{
 private readonly artifacts:any[]=[];
 add(item:any){ this.artifacts.push(item); return item; }
 list(){ return this.artifacts; }
}
