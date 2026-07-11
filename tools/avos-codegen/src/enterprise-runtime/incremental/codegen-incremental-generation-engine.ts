export class CodeGenIncrementalGenerationEngine{
 shouldGenerate(current:string,next:string){
   return current!==next;
 }
}
