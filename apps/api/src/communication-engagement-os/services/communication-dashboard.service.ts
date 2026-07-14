import { Injectable } from "@nestjs/common";
@Injectable()
export class CommunicationDashboardService {
  summary(){
    return {
      openConversations:0,
      activeCalls:0,
      openTickets:0,
      queuedNotifications:0,
      slaCompliance:100,
    };
  }
}
