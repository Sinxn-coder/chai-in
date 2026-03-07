import 'dart:async';
import 'package:flutter/material.dart';

class TypingText extends StatefulWidget {
  final String text;
  final TextStyle style;
  final Duration typingSpeed;
  final Duration pauseDuration;
  final Duration initialDelay;

  const TypingText({
    super.key,
    required this.text,
    required this.style,
    this.typingSpeed = const Duration(milliseconds: 100),
    this.pauseDuration = const Duration(seconds: 2),
    this.initialDelay = const Duration(milliseconds: 500),
  });

  @override
  State<TypingText> createState() => _TypingTextState();
}

class _TypingTextState extends State<TypingText> {
  String _displayText = "";
  int _currentIndex = 0;
  Timer? _timer;

  @override
  void initState() {
    super.initState();
    Future.delayed(widget.initialDelay, () {
      if (mounted) {
        _startTyping();
      }
    });
  }

  void _startTyping() {
    _timer?.cancel();
    _displayText = "";
    _currentIndex = 0;

    _timer = Timer.periodic(widget.typingSpeed, (timer) {
      if (_currentIndex < widget.text.length) {
        setState(() {
          _displayText += widget.text[_currentIndex];
          _currentIndex++;
        });
      } else {
        timer.cancel();
        Future.delayed(widget.pauseDuration, () {
          if (mounted) {
            _startTyping();
          }
        });
      }
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Text(_displayText, style: widget.style);
  }
}
