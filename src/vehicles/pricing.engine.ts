export class PricingEngine{

 static calculate(
   price:number,
   tax:number,
   discount:number,
 ){

   const subtotal=price-discount;

   return{
      subtotal,
      tax:subtotal*tax,
      total:subtotal+(subtotal*tax),
   };

 }

}
