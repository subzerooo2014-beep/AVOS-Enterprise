import 'package:flutter/material.dart';
import '../../vehicles/domain/vehicle.dart';

class SellerChatPage extends StatefulWidget {
  const SellerChatPage({
    super.key,
    required this.vehicle,
  });

  final Vehicle vehicle;

  @override
  State<SellerChatPage> createState() => _SellerChatPageState();
}

class _SellerChatPageState extends State<SellerChatPage> {
  final _controller = TextEditingController();
  final _messages = <String>[
    'مرحبا، هل المركبة ما زالت متوفرة؟',
    'نعم متوفرة، ويمكن ترتيب فحص اليوم.',
  ];

  void _send() {
    final value = _controller.text.trim();
    if (value.isEmpty) return;
    setState(() => _messages.add(value));
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
        appBar: AppBar(
          title: Text(widget.vehicle.title),
        ),
        body: Column(
          children: [
            Expanded(
              child: ListView.builder(
                padding: const EdgeInsets.all(16),
                itemCount: _messages.length,
                itemBuilder: (context, index) {
                  final mine = index.isEven;
                  return Align(
                    alignment: mine
                        ? Alignment.centerLeft
                        : Alignment.centerRight,
                    child: Container(
                      margin: const EdgeInsets.only(bottom: 10),
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        color: mine
                            ? Theme.of(context).colorScheme.primaryContainer
                            : Colors.white,
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
                    Expanded(
                      child: TextField(
                        controller: _controller,
                        decoration: const InputDecoration(
                          hintText: 'اكتب رسالتك...',
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