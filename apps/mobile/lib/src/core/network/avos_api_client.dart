import 'dart:convert';
import 'package:http/http.dart' as http;
import '../config/environment.dart';

class AvosApiClient {
  AvosApiClient({http.Client? client}) : _client = client ?? http.Client();

  final http.Client _client;

  Future<Map<String, dynamic>> getHealth() async {
    final response = await _client.get(
      Uri.parse('${Environment.apiBaseUrl}/health'),
    );

    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw Exception('AVOS API health request failed: ${response.statusCode}');
    }

    final decoded = jsonDecode(response.body);
    if (decoded is Map<String, dynamic>) {
      return decoded;
    }

    return <String, dynamic>{'raw': decoded};
  }
}