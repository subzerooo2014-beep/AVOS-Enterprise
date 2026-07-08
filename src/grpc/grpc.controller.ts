import { Body, Controller, Get, Post } from "@nestjs/common";
import { GrpcService } from "./grpc.service";

@Controller("grpc")
export class GrpcController{
 constructor(private service:GrpcService){}
 @Get() findAll(){ return this.service.findAll(); }
 @Post() create(@Body() dto:any){ return this.service.create(dto); }
}
