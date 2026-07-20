import { Module } from '@nestjs/common';

/**
 * Compatibility boundary for the Enterprise Reasoning System.
 *
 * This module restores the declared AVOS architecture boundary without
 * inventing domain behavior. Future reasoning providers/controllers can be
 * registered here while existing imports remain stable.
 */
@Module({
  imports: [],
  controllers: [],
  providers: [],
  exports: [],
})
export class EnterpriseReasoningSystemModule {}
