import 'package:flutter/material.dart';
import '../../../../design_system/avos_colors.dart';
import '../../../../design_system/luxury_card.dart';

class VoiceAssistantPage extends StatefulWidget {
  const VoiceAssistantPage({super.key});

  @override
  State<VoiceAssistantPage> createState() => _VoiceAssistantPageState();
}

class _VoiceAssistantPageState extends State<VoiceAssistantPage> {
  bool _listening = false;
  String _transcript = 'اضغط على الميكروفون وابدأ الكلام.';

  void _toggleListening() {
    setState(() {
      _listening = !_listening;
      _transcript = _listening
          ? 'جاري الاستماع...'
          : 'سمعتك تقول: أريد سيارة عائلية موثوقة.';
    });
  }

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        appBar: AppBar(title: const Text('المحادثة الصوتية')),
        body: Center(
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: LuxuryCard(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  AnimatedContainer(
                    duration: const Duration(milliseconds: 250),
                    width: _listening ? 150 : 120,
                    height: _listening ? 150 : 120,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: AvosColors.emerald.withValues(
                        alpha: _listening ? 0.22 : 0.10,
                      ),
                    ),
                    child: IconButton(
                      onPressed: _toggleListening,
                      icon: Icon(
                        _listening ? Icons.stop : Icons.mic,
                        size: 54,
                        color: AvosColors.emerald,
                      ),
                    ),
                  ),
                  const SizedBox(height: 24),
                  Text(
                    _transcript,
                    textAlign: TextAlign.center,
                    style: const TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.w800,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}