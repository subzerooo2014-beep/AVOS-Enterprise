import { Body, Controller, Get, Post } from "@nestjs/common";
import { CommunicationEngagementOsService } from "./communication-engagement-os.service";
import { ConversationService } from "./services/conversation.service";
import { MessageService } from "./services/message.service";
import { VoiceCallService } from "./services/voice-call.service";
import { VideoCallService } from "./services/video-call.service";
import { SupportTicketService } from "./services/support-ticket.service";
import { NotificationCenterService } from "./services/notification-center.service";
import { CampaignMessagingService } from "./services/campaign-messaging.service";
import { CollaborationRoomService } from "./services/collaboration-room.service";
import { CommunicationDashboardService } from "./services/communication-dashboard.service";
import { AgentAssistEngine } from "./ai/agent-assist.engine";
import { SentimentEngine } from "./ai/sentiment.engine";
import { IntentDetectionEngine } from "./ai/intent-detection.engine";
import { SmartRoutingEngine } from "./ai/smart-routing.engine";
import { ResponseGenerationEngine } from "./ai/response-generation.engine";
import { EngagementScoringEngine } from "./ai/engagement-scoring.engine";
import { ChurnSignalEngine } from "./ai/churn-signal.engine";
import { ConversationSummaryEngine } from "./ai/conversation-summary.engine";

@Controller("communication-engagement-os")
export class CommunicationEngagementOsController {
  constructor(
    private readonly os:CommunicationEngagementOsService,
    private readonly conversations:ConversationService,
    private readonly messages:MessageService,
    private readonly voice:VoiceCallService,
    private readonly video:VideoCallService,
    private readonly tickets:SupportTicketService,
    private readonly notifications:NotificationCenterService,
    private readonly campaigns:CampaignMessagingService,
    private readonly rooms:CollaborationRoomService,
    private readonly dashboard:CommunicationDashboardService,
    private readonly assist:AgentAssistEngine,
    private readonly sentiment:SentimentEngine,
    private readonly intent:IntentDetectionEngine,
    private readonly routing:SmartRoutingEngine,
    private readonly response:ResponseGenerationEngine,
    private readonly engagement:EngagementScoringEngine,
    private readonly churn:ChurnSignalEngine,
    private readonly summary:ConversationSummaryEngine
  ){}
  @Get("health") health(){return this.os.health();}
  @Post("conversations") conversation(@Body() b:any){return {success:true,conversation:this.conversations.create(b)};}
  @Post("messages") message(@Body() b:any){return {success:true,message:this.messages.create(b)};}
  @Post("voice-calls") voiceCall(@Body() b:any){return {success:true,call:this.voice.create(b)};}
  @Post("video-calls") videoCall(@Body() b:any){return {success:true,call:this.video.create(b)};}
  @Post("tickets") ticket(@Body() b:any){return {success:true,ticket:this.tickets.create(b)};}
  @Post("notifications") notification(@Body() b:any){return {success:true,notification:this.notifications.create(b)};}
  @Post("campaign-messages") campaign(@Body() b:any){return {success:true,campaign:this.campaigns.create(b)};}
  @Post("collaboration-rooms") room(@Body() b:any){return {success:true,room:this.rooms.create(b)};}
  @Post("ai/agent-assist") agentAssist(@Body() b:any){return this.assist.suggest(b);}
  @Post("ai/sentiment") sentimentAnalysis(@Body() b:any){return this.sentiment.analyze(b.text??"");}
  @Post("ai/intent") intentDetection(@Body() b:any){return this.intent.detect(b.text??"");}
  @Post("ai/routing") smartRouting(@Body() b:any){return this.routing.route(b);}
  @Post("ai/response") generateResponse(@Body() b:any){return this.response.generate(b.topic,b.tone);}
  @Post("ai/engagement") engagementScore(@Body() b:any){return this.engagement.score(b);}
  @Post("ai/churn") churnSignal(@Body() b:any){return this.churn.evaluate(b);}
  @Post("ai/summary") conversationSummary(@Body() b:any){return this.summary.summarize(b.messages??[]);}
  @Get("operations/dashboard") operations(){return {success:true,dashboard:this.dashboard.summary()};}
}
