import { Module } from "@nestjs/common";
import { CommunicationEngagementOsController } from "./communication-engagement-os.controller";
import { CommunicationEngagementOsService } from "./communication-engagement-os.service";
import { ConversationService } from "./services/conversation.service";
import { MessageService } from "./services/message.service";
import { VoiceCallService } from "./services/voice-call.service";
import { VideoCallService } from "./services/video-call.service";
import { SupportTicketService } from "./services/support-ticket.service";
import { NotificationCenterService } from "./services/notification-center.service";
import { CampaignMessagingService } from "./services/campaign-messaging.service";
import { EmailTemplateService } from "./services/email-template.service";
import { SmsTemplateService } from "./services/sms-template.service";
import { PushTemplateService } from "./services/push-template.service";
import { WhatsappTemplateService } from "./services/whatsapp-template.service";
import { EngagementSegmentService } from "./services/engagement-segment.service";
import { EngagementEventService } from "./services/engagement-event.service";
import { AgentNoteService } from "./services/agent-note.service";
import { CustomerFeedbackService } from "./services/customer-feedback.service";
import { SlaManagementService } from "./services/sla-management.service";
import { RoutingRuleService } from "./services/routing-rule.service";
import { CollaborationRoomService } from "./services/collaboration-room.service";
import { PresenceService } from "./services/presence.service";
import { CommunicationReportingService } from "./services/communication-reporting.service";
import { CommunicationAuditService } from "./services/communication-audit.service";
import { OmnichannelInboxService } from "./services/omnichannel-inbox.service";
import { CommunicationDashboardService } from "./services/communication-dashboard.service";
import { AgentAssistEngine } from "./ai/agent-assist.engine";
import { SentimentEngine } from "./ai/sentiment.engine";
import { IntentDetectionEngine } from "./ai/intent-detection.engine";
import { SmartRoutingEngine } from "./ai/smart-routing.engine";
import { ResponseGenerationEngine } from "./ai/response-generation.engine";
import { EngagementScoringEngine } from "./ai/engagement-scoring.engine";
import { ChurnSignalEngine } from "./ai/churn-signal.engine";
import { ConversationSummaryEngine } from "./ai/conversation-summary.engine";
import { ChatChannel } from "./channels/chat.channel";
import { VoiceChannel } from "./channels/voice.channel";
import { VideoChannel } from "./channels/video.channel";
import { EmailChannel } from "./channels/email.channel";
import { SmsChannel } from "./channels/sms.channel";
import { PushChannel } from "./channels/push.channel";
import { WhatsappChannel } from "./channels/whatsapp.channel";
import { SocialChannel } from "./channels/social.channel";

@Module({
  controllers:[CommunicationEngagementOsController],
  providers:[
    CommunicationEngagementOsService,
    ConversationService,MessageService,VoiceCallService,VideoCallService,SupportTicketService,NotificationCenterService,
    CampaignMessagingService,EmailTemplateService,SmsTemplateService,PushTemplateService,WhatsappTemplateService,
    EngagementSegmentService,EngagementEventService,AgentNoteService,CustomerFeedbackService,SlaManagementService,
    RoutingRuleService,CollaborationRoomService,PresenceService,CommunicationReportingService,CommunicationAuditService,
    OmnichannelInboxService,CommunicationDashboardService,
    AgentAssistEngine,SentimentEngine,IntentDetectionEngine,SmartRoutingEngine,ResponseGenerationEngine,
    EngagementScoringEngine,ChurnSignalEngine,ConversationSummaryEngine,
    ChatChannel,VoiceChannel,VideoChannel,EmailChannel,SmsChannel,PushChannel,WhatsappChannel,SocialChannel
  ],
  exports:[CommunicationEngagementOsService],
})
export class CommunicationEngagementOsModule {}
