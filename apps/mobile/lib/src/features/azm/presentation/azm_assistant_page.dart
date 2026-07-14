import 'package:flutter/material.dart';
import '../../ai/presentation/ai_experience_page.dart';
import '../../super_app/presentation/super_app_dashboard_page.dart';

class AzmAssistantPage extends StatelessWidget {
  const AzmAssistantPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        appBar: AppBar(title: const Text('عزم AI')),
        body: ListView(
          padding: const EdgeInsets.all(18),
          children: [
            Card(
              child: ListTile(
                leading: const CircleAvatar(
                  child: Icon(Icons.hub_outlined),
                ),
                title: const Text(
                  'AVOS Super App',
                  style: TextStyle(fontWeight: FontWeight.w900),
                ),
                subtitle: const Text(
                  'شغّل رحلة كاملة بوكلاء عزم.',
                ),
                trailing: const Icon(Icons.chevron_left),
                onTap: () {
                  Navigator.of(context).push(
                    MaterialPageRoute(
                      builder: (_) => const SuperAppDashboardPage(),
                    ),
                  );
                },
              ),
            ),
            Card(
              child: ListTile(
                leading: const CircleAvatar(
                  child: Icon(Icons.auto_awesome),
                ),
                title: const Text(
                  'أدوات عزم AI',
                  style: TextStyle(fontWeight: FontWeight.w900),
                ),
                subtitle: const Text(
                  'المحادثة، الصوت، الصور وذكاء السوق.',
                ),
                trailing: const Icon(Icons.chevron_left),
                onTap: () {
                  Navigator.of(context).push(
                    MaterialPageRoute(
                      builder: (_) => const AiExperiencePage(),
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}