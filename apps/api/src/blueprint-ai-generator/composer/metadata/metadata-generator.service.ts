import { Injectable } from "@nestjs/common";

@Injectable()
export class MetadataGeneratorService{
  generate(input?:any){
    return {
      success:true,
      service:"MetadataGeneratorService",
      generatedAt:new Date().toISOString(),
      input
    };
  }
}
