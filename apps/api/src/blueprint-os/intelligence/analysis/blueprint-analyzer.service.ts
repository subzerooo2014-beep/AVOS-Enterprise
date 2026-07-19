import { Injectable } from "@nestjs/common";

@Injectable()
export class BlueprintAnalyzerService{
 run(){ return {success:true, complexity:0}; }
}
