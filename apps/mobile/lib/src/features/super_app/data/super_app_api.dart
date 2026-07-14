import 'dart:convert';
import 'package:http/http.dart' as http;
import '../../../core/config/environment.dart';

class SuperAppApi {
  SuperAppApi({http.Client? client}) : _client = client ?? http.Client();

  final http.Client _client;

  Future<Map<String, dynamic>> execute({
    required String userId,
    required String intent,
  }) async {
    final response = await _client.post(
      Uri.parse('${Environment.apiBaseUrl}/super-app-v1/execute'),
      headers: {'content-type': 'application/json'},
      body: jsonEncode({
        'userId': userId,
        'intent': intent,
      }),
    );

    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw Exception('Super App execution failed: ${response.statusCode}');
    }

    return jsonDecode(response.body) as Map<String, dynamic>;
  }

  Future<Map<String, dynamic>> dashboard(String userId) async {
    final response = await _client.get(
      Uri.parse('${Environment.apiBaseUrl}/super-app-v1/dashboard/$userId'),
    );

    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw Exception('Dashboard request failed: ${response.statusCode}');
    }

    return jsonDecode(response.body) as Map<String, dynamic>;
  }
}