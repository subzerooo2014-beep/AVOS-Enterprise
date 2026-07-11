import { Injectable } from "@nestjs/common";

@Injectable()
export class CustomerLifecycleService {

  calculateStage(score:number){

    if(score>=90) return "VIP";
    if(score>=70) return "CUSTOMER";
    if(score>=40) return "PROSPECT";
    return "LEAD";

  }

}
