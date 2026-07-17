
import { IsArray, IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";
import type { CapabilityStatus } from "../contracts/capability-fabric.contracts";
export class CreateCapabilityDto {
  @IsString() @IsNotEmpty() key!:string;
  @IsString() @IsNotEmpty() name!:string;
  @IsIn(["concept","prototype","shared","core","platform","product","legacy"]) status!:CapabilityStatus;
  @IsString() @IsNotEmpty() version!:string;
  @IsString() @IsNotEmpty() owner!:string;
  @IsOptional() @IsArray() @IsString({each:true}) contracts?:string[];
  @IsOptional() @IsArray() @IsString({each:true}) dependencies?:string[];
  @IsOptional() @IsArray() @IsString({each:true}) tags?:string[];
  @IsOptional() @IsNumber() @Min(0) @Max(100) trustScore?:number;
}