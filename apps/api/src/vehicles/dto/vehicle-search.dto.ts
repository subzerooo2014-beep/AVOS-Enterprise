import {
 IsOptional,
 IsString,
 IsInt,
 Min,
} from "class-validator";

export class VehicleSearchDto{

 @IsOptional()
 @IsString()
 search?:string;

 @IsOptional()
 @IsString()
 make?:string;

 @IsOptional()
 @IsString()
 model?:string;

 @IsOptional()
 @IsInt()
 @Min(1900)
 year?:number;

}
