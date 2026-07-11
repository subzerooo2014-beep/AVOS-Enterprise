export class CodeGenExecutionMetricsCollector{
 private metrics=new Map<string,number>();
 increment(key:string){
   this.metrics.set(key,(this.metrics.get(key)??0)+1);
 }
 snapshot(){
   return Object.fromEntries(this.metrics);
 }
}
