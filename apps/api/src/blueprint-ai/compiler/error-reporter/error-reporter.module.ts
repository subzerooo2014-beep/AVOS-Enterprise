import { Module } from "@nestjs/common";
import { ErrorReporterService } from "./error-reporter.service";
import { ErrorReporterController } from "./error-reporter.controller";

@Module({
  providers:[ErrorReporterService],
  controllers:[ErrorReporterController],
  exports:[ErrorReporterService]
})
export class ErrorReporterModule {}
