export class PricingRules{

 static finalPrice(price:number,tax:number,discount:number){

   return (price-discount)+(price*tax);

 }

}
