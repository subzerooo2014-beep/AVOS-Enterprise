export class AuctionEndedEvent { constructor(public readonly auctionId: string, public readonly winnerId?: string) {} }
