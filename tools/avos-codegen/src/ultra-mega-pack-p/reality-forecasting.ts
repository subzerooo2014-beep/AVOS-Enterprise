export interface RealityForecastSignal {
  key: string;
  current: number;
  trend: number;
  volatility: number;
  horizon: number;
  weight: number;
}

export interface RealityForecast {
  key: string;
  predicted: number;
  confidence: number;
  risk: number;
}

export interface StrategicRealityForecastResult {
  forecasts: RealityForecast[];
  forecastScore: number;
  generatedAt: string;
}

export class StrategicRealityForecaster {
  forecast(
    signals: readonly RealityForecastSignal[],
  ): StrategicRealityForecastResult {
    const forecasts = signals.map((signal): RealityForecast => {
      const predicted = Math.round(
        signal.current + signal.trend * signal.horizon,
      );

      const confidence = Math.max(
        0,
        Math.min(100, Math.round(100 - signal.volatility * 0.7)),
      );

      const risk = Math.max(
        0,
        Math.min(
          100,
          Math.round(
            Math.abs(signal.trend) * signal.horizon * 0.5 +
              signal.volatility * 0.5,
          ),
        ),
      );

      return {
        key: signal.key,
        predicted,
        confidence,
        risk,
      };
    });

    return {
      forecasts,
      forecastScore:
        forecasts.length === 0
          ? 100
          : Math.round(
              forecasts.reduce(
                (sum, item) => sum + item.confidence - item.risk * 0.25,
                0,
              ) / forecasts.length,
            ),
      generatedAt: new Date().toISOString(),
    };
  }
}
