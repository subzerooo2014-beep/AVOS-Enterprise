import { Injectable } from "@nestjs/common";
@Injectable()
export class LifecyclePredictiveMaintenanceEngine {
  evaluate(input:{odometer:number;lastServiceOdometer:number;engineTemperature:number;batteryVoltage:number}) {
    let risk=Math.min(60,(input.odometer-input.lastServiceOdometer)/200);
    if(input.engineTemperature>105) risk+=25;
    if(input.batteryVoltage<11.8) risk+=20;
    risk=Math.max(0,Math.min(100,Math.round(risk)));
    return {risk,recommendation:risk>=70?"IMMEDIATE_SERVICE":risk>=45?"SCHEDULE_SERVICE":"MONITOR"};
  }
}
