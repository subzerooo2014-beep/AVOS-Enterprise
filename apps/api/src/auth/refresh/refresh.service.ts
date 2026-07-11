import { Injectable } from "@nestjs/common";
import { JwtService } from "../tokens/jwt.service";

@Injectable()
export class RefreshService {

  refresh(user:any){

    return{
      accessToken:JwtService.sign({
        sub:user.sub,
        email:user.email,
        role:user.role,
      }),
    };

  }

}

