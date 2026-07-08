import { Injectable } from "@nestjs/common";
import { AgentDefinition } from "./agent-definition";

@Injectable()
export class AgentRegistryService{

  private readonly agents:AgentDefinition[]=[
    {
      id:"sales",
      name:"Sales Agent",
      description:"Sales specialist",
      tools:["crm","pricing","inventory"]
    },
    {
      id:"inventory",
      name:"Inventory Agent",
      description:"Inventory specialist",
      tools:["inventory","analytics"]
    },
    {
      id:"finance",
      name:"Finance Agent",
      description:"Finance specialist",
      tools:["payments","reports"]
    }
  ];

  all(){
    return this.agents;
  }

  find(id:string){
    return this.agents.find(a=>a.id===id);
  }

}
