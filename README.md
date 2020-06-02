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
Nastavenie pinov na vstupy a vystupy.
```wiring
void setup() {
    Serial.begin(9600);             //nastavenie rychlosti portu
    pinMode(CarRed, OUTPUT);
    pinMode(CarYellow, OUTPUT);
    pinMode(CarGreen, OUTPUT);
    pinMode(WalkerRed, OUTPUT);
    pinMode(WalkerGreen, OUTPUT);
    pinMode(ButtonForWalker, INPUT);
    pinMode(FotosensorForCar, INPUT);
    digitalWrite(CarGreen, HIGH);       // zapne led diodu
    Serial.println(CarLightGreen);      // vypisovanie na port
    digitalWrite(WalkerRed, HIGH);      // zapne led diodu
    Serial.println(WalkerLightRed);     // vypisovanie na port
}
```
Prvy if sa spusti ked sa stlaci po stlaceni tlacidla.
Druhy else if sa spusti po zatieneni fotorezistora.
```wiring
void loop() {
   int StatusButton = digitalRead(ButtonForWalker);         // nastavenie tlacidla na digitalRead
   int StatusFotosensor = analogRead(FotosensorForCar);     // nastavenie gotorezistora na analogRead
   
      if (StatusButton == HIGH) {           // spusti sa po stlaceni tlacidla

        digitalWrite(CarGreen, LOW);        // vypne led diodu
        digitalWrite(CarYellow, HIGH);      // zapne led diodu
        delay(2000);                        // pocka 2s
      
        digitalWrite(CarYellow, LOW);       // vypne led diodu
        digitalWrite(CarRed, HIGH);         // zapne led diodu
        Serial.println(CarLightRed);        // vypisovanie na port
        delay(1000);                        // pocka 1s
      
        digitalWrite(WalkerRed, LOW);       // vypne led diodu
        digitalWrite(WalkerGreen, HIGH);    // zapne led diodu
        Serial.println(WalkerLightGreen);   // vypisovanie na port
       
      }

      else if (StatusFotosensor < 100) {    // spusti sa po zatieneni fotorezistora
        
        digitalWrite(WalkerGreen, LOW);     // vypne led diodu
        digitalWrite(WalkerRed, HIGH);      // zapne led diodu
        Serial.println(WalkerLightRed);     // vypisovanie na port
        delay(1000);                        // pocka 1s
      
        digitalWrite(CarYellow, HIGH);      // zapne led diodu
        delay(2000);                        // pocka 2s      
        
        digitalWrite(CarRed, LOW);           // vypne led diodu
        digitalWrite(CarGreen, HIGH);        // zapne led diodu
        Serial.println(CarLightGreen);       // vypisovanie na port
        digitalWrite(CarYellow, LOW);        // vypne led diodu
      
      }      
}
```
