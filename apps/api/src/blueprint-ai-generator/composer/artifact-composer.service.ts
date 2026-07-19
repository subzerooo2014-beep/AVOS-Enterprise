import { Injectable } from "@nestjs/common";

@Injectable()
export class ArtifactComposerService{
  compose(input?:any){
    return {
      success:true,
      service:"ArtifactComposerService",
      generatedAt:new Date().toISOString(),
      input
    };
  }
}
