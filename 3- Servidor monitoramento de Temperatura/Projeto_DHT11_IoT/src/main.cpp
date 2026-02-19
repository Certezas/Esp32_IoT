#include <Arduino.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include "DHT.h"

// Configurações do Sensor DHT11
#define DHTPIN 4   
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

// Credenciais Wi-Fi
const char* ssid = "BRAZILINO";
const char* password = "jptrguegabi2012";

// Endpoint do seu server.js
const char* apiEndpoint = "http://192.168.100.229:3000/dados";

void setup() {
    Serial.begin(115200);
    dht.begin();

    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) {
        delay(1000);
        Serial.print("Conectando ao Wifi..");
    }
    Serial.println("\nConectado ao Wifi..");
}

void loop() {
    delay(2000);

    float t = dht.readTemperature();

    if (isnan(t)) {
        Serial.println("Erro ao ler do sensor DHT!");
        return;
    }

    // Print no Serial para conferência
    Serial.print("Temperature = ");
    Serial.print(t);
    Serial.println(" *C");

    if (WiFi.status() == WL_CONNECTED) {
        HTTPClient http;
        http.begin(apiEndpoint);
        http.addHeader("Content-Type", "application/json");

        // Montando o JSON exatamente como o server.js espera
        String jsonPayload = "{\"temperature\":" + String(t) + "}";

        int httpResponseCode = http.POST(jsonPayload);

        if (httpResponseCode > 0) {
            Serial.print("Resposta: ");
            Serial.println(http.getString());
        } else {
            Serial.print("Erro: ");
            Serial.println(httpResponseCode);
        }
        http.end();
    }

    delay(1000); 
}
