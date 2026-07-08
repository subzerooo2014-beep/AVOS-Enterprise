import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";

@Controller("auth")
export class AuthMeController {

  @UseGuards(JwtAuthGuard)
  @Get("me")
  me(@Req() req:any){
    return req.user;
  }

}
