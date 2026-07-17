
import { IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";
export class CreateOrchestrationDto{@IsString() @IsNotEmpty() objective!:string;@IsArray() @IsString({each:true}) capabilities!:string[];@IsOptional() @IsBoolean() requiresHumanApproval?:boolean;}
export class ApproveOrchestrationDto{@IsString() @IsNotEmpty() runId!:string;@IsString() @IsNotEmpty() approvedBy!:string;}