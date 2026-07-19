import { Injectable } from "@nestjs/common";

@Injectable()
export class TrustScoreService{
 score(){
   return { trustScore:100 };
 }
}
