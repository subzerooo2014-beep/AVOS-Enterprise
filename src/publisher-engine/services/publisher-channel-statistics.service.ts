import { Injectable } from "@nestjs/common";

@Injectable()
export class PublisherChannelStatisticsService{

  statistics(jobs:any[]){

    const result:Record<string,number>={};

    for(const job of jobs){

      const channel=
        job?.result?.publisher?.channel ??
        job?.result?.channel ??
        "internal";

      result[channel]=(result[channel] ?? 0)+1;

    }

    return result;

  }

}
