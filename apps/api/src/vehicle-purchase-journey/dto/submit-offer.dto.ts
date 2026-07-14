export class SubmitOfferDto { journeyId!: string; actor!: "BUYER" | "SELLER" | "AZM"; amount!: number; message?: string; accept?: boolean; }
