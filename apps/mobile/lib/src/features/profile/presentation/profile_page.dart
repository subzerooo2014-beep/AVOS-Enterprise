import 'package:flutter/material.dart';

class ProfilePage extends StatelessWidget {
  const ProfilePage({super.key});

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          const CircleAvatar(radius: 46, child: Icon(Icons.person, size: 46)),
          const SizedBox(height: 16),
          const Center(child: Text('خليفة', style: TextStyle(fontSize: 26, fontWeight: FontWeight.w900))),
          const SizedBox(height: 8),
          const Center(child: Text('عضو موثوق في AVOS')),
          const SizedBox(height: 24),
          ...[
            ('إعلاناتي', Icons.list_alt),
            ('الرسائل', Icons.chat_bubble_outline),
            ('الإشعارات', Icons.notifications_none),
            ('الإعدادات', Icons.settings_outlined),
          ].map((item) => Card(
                child: ListTile(
                  leading: Icon(item.$2),
                  title: Text(item.$1),
                  trailing: const Icon(Icons.chevron_left),
                ),
              )),
        ],
      ),
    );
  }
}