import { Injectable } from '@nestjs/common';
import { LearningObservation } from './enterprise-ai-cognitive-core.types';

@Injectable()
export class EnterpriseLearningEngineService {
  learn(observations: LearningObservation[]) {
    const lessons = observations.map((observation) => {
      const error = observation.actualOutcome - observation.expectedOutcome;
      return {
        observationId: observation.id,
        context: observation.context,
        error,
        direction:
          error > 0 ? 'positive' : error < 0 ? 'negative' : 'neutral',
        confidence: observation.confidence,
        adjustment: Number((error * observation.confidence).toFixed(2)),
      };
    });

    return {
      lessons,
      learningVelocity: Number(
        (
          lessons.reduce(
            (sum, lesson) => sum + Math.abs(lesson.adjustment),
            0,
          ) / Math.max(1, lessons.length)
        ).toFixed(2),
      ),
      positiveLessons: lessons.filter(
        (lesson) => lesson.direction === 'positive',
      ).length,
      negativeLessons: lessons.filter(
        (lesson) => lesson.direction === 'negative',
      ).length,
    };
  }
}