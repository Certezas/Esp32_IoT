# 🚀 IoT & Embedded Systems Integration Course

![ESP32](https://img.shields.io/badge/Hardware-ESP32-red)
![NodeJS](https://img.shields.io/badge/Backend-Node.js-green)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-forestgreen)
![Docker](https://img.shields.io/badge/Infra-Docker-blue)
![Modbus](https://img.shields.io/badge/Industrial-Modbus%20TCP-orange)

Este repositório documenta minha jornada de capacitação em **Sistemas Embarcados e IoT**, com foco em interoperabilidade e protocolos de comunicação. O objetivo principal foi desenvolver arquiteturas onde o hardware (**ESP32**) se integra de forma robusta a sistemas Web, Cloud e Industriais.

## 📂 Estrutura do Projeto

O repositório está organizado em módulos práticos, cada um explorando um protocolo ou arquitetura específica:

| Pasta | Projeto | Protocolo | Descrição |
| :--- | :--- | :--- | :--- |
| `1- Sensor de Presença` | **Sistema de Segurança** | `HTTPS` | Integração direta com API do **Telegram** (Bot) para alertas de intrusão em tempo real. |
| `2- Gestão de usuarios` | **Controle de Acesso** | `MQTT` | Sistema Pub/Sub utilizando Broker **EMQX** rodando em container **Docker**. Gestão via Insomnia. |
| `3- Servidor Temp...` | **Dashboard Full Stack** | `HTTP/REST` | API em **Node.js** + **MongoDB** para telemetria de temperatura (DHT11) e Frontend Web para visualização. |
| `4- Integração Elipse` | **Automação Industrial** | `Modbus TCP` | Implementação de Server Modbus no ESP32 comunicando com supervisório **Elipse E3**. |
| `5- Trena Eletronica` | **Data Logging** | `HTTP/REST` | Monitoramento de Ultrassônico com registro histórico no **MongoDB**. |

## 🛠 Tech Stack

### Firmware & Hardware
* **Microcontrolador:** ESP32 DevKit V1
* **Linguagem:** C++ (Arduino Framework / PlatformIO)
* **Sensores:** DHT11 (Temperatura), HC-SR04 (Ultrassônico), PIR (Presença).

### Backend & Connectivity
* **Protocolos:** MQTT, Modbus TCP, HTTP (REST), HTTPS.
* **Server Side:** Node.js, Express.
* **Database:** MongoDB.
* **Infraestrutura:** Docker, EMQX Broker.

### Industrial & Ferramentas
* **SCADA:** Elipse E3 Studio.
* **API Testing:** Insomnia.

### 👤 Autor

Desenvolvido por **Gustavo** durante curso de especialização em IoT.
[LinkedIn](https://www.linkedin.com/in/gbrazilino/)