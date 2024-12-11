import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'models.dart'; // User model
import 'package:flutter/services.dart'; // for loading local assets
import 'dart:convert'; // for jsonDecode
import 'package:http/http.dart' as http;


class DormitoryTab extends StatefulWidget {
  final User user;

  DormitoryTab({Key? key, required this.user}) : super(key: key);

  @override
  _DormitoryTabState createState() => _DormitoryTabState();
}

class dormUnit extends StatefulWidget {
  final List<LM?> LMlist;
  final User user;
  dormUnit({required this.LMlist, required this.user});

  @override
  _DormUnitState createState() => _DormUnitState();
}

class _DormUnitState extends State<dormUnit> {
  late List<bool> likes;

  @override
  void initState() {
    super.initState();
    likes = widget.LMlist.map((item) => item?.isFLM ?? false).toList();
  }

  // LM 객체를 클릭했을 때 팝업을 띄우는 메서드
  void showLMDetails(BuildContext context, LM item) {
    var like = item.isFLM;
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          backgroundColor: Colors.white,
          insetPadding: EdgeInsets.all(10),
          content: Container(
            width: 331,
            height: 72,
            decoration: BoxDecoration(
              border: Border.all(width: 1),
              borderRadius: BorderRadius.circular(10),
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
                SizedBox(width: 10), // Space between image and text
                // Text section
                Expanded(
                  child: Container(
                    height: 72,
                    padding: EdgeInsets.only(top: 10.0),
                    color: item.status == statusEnum.Using
                        ? Color(0x11EAC72F)
                        : Colors.white,
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
                        )
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
                      GestureDetector(
                        onTap: () {
                          // 클릭 시 동작 정의 (현재는 비워둠)
                        },
                        child: item.alarm
                            ? Image.asset('assets/photos/status/Alarm=On.png', width: 20, height: 20)
                            : Image.asset('assets/photos/status/Alarm=Off.png', width: 20, height: 20),
                      ),
                      SizedBox(width: 10),
                      GestureDetector(
                        onTap: () async {
                          setState(() {
                            // like 상태 반전
                            likes[widget.LMlist.indexOf(item)] = !likes[widget.LMlist.indexOf(item)];
                          });

                          try {
                            final String userId = widget.user.id.toString(); // User ID를 가져옴
                            final String url = 'http://scspace.kws.sparcs.net/back/lms/flm';

                            // 요청 본문 생성
                            final Map<String, dynamic> body = {
                              'userId': userId,
                              'lmId': item.id, // LM의 id 사용
                            };

                            if (likes[widget.LMlist.indexOf(item)]) {
                              // isFLM이 true일 때 FLM 목록에서 삭제하는 요청
                              final response = await http.delete(
                                Uri.parse(url),
                                body: jsonEncode(body),
                                headers: {
                                  'Content-Type': 'application/json',
                                },
                              );

                              if (response.statusCode == 200) {
                                print("sent 200");
                              } else {
                                throw Exception('Failed to remove from FLM');
                              }
                            } else {
                              // isFLM이 false일 때 FLM 목록에 추가하는 요청
                              final response = await http.post(
                                Uri.parse(url),
                                body: jsonEncode(body),
                                headers: {
                                  'Content-Type': 'application/json',
                                },
                              );

                              if (response.statusCode == 201) {
                                print("sent 201");
                              } else {
                                throw Exception('Failed to add to FLM');
                              }
                            }
                          } catch (e) {
                            print('Error: $e');
                          }
                        },
                        child: likes[widget.LMlist.indexOf(item)]
                            ? Image.asset('assets/photos/status/Favorites=On.png', width: 20, height: 20)
                            : Image.asset('assets/photos/status/Favorites=Off.png', width: 20, height: 20),
                      ),
                      SizedBox(width: 10),
                      GestureDetector(
                        onTap: () {
                          // 클릭 시 동작 정의 (현재는 비워둠)
                        },
                        child: Image.asset('assets/photos/status/menu_button.png', width: 20, height: 20),
                      ),
                    ],
                  ),
                )
              ],
            ),
          ),
        );
      },
    );
  }

  // LM 상태에 따른 이미지 선택 및 GestureDetector로 클릭 이벤트 처리
  Widget selectLM(String LM, LM? cur, BuildContext context) {
    return GestureDetector(
      onTap: () {
        // 클릭 시 상세 정보 팝업 띄우기
        if (cur != null) {
          showLMDetails(context, cur);
        }
      },
      child: switch (LM) {
        'DB' => Image.asset('assets/photos/dryer/dryer_broken.png', width: 56, height: 56),
        'DD' => Image.asset('assets/photos/dryer/dryer_default.png', width: 56, height: 56),
        'DO' => Image.asset('assets/photos/dryer/dryer_occupied.png', width: 56, height: 56),
        'DU' => Image.asset('assets/photos/dryer/dryer_using.png', width: 56, height: 56),
        'WB' => Image.asset('assets/photos/washer/washer_broken.png', width: 56, height: 56),
        'WD' => Image.asset('assets/photos/washer/washer_default.png', width: 56, height: 56),
        'WO' => Image.asset('assets/photos/washer/washer_occupied.png', width: 56, height: 56),
        'WU' => Image.asset('assets/photos/washer/washer_using.png', width: 56, height: 56),
        _ => SizedBox(width: 56, height: 56)
      },
    );
  }

  // LM 객체를 문자열로 변환하는 메서드
  String tostring(LM? L) {
    if (L != null) {
      String a = switch (L.status) {
        statusEnum.Available => 'D',
        statusEnum.Using => 'U',
        statusEnum.Broken => 'B',
        statusEnum.Occupied => 'O'
      };
      String b = switch (L.type) {
        lm_type_enum.Washer => 'W',
        lm_type_enum.Dryer => 'D'
      };
      return b + a;
    } else {
      return '';
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 112,
      height: 112,
      child: Column(
        children: [
          Center(
            child: Row(
              children: [
                selectLM(tostring(widget.LMlist[0]), widget.LMlist[0], context),
                selectLM(tostring(widget.LMlist[1]), widget.LMlist[1], context),
              ],
            ),
          ),
          Center(
            child: Row(
              children: [
                selectLM(tostring(widget.LMlist[2]), widget.LMlist[2], context),
                selectLM(tostring(widget.LMlist[3]), widget.LMlist[3], context),
              ],
            ),
          )
        ],
      ),
    );
  }
}

class _DormitoryTabState extends State<DormitoryTab> {
  final List<String> floors = ['1F', '2F', '3F', '4F'];
  String _selectedfloor = '1F';
  int sfloor = 16;
  late List<dynamic> dormData;
  late List<LM> LMDatas;

  @override
  void initState() {
    super.initState();
    _loadLMDatas();
  }

  // Load data from a local JSON file (assuming favorites.json is stored in assets)
  Future<void> _loadLMDatas() async {
    final String userId = widget.user.id.toString(); // User ID를 가져옴
    final String url =
        'http://scspace.kws.sparcs.net/back/lms?userId=$userId&dormitoryFloorId=$sfloor';

    try {
      final response = await http.get(Uri.parse(url));

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        print(data);
        setState(() {
          LMDatas = (data['lms'] as List)
              .map((json) => LM.fromDJson(json,sfloor)) // Convert JSON to LM objects
              .toList();
        });
      } else {
        throw Exception('Failed to load data');
      }
    } catch (e) {
      print('Error: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            width: 376,
            height: 40,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Container(
                  width: 280,
                  height: 40,
                  child: Center(
                    child: Text(
                      'Areum Dorm (N19)',
                      style: TextStyle(
                        color: Colors.black,
                        fontSize: 30,
                        fontFamily: 'Inria Sans',
                        fontWeight: FontWeight.w400,
                        letterSpacing: -0.17,
                      ),
                    ),
                  ),
                ),
                Container(
                  width: 70,
                  height: 30,
                  child: DropdownButtonFormField<String>(
                    value: _selectedfloor,
                    items: floors.map((e) => DropdownMenuItem(
                      value: e,
                      child: Text(e),
                    )).toList(),
                    onChanged: (value) {
                      setState(() {
                        _selectedfloor = value!;
                        sfloor = switch (value) {
                          '1F' => 14,
                          '2F' => 15,
                          '3F' => 16,
                          '4F' => 17,
                          _ => 0
                        };
                        _loadLMDatas();
                      });
                    },
                    icon: Icon(Icons.arrow_drop_down),
                    decoration: InputDecoration(
                      contentPadding: EdgeInsets.symmetric(horizontal: 10.0), // 패딩을 추가해서 텍스트와 아이콘의 위치를 조정
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(5),
                        borderSide: BorderSide(color: Colors.black), // border 색상
                      ),
                      enabledBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(5),
                        borderSide: BorderSide(color: Colors.black), // 드롭다운이 펼쳐지지 않았을 때의 색상
                      ),
                      focusedBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(5),
                        borderSide: BorderSide(color: Colors.black), // 포커스를 받을 때의 색상
                      ),
                    ),
                    isExpanded: true, // 드롭다운이 부모 컨테이너의 폭을 모두 사용하도록 설정
                  ),
                ),
                SizedBox(width: 10.0)
              ],
            ),
          ),
          SizedBox(height: 30,),
          Container(
            width: 378,
            height: 398,
            decoration: BoxDecoration(
              border: Border.all(
                  width: 1.0,
                  color: Colors.black
              ),
              color: Color(0xffEAEAEA),
            ),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Container(
                  width: 376,
                  height: 132,
                  child: Row(
                    children: [
                      Container(
                        width: 132,
                        height: 132,
                        child: dormUnit(LMlist: [LMDatas[0],LMDatas[1],null,null],user: widget.user,),
                      ),
                      Container(
                        width: 112,
                        height: 132,
                      ),
                      Container(
                        width: 132,
                        height: 132,
                        child: dormUnit(LMlist: [LMDatas[2],LMDatas[3],null,LMDatas[4]],user: widget.user,),
                        alignment: Alignment.topRight,
                      )
                    ],
                  ),
                ),
                Container(
                  width: 376,
                  height: 112,
                  child: Row(
                    children: [
                      Container(
                        width: 132,
                        height: 112,
                      ),
                      Container(
                        width: 112,
                        height: 112,
                        decoration: BoxDecoration(
                          border: Border.all(
                              width: 1.0,
                              color: Colors.black
                          ),
                          color: Colors.white
                        ),
                      ),
                      Container(
                        width: 132,
                        height: 112,
                      )
                    ],
                  ),
                ),
                Container(
                  width: 376,
                  height: 132,
                  child: Row(
                    children: [
                      Container(
                        width: 132,
                        height: 132,
                        child: dormUnit(LMlist: [LMDatas[9],null,LMDatas[8],LMDatas[7]],user: widget.user,),
                        alignment: Alignment.bottomLeft,
                      ),
                      Container(
                        width: 112,
                        height: 132,
                      ),
                      Container(
                        width: 132,
                        height: 132,
                        child: dormUnit(LMlist: [null,null,LMDatas[6],LMDatas[5]],user: widget.user,),
                        alignment: Alignment.bottomRight,
                      )
                    ],
                  ),
                )
              ],
            )
          ),
          Center(
            child: Text("Front",style: TextStyle(fontSize: 20),)
          )
          //TODO: LM status container when LM is selected
        ],
      ),
    );
  }
}
