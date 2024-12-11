import 'package:flutter/material.dart';
import 'models.dart'; // User model

class MyTab extends StatefulWidget {
  final User user;

  MyTab({Key? key, required this.user}) : super(key: key);

  @override
  _MyTabState createState() => _MyTabState();
}

class _MyTabState extends State<MyTab> {
  @override
  Widget build(BuildContext context) {
    return Center(
      child: Text('My Tab Content for ${widget.user.name}'),
    );
  }
}
