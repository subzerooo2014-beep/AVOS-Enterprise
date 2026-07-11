"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NegotiationEngineService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let NegotiationEngineService = class NegotiationEngineService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    createSession(data) {
        const asking = Number(data.askingPrice || 0);
        const offer = Number(data.offerPrice || 0);
        const gap = asking > 0 ? ((asking - offer) / asking) * 100 : 0;
        return this.prisma.negotiationSession.create({
            data: {
                dealId: data.dealId,
                sellerId: data.sellerId,
                buyerId: data.buyerId,
                askingPrice: asking,
                offerPrice: offer,
                status: "open",
                aiAdvice: gap <= 5
                    ? "Offer is close. Recommend closing the deal."
                    : gap <= 15
                        ? "Negotiate with a small counter offer."
                        : "Offer is low. Ask buyer to improve or provide financing options.",
                metadata: { gapPercent: Number(gap.toFixed(2)) },
            },
        });
    }
    async counterOffer(id, body) {
        const session = await this.prisma.negotiationSession.findUnique({ where: { id } });
        if (!session)
            throw new common_1.NotFoundException("Negotiation session not found");
        const asking = Number(session.askingPrice || 0);
        const offer = Number(body.offerPrice || session.offerPrice || 0);
        const gap = asking > 0 ? ((asking - offer) / asking) * 100 : 0;
        return this.prisma.negotiationSession.update({
            where: { id },
            data: {
                offerPrice: offer,
                aiAdvice: gap <= 5
                    ? "Accept recommended."
                    : gap <= 12
                        ? "Send counter offer with value justification."
                        : "Do not accept yet. Buyer quality and market demand should be checked.",
                metadata: {
                    ...(session.metadata || {}),
                    lastCounterOffer: body,
                    gapPercent: Number(gap.toFixed(2)),
                },
            },
        });
    }
    list() {
        return this.prisma.negotiationSession.findMany({ orderBy: { createdAt: "desc" } });
    }
};
exports.NegotiationEngineService = NegotiationEngineService;
exports.NegotiationEngineService = NegotiationEngineService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], NegotiationEngineService);
//# sourceMappingURL=negotiation-engine.service.js.map