export class FollowUpEngine{

 next(days:number){

   const d=new Date();

   d.setDate(d.getDate()+days);

   return d;

 }

}
