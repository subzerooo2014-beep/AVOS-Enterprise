import 'package:flutter/material.dart';
import '../../../../design_system/avos_colors.dart';
import '../../../../design_system/luxury_card.dart';
import '../data/super_app_v2_api.dart';

class SuperAppV2DashboardPage extends StatefulWidget {
  const SuperAppV2DashboardPage({super.key});

  @override
  State<SuperAppV2DashboardPage> createState() =>
      _SuperAppV2DashboardPageState();
}

class _SuperAppV2DashboardPageState
    extends State<SuperAppV2DashboardPage> {
  final _api = SuperAppV2Api();
  final _intentController = TextEditingController(
    text: 'أريد شراء مركبة موثوقة مع تمويل وتأمين وفحص',
  );

  bool _loading = false;
  String _status = 'جاهز';
  int _agents = 0;
  int _events = 0;
  int _score = 0;
  int _completedWorkflows = 0;

  Future<void> _run() async {
    setState(() {
      _loading = true;
      _status = 'الوكلاء يعملون بالتوازي...';
    });

    try {
      final result = await _api.execute(
        userId: 'demo-user',
        intent: _intentController.text.trim(),
      );

      final results = result['results'] as List<dynamic>;
      final metrics = await _api.metrics();

      setState(() {
        _status = 'اكتملت الرحلة';
        _agents = results.length;
        _score = result['overallScore'] as int? ?? 0;
        _events = metrics['events'] as int? ?? 0;
        _completedWorkflows =
            metrics['completedWorkflows'] as int? ?? 0;
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
        appBar: AppBar(
          title: const Text('Super App Phase 2'),
        ),
        body: ListView(
          padding: const EdgeInsets.all(18),
          children: [
            const LuxuryCard(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Parallel Agent Runtime',
                    style: TextStyle(
                      color: AvosColors.emerald,
                      fontWeight: FontWeight.w900,
                    ),
                  ),
                  SizedBox(height: 8),
                  Text(
                    'الوكلاء يعملون معاً ويرسلون الأحداث لحظة بلحظة.',
                    style: TextStyle(
                      fontSize: 21,
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
                      labelText: 'الهدف',
                    ),
                  ),
                  const SizedBox(height: 14),
                  SizedBox(
                    width: double.infinity,
                    child: FilledButton.icon(
                      onPressed: _loading ? null : _run,
                      icon: _loading
                          ? const SizedBox(
                              width: 18,
                              height: 18,
                              child: CircularProgressIndicator(
                                strokeWidth: 2,
                              ),
                            )
                          : const Icon(Icons.bolt),
                      label: const Text('تشغيل التنفيذ المتوازي'),
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
                  GridView.count(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    crossAxisCount: 2,
                    mainAxisSpacing: 10,
                    crossAxisSpacing: 10,
                    childAspectRatio: 1.5,
                    children: [
                      _Metric(label: 'الوكلاء', value: '$_agents'),
                      _Metric(label: 'الأحداث', value: '$_events'),
                      _Metric(label: 'النتيجة', value: '$_score'),
                      _Metric(
                        label: 'الرحلات المكتملة',
                        value: '$_completedWorkflows',
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
        mainAxisAlignment: MainAxisAlignment.center,
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