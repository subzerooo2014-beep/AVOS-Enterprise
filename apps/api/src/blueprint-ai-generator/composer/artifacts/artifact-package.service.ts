import { Injectable } from "@nestjs/common";

@Injectable()
export class ArtifactPackageService{
  package(input?:any){
    return {
      success:true,
      service:"ArtifactPackageService",
      generatedAt:new Date().toISOString(),
      input
    };
  }
}
