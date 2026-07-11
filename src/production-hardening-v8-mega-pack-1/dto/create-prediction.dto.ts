export class CreatePredictionDto {
  predictionType!:
    | "capacity_exhaustion"
    | "latency_degradation"
    | "error_spike"
    | "memory_pressure"
    | "cpu_saturation"
    | "service_failure";
  probabilityPercent!: number;
  forecastWindowMinutes?: number;
  predictedValue!: number;
  thresholdValue!: number;
  recommendedDecision?:
    | "monitor"
    | "scale_up"
    | "scale_down"
    | "throttle"
    | "reroute"
    | "restart_service"
    | "activate_recovery"
    | "block_change"
    | "no_action";
  explanation?: string;
}
