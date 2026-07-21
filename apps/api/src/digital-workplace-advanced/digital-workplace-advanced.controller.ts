import { Body, Controller, Get, Post } from '@nestjs/common';
import { DigitalWorkplaceAdvancedService } from './digital-workplace-advanced.service';

@Controller('avos/digital-workplace/advanced')
export class DigitalWorkplaceAdvancedController {
  constructor(private readonly runtime: DigitalWorkplaceAdvancedService) {}

  @Get('status')
  status() {
    return this.runtime.getStatus();
  }

  @Get('identity')
  identity() {
    return this.runtime.getIdentity();
  }

  @Get('micro-frontends')
  manifests() {
    return this.runtime.getManifests();
  }

  @Get('events')
  events() {
    return this.runtime.getEvents();
  }

  @Post('events')
  publishEvent(
    @Body() body: { topic: string; source: string; payload?: Record<string, unknown> },
  ) {
    return this.runtime.publishEvent(body.topic, body.source, body.payload ?? {});
  }

  @Post('commands')
  executeCommand(@Body() body: { command: string }) {
    return this.runtime.executeCommand(body.command);
  }

  @Post('assistant')
  assistant(@Body() body: { prompt: string }) {
    return this.runtime.askAssistant(body.prompt);
  }

  @Get('monitor')
  monitor() {
    return this.runtime.getMonitor();
  }

  @Get('certification')
  certification() {
    return this.runtime.getCertification();
  }
}