import { Module } from "@nestjs/common";
import { EventbusController } from "./eventbus.controller";
import { EventbusService } from "./eventbus.service";

@Module({
 controllers:[EventbusController],
 providers:[EventbusService],
})
export class EventbusModule{}
