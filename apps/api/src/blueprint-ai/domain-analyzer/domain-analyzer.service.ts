import { Injectable } from "@nestjs/common";

@Injectable()
export class DomainAnalyzerService{

  health(){
    return {
      module:"domain-analyzer",
      status:"healthy",
      version:"1.0.0"
    };
  }

}
