import { Injectable } from "@nestjs/common";

@Injectable()
export class PolicyRegistryService{
  private readonly policies:any[]=[];
  register(policy:any){ this.policies.push(policy); return policy; }
  list(){ return this.policies; }
}
