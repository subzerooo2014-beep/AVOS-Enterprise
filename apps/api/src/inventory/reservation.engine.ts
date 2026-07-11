export class ReservationEngine{

 reserve(id:string){

   return{
      vehicleId:id,
      reserved:true,
   };

 }

 release(id:string){

   return{
      vehicleId:id,
      reserved:false,
   };

 }

}
