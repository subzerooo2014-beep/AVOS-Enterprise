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
exports.AvosDnaService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AvosDnaService = class AvosDnaService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async seedDefaults() {
        const rules = [
            {
                key: "trust-first",
                category: "trust",
                title: "Trust First",
                description: "Every decision must increase user trust or reduce risk.",
                priority: 100,
            },
            {
                key: "ai-first",
                category: "ai",
                title: "AI First",
                description: "Every major workflow should be AI-ready, explainable, and measurable.",
                priority: 95,
            },
            {
                key: "global-first",
                category: "global",
                title: "Global First",
                description: "The platform must support export, multi-country, multi-language and multi-currency growth.",
                priority: 90,
            },
            {
                key: "business-first",
                category: "business",
                title: "Business First",
                description: "Every feature should improve revenue, speed, trust, automation or ecosystem value.",
                priority: 90,
            },
            {
                key: "explainable-ai",
                category: "ai",
                title: "Explainable AI",
                description: "AI must explain why it recommends, blocks, ranks or promotes something.",
                priority: 95,
            },
        ];
        const saved = [];
        for (const rule of rules) {
            const existing = await this.prisma.avosDnaRule.findUnique({
                where: { key: rule.key },
            });
            if (existing) {
                saved.push(existing);
            }
            else {
                saved.push(await this.prisma.avosDnaRule.create({ data: rule }));
            }
        }
        return saved;
    }
    list() {
        return this.prisma.avosDnaRule.findMany({
            orderBy: [{ priority: "desc" }, { createdAt: "asc" }],
        });
    }
};
exports.AvosDnaService = AvosDnaService;
exports.AvosDnaService = AvosDnaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AvosDnaService);
//# sourceMappingURL=avos-dna.service.js.map