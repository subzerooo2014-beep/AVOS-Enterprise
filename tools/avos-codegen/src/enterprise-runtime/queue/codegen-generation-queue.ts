export class CodeGenGenerationQueue{
 private readonly jobs:any[]=[];
 enqueue(job:any){this.jobs.push(job);}
 dequeue(){return this.jobs.shift();}
 list(){return [...this.jobs];}
}
