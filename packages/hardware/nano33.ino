#include <SPI.h>
#include <WiFiNINA.h>
#include <WiFiClient.h>
#include <ArduinoJson.h>

// WiFi 설정
const char* ssid = "ksiwon";        // WiFi SSID
const char* pass = "poiu5678";      // WiFi 비밀번호
int status = WL_IDLE_STATUS;

// 진동 센서 핀
const int vibrationSensorPin = A6;

// WiFiClient 객체
WiFiClient client;

void setup() {
  Serial.begin(9600);

  // WiFi 모듈 확인
  if (WiFi.status() == WL_NO_MODULE) {
    Serial.println("WiFi module not detected!");
    while (true);
  }

  // WiFi 연결
  connectToWiFi();
}

void loop() {
  // 진동 센서 평균값 계산
  int vibrationValue = getAverageVibration();
  Serial.print("Average Vibration Value: ");
  Serial.println(vibrationValue);

  // POST 요청 전송
  sendPostRequest(1, vibrationValue);

  delay(1000); // 1초 대기
}

// WiFi 연결 함수
void connectToWiFi() {
  while (status != WL_CONNECTED) {
    Serial.print("Connecting to SSID: ");
    Serial.println(ssid);
    status = WiFi.begin(ssid, pass);
    delay(1000);
  }
  Serial.println("Connected to WiFi!");
  printWiFiDetails();
}

// WiFi 정보 출력
void printWiFiDetails() {
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());
}

// 진동 센서 평균값 계산 함수
int getAverageVibration() {
  int total = 0;
  for (int i = 0; i < 24; i++) {
    total += analogRead(vibrationSensorPin);
    delay(200); // 0.2초 대기
  }
  return total / 24;
}

// POST 요청 전송 함수
void sendPostRequest(int trackerId, int intensity) {
  if (client.connect("scspace.kws.sparcs.net", 80)) {
    StaticJsonDocument<200> json;
    json["trackerId"] = trackerId;
    json["intensity"] = intensity;

    String jsonPayload;
    serializeJson(json, jsonPayload);

    String lmid = "65";

    // HTTP 요청 구성 및 전송
    client.println("POST /back/monitor/track/"+ lmid +" HTTP/1.1");
    client.println("Host: scspace.kws.sparcs.net");
    client.println("Content-Type: application/json");
    client.print("Content-Length: ");
    client.println(jsonPayload.length());
    client.println();
    client.print(jsonPayload);

    // 서버 응답 확인
    String response = client.readString();

    client.stop();
  } else {
    Serial.println("Connection to server failed.");
  }
}
