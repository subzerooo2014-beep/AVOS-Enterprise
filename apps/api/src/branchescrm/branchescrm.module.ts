import { Module } from "@nestjs/common";
import { BranchescrmController } from "./branchescrm.controller";
import { BranchescrmService } from "./branchescrm.service";

@Module({
  controllers:[BranchescrmController],
  providers:[BranchescrmService],
})
export class BranchescrmModule {}
