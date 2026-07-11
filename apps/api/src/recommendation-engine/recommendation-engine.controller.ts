import { Controller,Post,Body } from "@nestjs/common";
import { RecommendationEngineService } from "./recommendation-engine.service";

@Controller("recommendation-engine")
export class RecommendationEngineController{
 constructor(private service:RecommendationEngineService){}
 @Post()
 recommend(@Body() dto:any){
   return this.service.recommend(dto);
 }
}
