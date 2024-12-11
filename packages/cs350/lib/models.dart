class User {
  final int id;
  final String email;
  final String password;
  final String name;
  final int dormitoryId;
  final int dormitoryFloor;
  final int dormitoryRoom;
  final int gender;

  User({
    required this.id,
    required this.email,
    required this.password,
    required this.name,
    required this.dormitoryId,
    required this.dormitoryFloor,
    required this.dormitoryRoom,
    required this.gender,
  });

  // JSON 데이터를 User 객체로 변환하는 메서드
  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'],
      email: json['email'],
      password: json['password'],
      name: json['name'],
      dormitoryId: json['dormitory_id'],
      dormitoryFloor: json['dormitory_floor'],
      dormitoryRoom: json['dormitory_room'],
      gender: json['gender'],
    );
  }

  // User 객체를 JSON으로 변환하는 메서드
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'email': email,
      'password': password,
      'name': name,
      'dormitory_id': dormitoryId,
      'dormitory_floor': dormitoryFloor,
      'dormitory_room': dormitoryRoom,
      'gender': gender,
    };
  }
}

enum lm_type_enum {Washer, Dryer}
enum user_type_enum {Resident, Supervisor}
enum report_status_enum {Available, Broken, On_Repair}
enum lm_status_enum {Available, Occupied, Using}

enum statusEnum {Available, Broken, Occupied, Using}

class LM {
  final int id;
  final int floor;
  final lm_type_enum type;
  final statusEnum status;
  final int time;
  final bool alarm;
  final bool isFLM;

  LM({
    required this.id,
    required this.floor,
    required this.type,
    required this.status,
    required this.time,
    required this.alarm,
    required this.isFLM,
  });

  factory LM.fromFJson(Map<String, dynamic> json) {
    return LM(
      id: json['id'],
      floor : json['floor'],
      type: json['lmTypeEnum'] == 1 ? lm_type_enum.Washer : lm_type_enum.Dryer,
      status: json['reportStatusEnum'] == 2 ? statusEnum.Broken : (json['lmStatusEnum'] == 1 ? statusEnum.Available : (json['lmStatusEnum'] == 2 ? statusEnum.Occupied: statusEnum.Using)),
        time : json['last'],
        alarm: true,
        isFLM: true
    );
  }

  factory LM.fromDJson(Map<String, dynamic> json, int f) {
    print(json);
    return LM(
        id: json['id'],
        floor : f,
        type: json['lmTypeEnum'] == 1 ? lm_type_enum.Washer : lm_type_enum.Dryer,
        status: json['reportStatusEnum'] == 2 ? statusEnum.Broken : (json['lmStatusEnum'] == 1 ? statusEnum.Available : (json['lmStatusEnum'] == 2 ? statusEnum.Occupied: statusEnum.Using)),
        time : json['last'],
        alarm: json['alarmed'],
        isFLM: json['isFLM']
    );
  }
}


