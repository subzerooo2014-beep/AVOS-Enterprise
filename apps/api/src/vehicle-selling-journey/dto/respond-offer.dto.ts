export class RespondOfferDto { journeyId!: string; offerId!: string; action!: "ACCEPT" | "REJECT" | "COUNTER"; counterAmount?: number; }
