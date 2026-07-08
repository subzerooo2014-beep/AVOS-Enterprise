export class CrmAnalytics{

 summary(total:number,active:number){

   return{
      total,
      active,
      inactive:total-active,
   };

 }

}
