export class RevenueAnalytics{

 static summary(revenue:number,cost:number){

   return{
      revenue,
      cost,
      profit:revenue-cost,
   };

 }

}
