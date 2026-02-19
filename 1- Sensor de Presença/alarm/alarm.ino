#include "CTBot.h"

CTBot myBot;

String ssid  = "BRAZILINO"; 
String pass  = "jptrguegabi2012";
String token = "8535243759:AAHaMvUAQOLiOaf1w5CYZHmmsrWTir8fqRc"; 

const int buzzerPin = 23;  // Buzzer na porta 23 
const int pirPin = 21;     // Sugestão: Ligue o pino OUT do PIR na porta 21

int64_t chatID_Alvo = 0;   // ID do usuário para enviar o alerta (int64_t é o tipo correto para Telegram)
bool sistemaArmado = false; // Começa desarmado por segurança
bool movimentoAtual = LOW;
bool movimentoAnterior = LOW;

void setup() {
  Serial.begin(115200);
  Serial.println("Iniciando Sistema de Alarme...");

  // Configuração dos Pinos
  pinMode(buzzerPin, OUTPUT);
  pinMode(pirPin, INPUT);
  digitalWrite(buzzerPin, LOW); // Garante buzzer desligado no boot

  // Conexão Wi-Fi e Telegram
  myBot.wifiConnect(ssid, pass);
  myBot.setTelegramToken(token);

  // Teste de conexão
  if (myBot.testConnection()) {
    Serial.println("\nConexão OK! Envie 'armar' para iniciar.");
  } else {
    Serial.println("\nFalha na conexão.");
  }
}

void loop() {
  // -----------------------------------------------------------
  // Gerenciamento do Telegram (Comandos)
  // -----------------------------------------------------------
  TBMessage msg;
  if (myBot.getNewMessage(msg)) {
    
    // Captura o ID de quem mandou a mensagem
    int64_t senderID = msg.sender.id;
    String texto = msg.text;

    Serial.print("Mensagem recebida: ");
    Serial.println(texto);

    if (texto.equalsIgnoreCase("armar")) {
      sistemaArmado = true;
      chatID_Alvo = senderID; 
      myBot.sendMessage(senderID, "🛡️ Sistema ARMADO! Monitorando sensor...");
      Serial.println("Sistema ARMADO");
    } 
    else if (texto.equalsIgnoreCase("desarmar")) {
      sistemaArmado = false;
      digitalWrite(buzzerPin, LOW); 
      myBot.sendMessage(senderID, "Sistema DESARMADO.");
      Serial.println("Sistema DESARMADO");
    } 
    else {
      myBot.sendMessage(senderID, "Comandos disponíveis: 'armar' ou 'desarmar'");
    }
  }

  // -----------------------------------------------------------
  // Monitoramento do Sensor (Só roda se estiver ARMADO)
  // -----------------------------------------------------------
  if (sistemaArmado) {
    movimentoAtual = digitalRead(pirPin);

    if (movimentoAtual == HIGH && movimentoAnterior == LOW) {
      Serial.println("ALERTA: Presença detectada!");
      
       digitalWrite(buzzerPin, HIGH);
      
      if (chatID_Alvo != 0) {
        myBot.sendMessage(chatID_Alvo, "🚨 ALERTA: Intruso detectado pelo sensor PIR!");
      }
    }
    else if (movimentoAtual == LOW && movimentoAnterior == HIGH) {
      Serial.println("Movimento cessou.");
      
      digitalWrite(buzzerPin, LOW);
    }

    movimentoAnterior = movimentoAtual; // Atualiza o estado para a próxima volta do loop
  }
  
  delay(100);
}