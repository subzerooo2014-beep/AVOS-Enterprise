export class PipelineMetrics{

 conversion(leads:number,wins:number){

   return leads===0?0:(wins/leads)*100;

 }

}
