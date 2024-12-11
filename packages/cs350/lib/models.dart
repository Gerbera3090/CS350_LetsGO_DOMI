class User {
  final int id;
  final String email;
  final String loginId;
  final String password;
  final String name;
  final int dormitoryId;
  final int dormitoryFloor;
  final int dormitoryRoom;
  final int gender;

  User({
    required this.id,
    required this.email,
    required this.loginId,
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
      loginId: json['login_id'],
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
      'login_id': loginId,
      'password': password,
      'name': name,
      'dormitory_id': dormitoryId,
      'dormitory_floor': dormitoryFloor,
      'dormitory_room': dormitoryRoom,
      'gender': gender,
    };
  }
}
