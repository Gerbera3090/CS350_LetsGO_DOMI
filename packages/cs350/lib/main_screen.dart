import 'package:flutter/material.dart';
import 'models.dart';

class MainScreen extends StatefulWidget {
  final User user;

  MainScreen({super.key, required this.user});

  @override
  _MainScreenState createState() => _MainScreenState();
}

class _MainScreenState extends State<MainScreen> with SingleTickerProviderStateMixin {
  late int _selectedIndex;

  @override
  void initState() {
    super.initState();
    _selectedIndex = 0; // 처음 선택된 탭 인덱스
  }

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        leading: null,
        title: Row(
          crossAxisAlignment: CrossAxisAlignment.center,
          mainAxisAlignment: MainAxisAlignment.start, // 로고를 가운데로 배치
          children: [
            Image.asset(
              'assets/photos/logo.png', // 로고 이미지
              height: 40, // 로고 크기
            ),
          ],
        ),
        bottom: PreferredSize(
          preferredSize: Size.fromHeight(1), // 선의 두께 설정
          child: Container(
            color: Colors.black, // 선 색상 설정
            height: 2.0, // 선의 두께 설정
          ),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications),
            onPressed: () {
              // 알림 버튼 클릭 시 아무 동작 안함
            },
          ),
        ],
      ),
      body: IndexedStack(
        index: _selectedIndex,
        children: const [
          Center(child: Text('Home Tab Content')),
          Center(child: Text('Messages Tab Content')),
          Center(child: Text('Settings Tab Content')),
        ],
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _selectedIndex,
        onTap: _onItemTapped,
        items: [
          BottomNavigationBarItem(
            icon: Image.asset(
              'assets/photos/tab/dormitory.png', // 로고 이미지
              height: 40, // 로고 크기
            ),
            label: 'dormitory',
          ),
          BottomNavigationBarItem(
            icon: Image.asset(
              'assets/photos/tab/favorite.png', // 로고 이미지
              height: 40, // 로고 크기
            ),
            label: 'favorites',
          ),
          BottomNavigationBarItem(
            icon: Image.asset(
              'assets/photos/tab/My.png', // 로고 이미지
              height: 40, // 로고 크기
            ),
            label: 'My',
          ),
        ],
      ),
    );
  }
}
