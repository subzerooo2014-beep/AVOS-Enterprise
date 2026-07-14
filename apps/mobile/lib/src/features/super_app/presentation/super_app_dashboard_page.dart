import 'package:flutter/material.dart';
import '../../../../design_system/avos_colors.dart';
import '../../../../design_system/luxury_card.dart';
import '../data/super_app_api.dart';

class SuperAppDashboardPage extends StatefulWidget {
  const SuperAppDashboardPage({super.key});

  @override
  State<SuperAppDashboardPage> createState() =>
      _SuperAppDashboardPageState();
}

class _SuperAppDashboardPageState extends State<SuperAppDashboardPage> {
  final _api = SuperAppApi();
  final _intentController = TextEditingController(
    text: 'أريد لاندكروزر موثوق مع تمويل وتأمين',
  );

  bool _loading = false;
  String _status = 'جاهز';
  int _score = 0;
  int _agents = 0;
  int _steps = 0;

  Future<void> _execute() async {
    setState(() {
      _loading = true;
      _status = 'جاري تشغيل عزم والوكلاء...';
    });

    try {
      final result = await _api.execute(
        userId: 'demo-user',
        intent: _intentController.text.trim(),
      );

      final workflow = result['workflow'] as Map<String, dynamic>;
      final steps = workflow['steps'] as List<dynamic>;

      setState(() {
        _status = 'اكتملت الرحلة الذكية';
        _score = result['overallScore'] as int? ?? 0;
        _agents = result['completedAgents'] as int? ?? 0;
        _steps = steps.length;
      });
    } catch (_) {
      setState(() {
        _status = 'تعذر الاتصال بالـ API';
      });
    } finally {
      setState(() => _loading = false);
    }
  }

  @override
  void dispose() {
    _intentController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        appBar: AppBar(title: const Text('AVOS Super App')),
        body: ListView(
          padding: const EdgeInsets.all(18),
          children: [
            const LuxuryCard(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'عزم Orchestrator',
                    style: TextStyle(
                      color: AvosColors.emerald,
                      fontWeight: FontWeight.w900,
                    ),
                  ),
                  SizedBox(height: 8),
                  Text(
                    'اكتب هدفك ودع الوكلاء ينفذون الرحلة كاملة.',
                    style: TextStyle(
                      fontSize: 22,
                      fontWeight: FontWeight.w900,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),
            LuxuryCard(
              child: Column(
                children: [
                  TextField(
                    controller: _intentController,
                    minLines: 2,
                    maxLines: 4,
                    decoration: const InputDecoration(
                      labelText: 'هدفك',
                    ),
                  ),
                  const SizedBox(height: 14),
                  SizedBox(
                    width: double.infinity,
                    child: FilledButton.icon(
                      onPressed: _loading ? null : _execute,
                      icon: _loading
                          ? const SizedBox(
                              width: 18,
                              height: 18,
                              child: CircularProgressIndicator(
                                strokeWidth: 2,
                              ),
                            )
                          : const Icon(Icons.auto_awesome),
                      label: const Text('تشغيل الرحلة الذكية'),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),
            LuxuryCard(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    _status,
                    style: const TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.w900,
                    ),
                  ),
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      Expanded(
                        child: _Metric(
                          label: 'النتيجة',
                          value: '$_score',
                        ),
                      ),
                      const SizedBox(width: 10),
                      Expanded(
                        child: _Metric(
                          label: 'الوكلاء',
                          value: '$_agents',
                        ),
                      ),
                      const SizedBox(width: 10),
                      Expanded(
                        child: _Metric(
                          label: 'الخطوات',
                          value: '$_steps',
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _Metric extends StatelessWidget {
  const _Metric({
    required this.label,
    required this.value,
  });

  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AvosColors.emerald.withValues(alpha: 0.08),
        borderRadius: BorderRadius.circular(18),
      ),
      child: Column(
        children: [
          Text(
            value,
            style: const TextStyle(
              color: AvosColors.emerald,
              fontSize: 24,
              fontWeight: FontWeight.w900,
            ),
          ),
          Text(label),
        ],
      ),
    );
  }
}