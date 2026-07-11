export class DiscountEngine{

 static apply(total:number,discount:number){

   return Math.max(total-discount,0);

 }

}
