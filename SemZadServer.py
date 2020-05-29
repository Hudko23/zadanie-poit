
from threading import Lock
from flask import Flask, render_template, session, request, jsonify, url_for
from flask_socketio import SocketIO, emit, disconnect  

import random
import math
import serial
import time

async_mode = None

app = Flask(__name__)

app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, async_mode=async_mode)
thread = None
thread_lock = Lock()

ser=serial.Serial("/dev/ttyUSB0",9600)
ser.baudrate=9600

def background_thread(args):
    count = 0
    startEmission = False 
    print('It works!')
    while True:
        time.sleep(0.1)
        if args:
            print(args)
            startEmission = dict(args).get('START_EMISSION')
            print('startEmission ' + str(startEmission))
            if startEmission:
                read_ser=ser.readline()
                print(read_ser)
                socketio.emit('semaphore_data', {'semaphoreState': read_ser}, namespace='/test')  

@app.route('/')
def index():
    return render_template('index.html', async_mode=socketio.async_mode)
       
@socketio.on('connect', namespace='/test')
def handle_connect():
    global thread
    with thread_lock:
        if thread is None:
            thread = socketio.start_background_task(target=background_thread, args=session._get_current_object())
    
@socketio.on('set_emission_state', namespace='/test')
def handle_emission_state(message):
    print('set_emission_state')
    print(message)
    session['START_EMISSION'] = message['value']


@socketio.on('disconnect', namespace='/test')
def handle_disconnect():
    print('Client disconnected', request.sid)

if __name__ == '__main__':
    socketio.run(app, host="0.0.0.0", port=80, debug=True)
