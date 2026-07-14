import 'package:flutter/material.dart';

class AzmAssistantPage extends StatefulWidget {
  const AzmAssistantPage({super.key});

  @override
  State<AzmAssistantPage> createState() => _AzmAssistantPageState();
}

class _AzmAssistantPageState extends State<AzmAssistantPage> {
  final _controller = TextEditingController();
  final _messages = <String>['مرحبا الساع 👋 أنا عزم. شو في خاطرك اليوم؟'];

  void _send() {
    final text = _controller.text.trim();
    if (text.isEmpty) return;
    setState(() {
      _messages.add(text);
      _messages.add('لقيت لك خيارات مناسبة وسأرتبها حسب السعر والثقة.');
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
        appBar: AppBar(title: const Text('عزم AI')),
        body: Column(
          children: [
            Expanded(
              child: ListView.builder(
                padding: const EdgeInsets.all(16),
                itemCount: _messages.length,
                itemBuilder: (context, index) {
                  final isUser = index.isOdd;
                  return Align(
                    alignment: isUser ? Alignment.centerLeft : Alignment.centerRight,
                    child: Container(
                      margin: const EdgeInsets.only(bottom: 10),
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        color: isUser ? Theme.of(context).colorScheme.primaryContainer : Colors.white,
                        borderRadius: BorderRadius.circular(18),
                      ),
                      child: Text(_messages[index]),
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
                    Expanded(child: TextField(controller: _controller, decoration: const InputDecoration(hintText: 'اكتب سؤالك...'))),
                    const SizedBox(width: 8),
                    IconButton.filled(onPressed: _send, icon: const Icon(Icons.send)),
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