import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'main_screen.dart';
import 'models.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData(
        // This is the theme of your application.
        //
        // TRY THIS: Try running your application with "flutter run". You'll see
        // the application has a purple toolbar. Then, without quitting the app,
        // try changing the seedColor in the colorScheme below to Colors.green
        // and then invoke "hot reload" (save your changes or press the "hot
        // reload" button in a Flutter-supported IDE, or press "r" if you used
        // the command line to start the app).
        //
        // Notice that the counter didn't reset back to zero; the application
        // state is not lost during the reload. To reset the state, use hot
        // restart instead.
        //
        // This works for code too, not just values: Most code changes can be
        // tested with just a hot reload.
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.white),
        useMaterial3: true,
      ),
      home: const Login(),
    );
  }
}

class Login extends StatefulWidget {
  const Login({super.key});

  @override
  State<Login> createState() => _Login();
}

class _Login extends State<Login> {
  bool _isLoading = false;
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();

  final ButtonStyle enable_login = ElevatedButton.styleFrom(
    shape: RoundedRectangleBorder(	//모서리를 둥글게
        borderRadius: BorderRadius.circular(0)),
    textStyle: const TextStyle(fontSize: 20),
    backgroundColor: Color(0xffD2D2D2),
    foregroundColor: Colors.white, // 기본 글씨 색
  );

  final ButtonStyle filled_login = ElevatedButton.styleFrom(
    shape: RoundedRectangleBorder(	//모서리를 둥글게
        borderRadius: BorderRadius.circular(0)),
    textStyle: const TextStyle(fontSize: 20),
    backgroundColor: Color(0xff257457),
    foregroundColor: Colors.white,
  );

  ButtonStyle get buttonStyle {
    if (_emailController.text.isNotEmpty && _passwordController.text.isNotEmpty) {
      return filled_login; // 두 필드 모두 채워졌을 때
    } else {
      return enable_login; // 하나라도 비어 있으면 기본 스타일
    }
  }

  Future<void> _login() async {
    String email = _emailController.text.trim();
    String password = _passwordController.text.trim();

    // 로딩 상태 표시
    setState(() {
      _isLoading = true;
    });

    // JSON 데이터 가져오기
    String data = await rootBundle.loadString('assets/datas/dummies.json');
    List<dynamic> users = json.decode(data);

    // 입력된 이메일과 비밀번호가 일치하는 사용자가 있는지 확인
    var user = users.firstWhere(
          (user) => user['email'] == email && user['password'] == password,
      orElse: () => null, // 일치하는 유저가 없으면 null 반환
    );

    // 로그인 처리
    if (user != null) {
      // 로그인 성공 시 MainScreen으로 이동
      User curUser = User.fromJson(user); // JSON에서 User 객체로 변환
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (context) => MainScreen(user: curUser)),
      );
    } else {
      // 로그인 실패 시 에러 메시지 표시
      showDialog(
        context: context,
        builder: (context) => AlertDialog(
          title: const Text('Login Failed'),
          content: const Text('Invalid email or password.'),
          actions: <Widget>[
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
              },
              child: const Text('OK'),
            ),
          ],
        ),
      );
    }

    // 로딩 상태 종료
    setState(() {
      _isLoading = false;
    });
  }

  @override
  Widget build(BuildContext context)
  {
    const greycolor = 0xffD2D2D2;
    const pointgreen = 0xff257457;
    double screenWidth = MediaQuery.of(context).size.width;
    double textfieldWidth = 0.8*screenWidth;
    return Scaffold(
      body: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Image.asset(
            'assets/photos/logo.png', // 로컬 이미지
            width: 0.7*screenWidth,
            fit: BoxFit.fitWidth
          ),
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                SizedBox(
                  width: textfieldWidth,
                  child: TextField(
                    controller: _emailController,
                    onChanged: (_) => setState(() {}),
                    decoration: InputDecoration(
                      hintText: 'example@kaist.ac.kr',
                        hintStyle: TextStyle(
                          color: Color(greycolor), // hintText 색 설정
                        ),
                      filled: true,
                      fillColor: Colors.white.withOpacity(0.7),
                      enabledBorder: OutlineInputBorder(
                          borderSide: BorderSide(
                            color: Color(greycolor),
                            width: 1.0,
                          ),
                        borderRadius: BorderRadius.all(Radius.zero)
                      ),
                      focusedBorder: OutlineInputBorder(
                        borderSide: BorderSide(
                          color: Colors.black.withOpacity(0.7), // 클릭 시 테두리 색 변경
                          width: 1.0, // 클릭 시 테두리 두께 변경
                        ),
                        borderRadius: BorderRadius.all(Radius.zero),
                      ),
                    ),
                  )
                ),
                // 비밀번호 입력 필드
                SizedBox(
                  width: textfieldWidth,
                  child : TextField(
                    controller: _passwordController,
                    onChanged: (_) => setState(() {}),
                    obscureText: true,
                    decoration: InputDecoration(
                      hintText: 'password',
                        hintStyle: TextStyle(
                          color: Color(greycolor), // hintText 색 설정
                        ),
                      filled: true,
                      fillColor: Colors.white.withOpacity(0.7),
                        enabledBorder: OutlineInputBorder(
                            borderSide: BorderSide(
                              color: Color(greycolor),
                              width: 1.0,
                            ),
                            borderRadius: BorderRadius.all(Radius.zero)
                        ),
                      focusedBorder: OutlineInputBorder(
                        borderSide: BorderSide(
                          color: Colors.black.withOpacity(0.7), // 클릭 시 테두리 색 변경
                          width: 1.0, // 클릭 시 테두리 두께 변경
                        ),
                        borderRadius: BorderRadius.all(Radius.zero),
                      )
                    )
                  ),
                ),
                const SizedBox(height: 20),
                // 로그인 버튼
                SizedBox(
                  width: textfieldWidth,
                    child: ElevatedButton(
                    onPressed: _login,
                    child: const Text('Login'),
                    style: buttonStyle,
                  )
                ),
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      'Find ID',
                      style: TextStyle(
                        fontSize: 15,
                        color: Colors.grey
                      ),
                    ),
                    const VerticalDivider(
                      color: Colors.black,  // 세로줄 색상
                      thickness: 2,         // 세로줄 두께
                      width: 20,            // 세로줄 양옆 여백
                    ),
                    Text(
                      'Find Password',
                      style: TextStyle(
                          fontSize: 15,
                          color: Colors.grey
                      ),
                    ),
                    const VerticalDivider(
                      color: Colors.black,  // 세로줄 색상
                      thickness: 2,         // 세로줄 두께
                      width: 20,            // 세로줄 양옆 여백
                    ),
                    Text(
                      'Join',
                      style: TextStyle(
                          fontSize: 15,
                          color: Colors.grey
                      ),
                    ),
                  ],
                )
              ],
            ),
          ),
        ],
      ),
    );
  }
}