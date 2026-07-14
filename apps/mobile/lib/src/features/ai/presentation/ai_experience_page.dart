import 'package:flutter/material.dart';
import '../../../../design_system/avos_colors.dart';
import '../../../../design_system/luxury_card.dart';
import '../../recommendations/presentation/recommendations_page.dart';
import '../../market/presentation/market_intelligence_page.dart';
import '../../vision/presentation/vehicle_vision_page.dart';
import '../../voice/presentation/voice_assistant_page.dart';

class AiExperiencePage extends StatelessWidget {
  const AiExperiencePage({super.key});

  @override
  Widget build(BuildContext context) {
    final tools = [
      (
        'محادثة عزم',
        'اسأل عزم عن المركبات والأسعار والشراء.',
        Icons.auto_awesome,
        const _AzmChatPanel(),
      ),
      (
        'المحادثة الصوتية',
        'ابدأ وضع الاستماع وتحدث مع عزم.',
        Icons.mic,
        const VoiceAssistantPage(),
      ),
      (
        'تحليل صورة مركبة',
        'ارفع صورة واحصل على تحليل أولي.',
        Icons.camera_alt_outlined,
        const VehicleVisionPage(),
      ),
      (
        'التوصيات الذكية',
        'اقتراحات مخصصة حسب الميزانية والاستخدام.',
        Icons.recommend_outlined,
        const RecommendationsPage(),
      ),
      (
        'ذكاء السوق',
        'اتجاهات الأسعار والطلب والفرص.',
        Icons.insights_outlined,
        const MarketIntelligencePage(),
      ),
    ];

    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        appBar: AppBar(title: const Text('عزم AI')),
        body: ListView(
          padding: const EdgeInsets.all(18),
          children: [
            const LuxuryCard(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'عزم يفكر معك',
                    style: TextStyle(
                      color: AvosColors.emerald,
                      fontWeight: FontWeight.w900,
                    ),
                  ),
                  SizedBox(height: 8),
                  Text(
                    'اسأل، تحدث، صوّر أو دع عزم يقارن لك الخيارات.',
                    style: TextStyle(
                      fontSize: 23,
                      fontWeight: FontWeight.w900,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),
            ...tools.map(
              (tool) => Card(
                margin: const EdgeInsets.only(bottom: 12),
                child: ListTile(
                  leading: CircleAvatar(
                    backgroundColor:
                        AvosColors.emerald.withValues(alpha: 0.12),
                    child: Icon(tool.$3, color: AvosColors.emerald),
                  ),
                  title: Text(
                    tool.$1,
                    style: const TextStyle(fontWeight: FontWeight.w900),
                  ),
                  subtitle: Text(tool.$2),
                  trailing: const Icon(Icons.chevron_left),
                  onTap: () {
                    Navigator.of(context).push(
                      MaterialPageRoute(builder: (_) => tool.$4),
                    );
                  },
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _AzmChatPanel extends StatefulWidget {
  const _AzmChatPanel();

  @override
  State<_AzmChatPanel> createState() => _AzmChatPanelState();
}

class _AzmChatPanelState extends State<_AzmChatPanel> {
  final _controller = TextEditingController();
  final _messages = <({String text, bool mine})>[
    (
      text: 'مرحبا الساع 👋 أنا عزم. شو نوع المركبة اللي في خاطرك؟',
      mine: false,
    ),
  ];

  void _send() {
    final text = _controller.text.trim();
    if (text.isEmpty) return;

    setState(() {
      _messages.add((text: text, mine: true));
      _messages.add((
        text:
            'بناءً على طلبك، أنصح بمقارنة السعر، نسبة الثقة، التمويل وتكلفة التأمين قبل القرار.',
        mine: false,
      ));
    });

    _controller.clear();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        appBar: AppBar(title: const Text('محادثة عزم')),
        body: Column(
          children: [
            Expanded(
              child: ListView.builder(
                padding: const EdgeInsets.all(16),
                itemCount: _messages.length,
                itemBuilder: (context, index) {
                  final message = _messages[index];
                  return Align(
                    alignment: message.mine
                        ? Alignment.centerLeft
                        : Alignment.centerRight,
                    child: Container(
                      constraints: const BoxConstraints(maxWidth: 420),
                      margin: const EdgeInsets.only(bottom: 10),
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        color: message.mine
                            ? Theme.of(context).colorScheme.primaryContainer
                            : Colors.white,
                        borderRadius: BorderRadius.circular(18),
                      ),
                      child: Text(message.text),
                    ),
                  );
                },
              ),
            ),
            SafeArea(
              top: false,
              child: Padding(
                padding: const EdgeInsets.all(12),
                child: Row(
                  children: [
                    Expanded(
                      child: TextField(
                        controller: _controller,
                        decoration: const InputDecoration(
                          hintText: 'اسأل عزم...',
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    IconButton.filled(
                      onPressed: _send,
                      icon: const Icon(Icons.send),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}