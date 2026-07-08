export class RefundEngine{

 static refund(amount:number){

   return{
      refunded:true,
      amount,
   };

 }

}
