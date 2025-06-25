
const int VELOCIDADE_MOTOR = 5; // Velocidade da roda

const int TEMPO_GIRO_MOTOR = 110; // Tempo de giro do motor 

// Pinos do Hardware, importante verificar!!!
const int IN1 = 8;
const int IN2 = 9;
const int ENA = 10;

void setup() {
  pinMode(IN1, OUTPUT);
  pinMode(IN2, OUTPUT);
  pinMode(ENA, OUTPUT);

  // Garante que o motor comece parado
  digitalWrite(IN1, LOW);
  digitalWrite(IN2, LOW);
  analogWrite(ENA, 0);

  Serial.begin(9600);
  Serial.println("Sistema pronto.");
  Serial.println("Envie qualquer comando para girar o motor para frente.");
}

void loop() {
  if (Serial.available() > 0) {
    
    Serial.println("Comando recebido, acionando motor para frente...");
    
    acionarMotorFrente(); 
    
    Serial.println("Movimento finalizado. Aguardando novo comando.");

    while(Serial.available() > 0) {
      Serial.read(); 
    }
  }
}


void acionarMotorFrente() {
  
  // Liga o motor
  Serial.print("Girando para frente ");
  Serial.print(TEMPO_GIRO_MOTOR);
  Serial.println(" ms...");
  
  digitalWrite(IN1, HIGH);
  digitalWrite(IN2, LOW);
  analogWrite(ENA, VELOCIDADE_MOTOR);
  
  delay(TEMPO_GIRO_MOTOR);

  // Corta a energia do pino de velocidade
  Serial.println("Parando o motor.");
  analogWrite(ENA, 0); 
  digitalWrite(IN1, LOW);
  digitalWrite(IN2, LOW);
}