class Environment {
  static const String apiBaseUrl = String.fromEnvironment(
    'AVOS_API_URL',
    defaultValue: 'http://10.0.2.2:3000',
  );

  static const String environment = String.fromEnvironment(
    'AVOS_ENV',
    defaultValue: 'development',
  );
}