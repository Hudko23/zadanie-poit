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

## SemZadServer
Vytvorenie noveho suboru a mazanie starych udajov.
```python
def background_thread(args):
    count = 0
    startEmission = False
    file = open('monitoring.txt', 'w').close()
    file = open('monitoring.txt', 'a')
```

Pripojenie a nacitavanie dat z portu.
```python
ser=serial.Serial("/dev/ttyUSB0",9600)
ser.baudrate=9600
read_ser=ser.readline()
```

Ak je poziadavka od klienta, tak sa nan pripoji.

 ```python
@app.route('/')
def index():
    return render_template('index.html', async_mode=socketio.async_mode)
     
@socketio.on('connect', namespace='/test')
def handle_connect():
    session['START_EMISSION'] = 'NOT_SET'
    session['START_STORING'] = 'NOT_SET'
    global thread
    with thread_lock:
        if thread is None:
            thread = socketio.start_background_task(target=background_thread, args=session._get_current_object())

@socketio.on('set_emission_state', namespace='/test')
def handle_emission_state(message):
    print('set_emission_state')
    print(message)
    session['START_EMISSION'] = 'EMIT' if message['value'] else 'NOT_SET'
```

Odosielanie dat na klienta a ukladanie do subora.
```pythan
while True:
        time.sleep(0.1)
        if args:
            print(args)
            startEmission = dict(args).get('START_EMISSION')
            startStoring = dict(args).get('START_STORING')
            print('startEmission ' + str(startEmission))
            read_ser=ser.readline()
            print(read_ser)
            if startEmission == 'EMIT':
                socketio.emit('semaphore_data', {'semaphoreState': read_ser}, namespace='/test')
            if startStoring == 'STORE':
                newLine = read_ser
                file.write(newLine)
                print('New line added: ' + newLine)
```
