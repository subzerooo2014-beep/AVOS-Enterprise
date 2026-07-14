import { Injectable } from "@nestjs/common";
import { sellingId } from "./vehicle-selling-journey.utils";
import { ListingPolicy } from "./policies/listing.policy";
import { SellingRepositoryService } from "./services/selling-repository.service";
import { SellingTimelineService } from "./services/selling-timeline.service";
import { MediaUploadService } from "./services/media-upload.service";
import { MediaAnalysisService } from "./services/media-analysis.service";
import { SellerPricingService } from "./services/seller-pricing.service";
import { ListingOptimizationService } from "./services/listing-optimization.service";
import { PublicationService } from "./services/publication.service";
import { LeadManagementService } from "./services/lead-management.service";
import { SellerOfferService } from "./services/seller-offer.service";
import { SellerNegotiationService } from "./services/seller-negotiation.service";
import { SellerReservationService } from "./services/seller-reservation.service";
import { SaleCompletionService } from "./services/sale-completion.service";
import { HandoverService } from "./services/handover.service";
import { SellerAuditService } from "./services/seller-audit.service";

@Injectable()
export class VehicleSellingJourneyService {
  constructor(
    private readonly listingPolicy: ListingPolicy,
    private readonly repo: SellingRepositoryService,
    private readonly timeline: SellingTimelineService,
    private readonly media: MediaUploadService,
    private readonly analysis: MediaAnalysisService,
    private readonly pricing: SellerPricingService,
    private readonly optimizer: ListingOptimizationService,
    private readonly publication: PublicationService,
    private readonly leads: LeadManagementService,
    private readonly offers: SellerOfferService,
    private readonly negotiation: SellerNegotiationService,
    private readonly reservation: SellerReservationService,
    private readonly sale: SaleCompletionService,
    private readonly handover: HandoverService,
    private readonly audit: SellerAuditService,
  ) {}

  create(input: {
    sellerId: string;
    vehicleId: string;
    title: string;
    description: string;
    askingPrice: number;
  }) {
    this.listingPolicy.validate(
      input.title,
      input.description,
      input.askingPrice,
    );
    const now = new Date().toISOString();
    const record = {
      id: sellingId("selling"),
      ...input,
      stage: "DRAFT" as const,
      mediaIds: [],
      leadIds: [],
      offerIds: [],
      publicationChannels: [],
      timeline: [
        {
          stage: "DRAFT" as const,
          note: "Selling journey created",
          createdAt: now,
        },
      ],
      createdAt: now,
      updatedAt: now,
    };
    this.repo.save(record);
    this.audit.record("SELLING_JOURNEY_CREATED", record.id);
    return record;
  }

  uploadMedia(id: string, urls: string[]) {
    const record = this.repo.get(id);
    const media = this.media.upload(urls);
    record.mediaIds.push(...media.map((item) => item.id));
    this.timeline.add(record, "MEDIA_ANALYSIS", "Media uploaded");
    return { record, media };
  }

  analyzeMedia(id: string, urls: string[]) {
    const record = this.repo.get(id);
    const result = this.analysis.analyze(urls);
    this.timeline.add(record, "MEDIA_ANALYSIS", "Media analysis completed");
    return { record, result };
  }

  price(id: string, input: {
    marketAveragePrice: number;
    conditionScore: number;
    mileage: number;
    year: number;
  }) {
    const record = this.repo.get(id);
    const result = this.pricing.calculate({
      askingPrice: record.askingPrice,
      ...input,
    });
    record.recommendedPrice = result.recommendedPrice;
    this.timeline.add(record, "PRICING", "Pricing completed");
    return { record, result };
  }

  optimize(id: string, input: {
    keywords?: string[];
    targetAudience?: string;
  }) {
    const record = this.repo.get(id);
    const result = this.optimizer.optimize({
      title: record.title,
      description: record.description,
      ...input,
    });
    record.title = result.optimizedTitle;
    record.description = result.optimizedDescription;
    this.timeline.add(record, "OPTIMIZATION", "Listing optimized");
    return { record, result };
  }

  publish(id: string, channels: string[]) {
    const record = this.repo.get(id);
    const publications = this.publication.publish(id, channels);
    record.publicationChannels = channels;
    this.timeline.add(record, "PUBLISHED", "Listing published");
    return { record, publications };
  }

  addLead(id: string, input: Record<string, unknown>) {
    const record = this.repo.get(id);
    const lead = this.leads.create({ journeyId: id, ...input });
    record.leadIds.push(String(lead.id));
    this.timeline.add(record, "LEADS", "Lead received");
    return { record, lead };
  }

  addOffer(id: string, input: {
    buyerId: string;
    amount: number;
    message?: string;
  }) {
    const record = this.repo.get(id);
    const offer = this.offers.create({
      journeyId: id,
      askingPrice: record.askingPrice,
      ...input,
    });
    record.offerIds.push(String(offer.id));
    this.timeline.add(record, "OFFERS", "Offer received");
    return { record, offer };
  }

  negotiate(id: string, input: {
    offerPrice: number;
    marketAveragePrice: number;
  }) {
    const record = this.repo.get(id);
    const result = this.negotiation.advise({
      askingPrice: record.askingPrice,
      ...input,
    });
    this.timeline.add(record, "NEGOTIATION", "Negotiation evaluated");
    return { record, result };
  }

  reserve(id: string, input: {
    buyerId: string;
    depositAmount: number;
  }) {
    const record = this.repo.get(id);
    const reservation = this.reservation.create({
      journeyId: id,
      ...input,
    });
    record.reservationId = reservation.id;
    this.timeline.add(record, "RESERVED", "Vehicle reserved");
    return { record, reservation };
  }

  completeSale(id: string, input: {
    buyerId: string;
    finalPrice: number;
    paymentReference: string;
  }) {
    const record = this.repo.get(id);
    const sale = this.sale.complete({ journeyId: id, ...input });
    record.saleId = sale.id;
    this.timeline.add(record, "SOLD", "Vehicle sold");
    return { record, sale };
  }

  scheduleHandover(id: string, input: {
    location: string;
    scheduledAt: string;
  }) {
    const record = this.repo.get(id);
    const handover = this.handover.schedule({
      journeyId: id,
      ...input,
    });
    record.handoverId = handover.id;
    this.timeline.add(record, "HANDOVER", "Handover scheduled");
    this.timeline.add(record, "COMPLETED", "Selling journey completed");
    return { record, handover };
  }

  get(id: string) { return this.repo.get(id); }
  list() { return this.repo.list(); }
}
