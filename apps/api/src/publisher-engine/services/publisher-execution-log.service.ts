import { Injectable } from "@nestjs/common";

@Injectable()
export class PublisherExecutionLogService {
  private readonly logs:any[] = [];

  write(entry:any) {
    this.logs.unshift({
      ...entry,
      timestamp:new Date(),
    });

    if(this.logs.length>1000){
      this.logs.length=1000;
    }
  }

  latest(limit=100){
    return this.logs.slice(0,limit);
  }
}
