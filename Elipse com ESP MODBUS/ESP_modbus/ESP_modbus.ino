
#include <WiFi.h>
#include <ModbusIP_ESP8266.h>

const int REG = 40001;

ModbusIP mb;

void setup() {
  Serial.begin(115200);
  WiFi.begin("BRAZILINO", "jptrguegabi2012");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("Wifi conectado");
  Serial.print("Seu IP é:");
  Serial.println(WiFi.localIP());

  mb.server();
  mb.addHreg (REG, 2024);
}

void loop() {
  unsigned long tempoatual = millis();
  mb.Hreg (REG, tempoatual);
  mb.task();
  delay(1000);
}