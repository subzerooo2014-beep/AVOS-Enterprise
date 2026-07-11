import { Module } from "@nestjs/common";
import { InvoicesaiController } from "./invoicesai.controller";
import { InvoicesaiService } from "./invoicesai.service";

@Module({
 controllers:[InvoicesaiController],
 providers:[InvoicesaiService],
})
export class InvoicesaiModule{}
