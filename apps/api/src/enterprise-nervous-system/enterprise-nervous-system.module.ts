
import { Module } from "@nestjs/common";
import { EnterpriseNervousSystemController } from "./enterprise-nervous-system.controller";
import { EnterpriseNervousSystemService } from "./services/enterprise-nervous-system.service";
@Module({controllers:[EnterpriseNervousSystemController],providers:[EnterpriseNervousSystemService],exports:[EnterpriseNervousSystemService]})
export class EnterpriseNervousSystemModule{}