# zadanie-poit

## arduino kod
Nastavenie premennych a cisla pinov, kde su zapojene.
Nastavenie (Stringov), ktore vypisuje na port.
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
Prikaz (if a else if).
Prvy if sa spusti po stlaceni tlacidla.
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
Vytvorenie noveho suboru a mazanie starych udajov zo suboru pri novom nacitani serveru.
```python
def background_thread(args):
    count = 0
    startEmission = False
    file = open('monitoring.txt', 'w').close()
    file = open('monitoring.txt', 'a')
```

Pripojenie na port a nasledne citanie dat z portu.
```python
ser=serial.Serial("/dev/ttyUSB0",9600)
ser.baudrate=9600
read_ser=ser.readline()
```

Vytvorý HTML stranku, ktorú vidí klient.
 ```python
@app.route('/')
def index():
    return render_template('index.html', async_mode=socketio.async_mode)
```

Po otovrení stránky sa klient pripojí pomocou tejto metódy na server, a nasledne sa vytvorí nové vlákno na ktorom bude bežať  background_thread (pomocou tejto funkcie budeme posielat data z arduina spät na klienta)
```python
@socketio.on('connect', namespace='/test')
def handle_connect():
    session['START_EMISSION'] = 'NOT_SET'
    session['START_STORING'] = 'NOT_SET'
    global thread
    with thread_lock:
        if thread is None:
            thread = socketio.start_background_task(target=background_thread, args=session._get_current_object())
```

Podľa požiadavky klienta spušťa dáta zo servera.
```python
@socketio.on('set_emission_state', namespace='/test')
def handle_emission_state(message):
    print('set_emission_state')
    print(message)
    session['START_EMISSION'] = 'EMIT' if message['value'] else 'NOT_SET'
```

(While) cyklus, kotry odosiela data klientovi a zaroven ich uklada do subora.
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


## Klient HTML
Vizualne spracovanie stranky.
Nadpis:
```html
<h1>SEMAPHORE MONITORING</h1>
```

Nastavenie tlacidiel:
```html
  <button id="beginEmissionButtonId">Connect</button>
  <button id="endEmissionButtonId">Disconnect</button>
  <button id="startLogButtonId">Start Monitoring</button>
  <button id="stopLogButtonId">Stop Monitoring</button>
```

Vypisovanie monitorovanych dat:
```Html
 <h2>Receive:</h2>
  <div id="logId"></div>
```

Nastavenie semafora (zmena farieb, rozmer):
```HTML
.semaphore {
        height: 50px;
        width: 50px;
        border: 1px solid black;
        border-radius: 50%;
      }
      
      .semaphore--red {
        background-color: red;
      }
      
      .semaphore--green {
        background-color: lawngreen;
      }

<h2>Semaphore walker:</h2>
  <div id="walkerSemaphoreId" class="semaphore"></div>
  <h2>Semaphore car:</h2>
  <div id="carSemaphoreId" class="semaphore"></div>
```


## Klient Script

Inicializacia premenných:
```java script
    const beginEmissionButtonRef = $('#beginEmissionButtonId');
	const endEmissionButtonRef = $('#endEmissionButtonId');
	
	const htmlLogContainer = $('#logId');
	const startLogButtonRef = $('#startLogButtonId');
	const stopLogtButtonRef = $('#stopLogButtonId');
	const monitoiringRef = $('#monitoiringId');
	const emissionRef = $('#emissionId');
	const walkerSemaphoreRef = $('#walkerSemaphoreId');
	const carSemaphoreRef = $('#carSemaphoreId');
``` 

Nastavenie pripojenia a monitoringu na hodnotu (False):
```java script
	let shouldLog = false;
	monitoiringRef.text('False');
	emissionRef.text('False');
```

Nastavenie constant, ktore sa citaju z portu.
```java script
		const CAR_RED = 'CarRed';
		const CAR_GREEN = 'CarGreen';
		const WALKER_RED = 'WalkerRed';
		const WALKER_GREEN = 'WalkerGreen';
```

Natavenie css tried semaforov pre prikaz (case).
```java script
		const semaphoreRedClass = 'semaphore--red';
		const semaphoreGreenClass = 'semaphore--green';
```

Nacitanie dat pre semafor, odstranenie bielich znakov z nacitanych dat (ako napr. novy riadok) pomocou funkcie (trim).
```java script
	socket.on('semaphore_data', (msg) => {
		const { semaphoreState } = msg;
		const semaphoreStateWithoutNewLine = semaphoreState.trim();
```

Prepinanie farieb semaforov na stranke pomocou prikazu (case).
```java script
		console.log('Received', semaphoreStateWithoutNewLine);
		if (shouldLog) {
			switch(semaphoreStateWithoutNewLine) {
				case CAR_RED: {
					carSemaphoreRef.removeClass(semaphoreGreenClass);
					carSemaphoreRef.addClass(semaphoreRedClass);
					break;
				}
				case CAR_GREEN: {
					carSemaphoreRef.removeClass(semaphoreRedClass);
					carSemaphoreRef.addClass(semaphoreGreenClass);
					break;
				}
				case WALKER_RED: {
					walkerSemaphoreRef.removeClass(semaphoreGreenClass);
					walkerSemaphoreRef.addClass(semaphoreRedClass);
					break;
				}
				case WALKER_GREEN: {
					walkerSemaphoreRef.removeClass(semaphoreRedClass);
					walkerSemaphoreRef.addClass(semaphoreGreenClass);
					break;
				}
				default:
					console.error('Unknown semaphore value');
			
			}
```

