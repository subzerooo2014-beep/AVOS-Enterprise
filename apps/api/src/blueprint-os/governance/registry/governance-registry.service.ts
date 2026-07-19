import { Injectable } from "@nestjs/common";

@Injectable()
export class GovernanceRegistryService{
  private readonly policies:string[]=[];
  register(name:string){ this.policies.push(name); }
  all(){ return this.policies; }
}
