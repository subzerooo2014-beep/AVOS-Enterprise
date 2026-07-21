import { Injectable } from '@nestjs/common';

@Injectable()
export class MobilityGlobalizationService {
  private readonly markets = [
    {
      countryCode: 'AE',
      languages: ['ar', 'en'],
      currencies: ['AED'],
      defaultLanguage: 'ar',
      complianceModule: 'uae-bootstrap',
    },
  ];

  listMarkets() {
    return this.markets;
  }

  resolve(countryCode = 'AE', language = 'ar', currency = 'AED') {
    return {
      countryCode: countryCode.toUpperCase(),
      language,
      currency: currency.toUpperCase(),
      supported: this.markets.some(
        (market) =>
          market.countryCode === countryCode.toUpperCase() &&
          market.languages.includes(language) &&
          market.currencies.includes(currency.toUpperCase()),
      ),
      architectureReadyForAdditionalMarkets: true,
      jurisdictionAwareComplianceRequired: true,
    };
  }
}