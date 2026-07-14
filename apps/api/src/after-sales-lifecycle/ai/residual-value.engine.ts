import { Injectable } from "@nestjs/common";
@Injectable()
export class ResidualValueEngine {
  estimate(input:{originalPrice:number;ageYears:number;mileage:number;conditionScore:number}) {
    const depreciation=Math.min(.75,input.ageYears*.08+input.mileage/500000);
    const conditionFactor=.7+input.conditionScore/333;
    const value=Math.max(input.originalPrice*.15,input.originalPrice*(1-depreciation)*conditionFactor);
    return {estimatedValue:Math.round(value),depreciationPercent:Math.round(depreciation*100)};
  }
}
