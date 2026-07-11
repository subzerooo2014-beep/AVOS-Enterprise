import { Injectable } from "@nestjs/common";

@Injectable()
export class PublisherAdapterMetricsService {
  private readonly metrics = new Map<string,{
    success:number;
    failed:number;
  }>();

  success(channel:string){
    const item=this.metrics.get(channel) ?? {success:0,failed:0};
    item.success++;
    this.metrics.set(channel,item);
  }

  failure(channel:string){
    const item=this.metrics.get(channel) ?? {success:0,failed:0};
    item.failed++;
    this.metrics.set(channel,item);
  }

  report(){
    return Object.fromEntries(this.metrics.entries());
  }
}
