import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'models.dart'; // Assuming LM is defined in models.dart
import 'package:http/http.dart' as http;
import 'package:flutter/services.dart'; // for loading local assets

class FavoritesTab extends StatefulWidget {
  final User user;
  FavoritesTab({Key? key, required this.user}) : super(key: key);

  @override
  _FavoritesTabState createState() => _FavoritesTabState();
}

class _FavoritesTabState extends State<FavoritesTab> {
  late List<LM> LMdatas;
  final String apiUrl = 'http://scspace.kws.sparcs.net/back/lms/flms';
  late FlutterLocalNotificationsPlugin flutterLocalNotificationsPlugin;
  late List<dynamic> favoritesData;
  int? _selectedIndex; // 선택된 아이템의 인덱스를 저장

  @override
  void initState() {
    super.initState();
    flutterLocalNotificationsPlugin = FlutterLocalNotificationsPlugin();
    _initializeNotifications();
    _loadLMDatas();
  }

  // 푸시 알림 초기화
  void _initializeNotifications() async {
    const AndroidInitializationSettings initializationSettingsAndroid =
    AndroidInitializationSettings('@mipmap/ic_launcher');
    final InitializationSettings initializationSettings =
    InitializationSettings(android: initializationSettingsAndroid);
    await flutterLocalNotificationsPlugin.initialize(initializationSettings);
  }

  // 푸시 알림 표시
  Future<void> _showNotification() async {
    const AndroidNotificationDetails androidPlatformChannelSpecifics =
    AndroidNotificationDetails(
      'your_channel_id',
      'your_channel_name',
      channelDescription: 'your_channel_description',
      importance: Importance.high,
      priority: Priority.high,
      showWhen: false,
    );
    const NotificationDetails platformChannelSpecifics =
    NotificationDetails(android: androidPlatformChannelSpecifics);

    await flutterLocalNotificationsPlugin.show(
      0,
      'Laundry Alert',
      'Your laundry is ready!',
      platformChannelSpecifics,
      payload: 'item x',
    );
  }

  Future<void> _loadLMDatas() async {
    final String response = await rootBundle.loadString('assets/datas/favorites.json');
    final data = jsonDecode(response);
    setState(() {
      favoritesData = data;
    });
    LMdatas = favoritesData.map((json) => LM.fromFJson(json)).toList();
  }

  // Start Laundry 버튼 클릭 시 10초 후 알림
  void _startLaundry() {
    // 즉시 스낵 알림 띄우기
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Laundry started, you will be notified when finished')),
    );

    // 10초 후에 또 다른 스낵 알림을 띄운다
    Future.delayed(Duration(seconds: 10), () {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Your laundry is ready!')),
      );
    });
  }

  // 즐겨찾기 데이터 로드
  Future<void> _loadFavoritesData() async {
    final String userId = widget.user.id.toString(); // Get the userId dynamically
    final String url = '$apiUrl?userId=$userId';

    try {
      final response = await http.get(Uri.parse(url));
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        setState(() {
          LMdatas = (data['flms'] as List)
              .map((json) => LM.fromFJson(json)) // Convert JSON to LM objects
              .toList();
        });
      } else {
        throw Exception('Failed to load data');
      }
    } catch (e) {
      print('Error: $e');
    }
  }

  // 선택된 항목을 업데이트
  void _onItemTapped(int index) {
    setState(() {
      if (_selectedIndex == index) {
        _selectedIndex = null; // 이미 선택된 항목을 다시 클릭하면 선택 해제
      } else {
        _selectedIndex = index; // 선택된 항목을 설정
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: Text(widget.user.name),
      ),
      body: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          SingleChildScrollView(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                SizedBox(height: 20),
                ...LMdatas.asMap().entries.map<Widget>((entry) {
                  int index = entry.key;
                  LM item = entry.value;

                  bool isSelected = _selectedIndex == index; // 하이라이트 여부 확인

                  return GestureDetector(
                    onTap: () => _onItemTapped(index), // 탭 시 인덱스 변경
                    child: Container(
                      width: 331,
                      height: 72,
                      margin: EdgeInsets.symmetric(vertical: 8.0),
                      decoration: BoxDecoration(
                        border: Border.all(width: 1),
                        borderRadius: BorderRadius.circular(10),
                        color: isSelected ? Colors.blue.withOpacity(0.2) : Colors.white, // 하이라이트 색상
                      ),
                      child: Row(
                        children: [
                          // Image section
                          Container(
                            width: 56,
                            height: 56,
                            child: item.type == lm_type_enum.Washer
                                ? Image.asset('assets/photos/washer.png')
                                : Image.asset('assets/photos/dryer.png'),
                          ),
                          SizedBox(width: 10),
                          // Text section
                          Expanded(
                            child: Container(
                              height: 72,
                              padding: EdgeInsets.only(top: 10.0),
                              color: item.status == statusEnum.Using
                                  ? Color(0x11EAC72F)
                                  : Colors.transparent,
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    "${item.floor}F-${item.id}",
                                    style: TextStyle(
                                      color: Colors.black,
                                      fontSize: 15,
                                      fontFamily: 'Inria Sans',
                                      fontWeight: FontWeight.w400,
                                    ),
                                  ),
                                  SizedBox(height: 4),
                                  Row(
                                    children: [
                                      Text(
                                        switch (item.status) {
                                          statusEnum.Using => 'Using',
                                          statusEnum.Occupied => 'Occupied',
                                          statusEnum.Available => 'Available',
                                          statusEnum.Broken => 'Broken',
                                          _ => 'Error'
                                        },
                                        style: TextStyle(
                                          color: switch (item.status) {
                                            statusEnum.Using => Color(0xff2D1DC0),
                                            statusEnum.Occupied => Color(0xFFF23232),
                                            statusEnum.Available => Color(0xff257457),
                                            statusEnum.Broken => Color(0xffF28932),
                                            _ => Colors.black
                                          },
                                          fontSize: 15,
                                          fontFamily: 'Inria Sans',
                                          fontWeight: FontWeight.w400,
                                        ),
                                      ),
                                      SizedBox(width: 4.0),
                                      Text(
                                        item.time != 0
                                            ? '${item.time ~/ 3600} : ${(item.time % 3600) ~/ 60} : ${item.time % 60}'
                                            : '',
                                        style: TextStyle(
                                          color: Colors.black,
                                          fontSize: 15,
                                          fontFamily: 'Inria Sans',
                                          fontWeight: FontWeight.w400,
                                        ),
                                      ),
                                    ],
                                  ),
                                ],
                              ),
                            ),
                          ),
                          SizedBox(width: 20),
                          Container(
                            width: 95,
                            height: 24,
                            child: Row(
                              crossAxisAlignment: CrossAxisAlignment.center,
                              children: [
                                item.alarm
                                    ? Image.asset('assets/photos/status/Alarm=On.png', width: 20, height: 20)
                                    : Image.asset('assets/photos/status/Alarm=Off.png', width: 20, height: 20),
                                SizedBox(width: 10),
                                Image.asset('assets/photos/status/Favorites=On.png', width: 20, height: 20),
                                SizedBox(width: 10),
                                Image.asset('assets/photos/status/menu_button.png', width: 20, height: 20)
                              ],
                            ),
                          )
                        ],
                      ),
                    ),
                  );
                }).toList(),
              ],
            ),
          ),
        ],
      ),
      floatingActionButton: SizedBox(
        width: 200,
        height: 42,
        child: FloatingActionButton(
          onPressed: _startLaundry,
          backgroundColor: Colors.transparent,
          elevation: 0,
          child: Container(
            decoration: BoxDecoration(
              color: Color(0xff257457).withOpacity(0.48),
              borderRadius: BorderRadius.circular(10),
              border: Border.all(width: 1, color: Colors.black),
              boxShadow: [
                BoxShadow(
                  color: Color(0x3F000000),
                  blurRadius: 4,
                  offset: Offset(0, 4),
                  spreadRadius: 0,
                )
              ],
            ),
            child: Center(
              child: Text(
                'Start Laundry',
                textAlign: TextAlign.center,
                style: TextStyle(
                  color: Colors.black,
                  fontSize: 20,
                  fontFamily: 'Inria Sans',
                  fontWeight: FontWeight.w400,
                  height: 0.04,
                  letterSpacing: -0.17,
                ),
              ),
            ),
          ),
        ),
      ),
      floatingActionButtonLocation: FloatingActionButtonLocation.centerFloat,
    );
  }
}
