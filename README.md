# zadanie-poit

## arduino kod
Nastavenie premennych a pinov.
```wiring
int CarRed = 12;
int CarYellow = 11;
int CarGreen = 10;
int WalkerRed = 9;
int WalkerGreen = 8;
int ButtonForWalker = 2;
int FotosensorForCar = A0;
String CarLightRed = "CarRed";
String CarLightGreen = "CarGreen";
String WalkerLightRed = "WalkerRed";
String WalkerLightGreen = "WalkerGreen";
```
Nastavenie rychlosti portu.
Nastavenie pinov na vstupy a vzstupy.
```wiring
void setup() {
    Serial.begin(9600);
    pinMode(CarRed, OUTPUT);
    pinMode(CarYellow, OUTPUT);
    pinMode(CarGreen, OUTPUT);
    pinMode(WalkerRed, OUTPUT);
    pinMode(WalkerGreen, OUTPUT);
    pinMode(ButtonForWalker, INPUT);
    pinMode(FotosensorForCar, INPUT);
    digitalWrite(CarGreen, HIGH);
    Serial.println(CarLightGreen);
    digitalWrite(WalkerRed, HIGH);
    Serial.println(WalkerLightRed);
}
```
Prvy if sa spusti ked sa stlaci po stlaceni tlacidla.
Druhy else if sa spusti po zatieneni fotorezistora.
```wiring
void loop() {
   int StatusButton = digitalRead(ButtonForWalker);
   int StatusFotosensor = analogRead(FotosensorForCar);
   
      if (StatusButton == HIGH) {

        digitalWrite(CarGreen, LOW);
        digitalWrite(CarYellow, HIGH);
        delay(2000);
      
        digitalWrite(CarYellow, LOW);
        digitalWrite(CarRed, HIGH);
        Serial.println(CarLightRed);
        delay(1000);
      
        digitalWrite(WalkerRed, LOW);
        digitalWrite(WalkerGreen, HIGH);
        Serial.println(WalkerLightGreen);
       
      }

      else if (StatusFotosensor < 100) {
        
        digitalWrite(WalkerGreen, LOW);
        digitalWrite(WalkerRed, HIGH);
        Serial.println(WalkerLightRed);
        delay(1000);
      
        digitalWrite(CarYellow, HIGH);
        delay(2000);
        
        digitalWrite(CarRed, LOW);
        digitalWrite(CarGreen, HIGH);
        Serial.println(CarLightGreen);
        digitalWrite(CarYellow, LOW);
      
      }      
}
```
