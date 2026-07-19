import { Injectable } from "@nestjs/common";

@Injectable()
export class IntelligenceRegistryService{
 private readonly services:string[]=[];
 register(name:string){this.services.push(name);}
 all(){return this.services;}
}
