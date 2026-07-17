import { Module } from '@nestjs/common';
import { GlobalIdentityFederationController } from './global-identity-federation.controller';
import { GlobalIdentityFederationService } from './global-identity-federation.service';

@Module({
  controllers: [GlobalIdentityFederationController],
  providers: [GlobalIdentityFederationService],
  exports: [GlobalIdentityFederationService],
})
export class GlobalIdentityFederationModule {}