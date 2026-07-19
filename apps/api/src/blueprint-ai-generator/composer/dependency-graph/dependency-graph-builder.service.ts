import { Injectable } from "@nestjs/common";

@Injectable()
export class DependencyGraphBuilderService{
  build(input?:any){
    return {
      success:true,
      service:"DependencyGraphBuilderService",
      generatedAt:new Date().toISOString(),
      input
    };
  }
}
