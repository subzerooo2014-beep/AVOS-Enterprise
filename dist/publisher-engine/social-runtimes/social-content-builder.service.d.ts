import { PublisherContext } from "../contracts/publisher.types";
export interface SocialPublicationContent {
    headline: string;
    caption: string;
    description: string;
    hashtags: string[];
    callToAction: string;
    targetUrl: string;
    keywords: string[];
    media: {
        imageUrl: string | null;
        videoUrl: string | null;
    };
    campaign: {
        objective: string;
        audience: string;
        language: string;
        country: string;
        budgetMode: string;
    };
}
export declare class SocialContentBuilderService {
    build(channel: string, vehicle: any, context: PublisherContext): SocialPublicationContent;
    private resolveTargetUrl;
    private defaultHeadline;
    private defaultDescription;
    private buildHashtags;
    private buildCaption;
    private callToAction;
    private objective;
    private hashtag;
}
