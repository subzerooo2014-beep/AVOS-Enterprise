import { Injectable } from "@nestjs/common";

@Injectable()
export class VectorStoreService {

  private store:any[]=[];

  add(id:string,vector:number[],metadata:any){
    this.store.push({id,vector,metadata});
    return true;
  }

  search(vector:number[]){
    return this.store.slice(0,10);
  }

}
