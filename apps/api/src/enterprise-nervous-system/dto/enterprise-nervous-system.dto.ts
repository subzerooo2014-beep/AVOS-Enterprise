
import { IsNotEmpty, IsObject, IsOptional, IsString } from "class-validator";
export class PublishSignalDto{@IsString() @IsNotEmpty() topic!:string;@IsString() @IsNotEmpty() type!:string;@IsString() @IsNotEmpty() source!:string;@IsObject() payload!:Record<string,unknown>;@IsOptional() @IsString() traceId?:string;}