export const avosConfig = {
  appName: process.env.NEXT_PUBLIC_AVOS_APP_NAME ?? 'AVOS Enterprise',
  apiBaseUrl:
    process.env.NEXT_PUBLIC_AVOS_API_BASE_URL ??
    'http://localhost:3000',
  environment:
    process.env.NEXT_PUBLIC_AVOS_ENVIRONMENT ?? 'development',
} as const;