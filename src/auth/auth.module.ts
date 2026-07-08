import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { RefreshService } from "./refresh/refresh.service";

@Module({
  imports:[PrismaModule],
  controllers:[AuthController],
  providers:[
    AuthService,
    RefreshService,
  ],
  exports:[
    AuthService,
  ],
})
export class AuthModule{}
