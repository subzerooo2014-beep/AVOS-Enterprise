import { Injectable } from "@nestjs/common";

@Injectable()
export class ArtifactComposerService{
  compose(input?:any){
    return {
      success:true,
      service:"ArtifactComposerService",
      timestamp:new Date().toISOString(),
      input
    };
  }
}
