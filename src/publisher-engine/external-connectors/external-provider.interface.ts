export type ExternalProviderChannel =
  | "instagram"
  | "tiktok"
  | "google_search";

export interface ExternalProviderRequest {
  eventId: string;
  channel: ExternalProviderChannel;
  payload: any;
  attempt: number;
}

export interface ExternalProviderResponse {
  success: boolean;
  channel: ExternalProviderChannel;
  configured: boolean;
  status:
    | "delivered"
    | "awaiting_credentials"
    | "retrying";
  externalId?: string | null;
  message: string;
  response?: any;
}

export interface ExternalProvider {
  readonly channel: ExternalProviderChannel;

  configured(): boolean;

  health(): Promise<{
    channel: ExternalProviderChannel;
    configured: boolean;
    status:
      | "healthy"
      | "unconfigured"
      | "degraded";
  }>;

  deliver(
    request: ExternalProviderRequest,
  ): Promise<ExternalProviderResponse>;
}
