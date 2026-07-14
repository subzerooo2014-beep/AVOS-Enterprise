import { Injectable } from '@nestjs/common';
import {
  CognitiveDashboardSnapshot,
  ENTERPRISE_AI_COGNITIVE_CORE_CAPABILITIES,
} from './enterprise-ai-cognitive-core.types';

@Injectable()
export class EnterpriseCognitiveDashboardService {
  snapshot(input: {
    cognitionScore?: number;
    reasoningConfidence?: number;
    knowledgeCoverage?: number;
    memoryHealth?: number;
    learningVelocity?: number;
    activeGoals?: number;
  } = {}): CognitiveDashboardSnapshot {
    return {
      generatedAt: new Date().toISOString(),
      cognitionScore: Math.max(
        0,
        Math.min(100, Math.round(input.cognitionScore ?? 75)),
      ),
      reasoningConfidence: Math.max(
        0,
        Math.min(
          100,
          Math.round((input.reasoningConfidence ?? 0.75) * 100),
        ),
      ),
      knowledgeCoverage: Math.max(
        0,
        Math.min(100, Math.round(input.knowledgeCoverage ?? 75)),
      ),
      memoryHealth: Math.max(
        0,
        Math.min(100, Math.round(input.memoryHealth ?? 75)),
      ),
      learningVelocity: Math.max(
        0,
        Math.round(input.learningVelocity ?? 0),
      ),
      activeGoals: Math.max(
        0,
        Math.round(input.activeGoals ?? 0),
      ),
      capabilityStatus: Object.fromEntries(
        ENTERPRISE_AI_COGNITIVE_CORE_CAPABILITIES.map((capability) => [
          capability,
          'operational',
        ]),
      ) as CognitiveDashboardSnapshot['capabilityStatus'],
    };
  }
}