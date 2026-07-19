import { Injectable } from "@nestjs/common";

@Injectable()
export class PackagingService{

  health(){
    return {
      module:"packaging",
      status:"healthy",
      version:"1.0.0"
    };
  }

}
