import { Injectable } from "@nestjs/common";

@Injectable()
export class BlueprintGraphService{
  private readonly nodes:any[]=[];
  private readonly edges:any[]=[];

  addNode(node:any){ this.nodes.push(node); }
  addEdge(edge:any){ this.edges.push(edge); }

  status(){
    return{
      healthy:true,
      nodes:this.nodes.length,
      edges:this.edges.length,
      generatedAt:new Date().toISOString()
    };
  }
}
