import { Injectable } from "@nestjs/common";

@Injectable()
export class PublisherJobHistoryService {
  private readonly history:any[] = [];

  push(item:any){
    this.history.unshift({
      ...item,
      timestamp:new Date(),
    });

    if(this.history.length>1000){
      this.history.length=1000;
    }
  }

  latest(limit=100){
    return this.history.slice(0,limit);
  }

  clear(){
    this.history.length=0;
  }
}
