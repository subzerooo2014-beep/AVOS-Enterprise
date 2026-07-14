import { Injectable } from "@nestjs/common";
@Injectable()
export class CommunicationEngagementOsService {
  health(){
    return {success:true,system:"AVOS Communication, Collaboration & Customer Engagement OS",status:"healthy"};
  }
}
