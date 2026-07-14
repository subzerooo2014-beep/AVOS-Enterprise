import { Injectable } from "@nestjs/common";
@Injectable()
export class UniversalPlatformFabricService {
  health(){
    return {
      success:true,
      system:"AVOS Universal Platform Fabric",
      status:"healthy",
    };
  }
}
