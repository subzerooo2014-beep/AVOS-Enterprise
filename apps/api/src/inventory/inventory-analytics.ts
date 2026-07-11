export class InventoryAnalytics{

 summary(total:number,available:number){

   return{
      total,
      available,
      reserved:total-available,
   };

 }

}
