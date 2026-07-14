import { Injectable } from "@nestjs/common";
@Injectable()
export class AiInfrastructureCoreService {
  health(){
    return {
      success:true,
      system:"AVOS AI Infrastructure Core",
      status:"healthy",
    };
  }
}
