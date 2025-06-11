int IN1 = 8;
int IN2 = 9;
int ENA = 10;

void setup() {
  pinMode(IN1, OUTPUT);
  pinMode(IN2, OUTPUT);
  pinMode(ENA, OUTPUT);
  Serial.begin(9600); // Inicializa a comunicação serial
}

void loop() {
  if (Serial.available() > 0) {
    String comando = Serial.readStringUntil('\n');
    comando.trim();

    if (comando.startsWith("liberar:")) {
      // Exemplo: liberar:Paracetamol
      acionarMotor();
      Serial.println("OK");
    }
  }
}

void acionarMotor() {
  // Girar o motor para frente
  digitalWrite(IN1, HIGH);
  digitalWrite(IN2, LOW);
  analogWrite(ENA, 150);
  delay(2000);

  // Parar
  analogWrite(ENA, 0);
  delay(1000);

  // Girar o motor para trás
  digitalWrite(IN1, LOW);
  digitalWrite(IN2, HIGH);
  analogWrite(ENA, 200);
  delay(2000);

  // Parar
  analogWrite(ENA, 0);
  delay(1000);
}