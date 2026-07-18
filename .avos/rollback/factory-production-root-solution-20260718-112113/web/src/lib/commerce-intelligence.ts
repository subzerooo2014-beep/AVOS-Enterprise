export interface FinanceQuote {
  downPayment: number;
  financedAmount: number;
  monthlyPayment: number;
  durationMonths: number;
}

export function calculateFinanceQuote(input: {
  vehiclePrice: number;
  downPaymentPercent: number;
  durationMonths: number;
  annualRate: number;
}): FinanceQuote {
  const downPayment =
    input.vehiclePrice * (input.downPaymentPercent / 100);

  const financedAmount =
    input.vehiclePrice - downPayment;

  const monthlyRate =
    input.annualRate / 100 / 12;

  const monthlyPayment =
    monthlyRate === 0
      ? financedAmount / input.durationMonths
      : financedAmount *
        (
          monthlyRate *
          Math.pow(1 + monthlyRate, input.durationMonths)
        ) /
        (
          Math.pow(1 + monthlyRate, input.durationMonths) - 1
        );

  return {
    downPayment: Math.round(downPayment),
    financedAmount: Math.round(financedAmount),
    monthlyPayment: Math.round(monthlyPayment),
    durationMonths: input.durationMonths,
  };
}

export interface SmartOffer {
  recommendedOffer: number;
  likelyAcceptance: number;
  confidence: number;
  message: string;
}

export function calculateSmartOffer(input: {
  askingPrice: number;
  daysListed: number;
  marketScore: number;
}): SmartOffer {
  const timeDiscount =
    Math.min(0.05, input.daysListed / 700);

  const scoreDiscount =
    Math.max(0, (85 - input.marketScore) / 1000);

  const discount =
    Math.min(0.08, 0.02 + timeDiscount + scoreDiscount);

  const recommendedOffer =
    Math.round(
      input.askingPrice * (1 - discount) / 1000,
    ) * 1000;

  const likelyAcceptance =
    Math.round(
      input.askingPrice *
        (1 - Math.min(0.1, discount + 0.02)) /
        1000,
    ) * 1000;

  return {
    recommendedOffer,
    likelyAcceptance,
    confidence: 91,
    message:
      "ابدأ بالعرض المقترح واترك مساحة بسيطة للاتفاق النهائي.",
  };
}
