import { Module } from "@nestjs/common";
import { LeadConversionService } from "./lead-conversion.service";

@Module({

  providers:[
    LeadConversionService
  ],

  exports:[
    LeadConversionService
  ],

})
export class LeadConversionModule {}
