import { Injectable } from "@nestjs/common";
import { PublisherChannelStatisticsService } from "./publisher-channel-statistics.service";

@Injectable()
export class PublisherChannelSummaryService{

  constructor(
    private readonly statistics:PublisherChannelStatisticsService,
  ){}

  summary(jobs:any[]){
    return{
      total:jobs.length,
      channels:this.statistics.statistics(jobs),
      generatedAt:new Date(),
    };
  }

}
