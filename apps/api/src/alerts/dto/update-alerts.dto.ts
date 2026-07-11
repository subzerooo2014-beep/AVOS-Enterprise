import { PartialType } from "@nestjs/mapped-types";
import { CreateAlertsDto } from "./create-alerts.dto";

export class UpdateAlertsDto extends PartialType(CreateAlertsDto){}
