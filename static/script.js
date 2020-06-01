$(document).ready(() => {

	const namespace = '/test';
	const socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port + namespace);
	
	const beginEmissionButtonRef = $('#beginEmissionButtonId');
	const endEmissionButtonRef = $('#endEmissionButtonId');
	
	const htmlLogContainer = $('#logId');
	const startLogButtonRef = $('#startLogButtonId');
	const stopLogtButtonRef = $('#stopLogButtonId');
	const monitoiringRef = $('#monitoiringId');
	const emissionRef = $('#emissionId');
	const walkerSemaphoreRef = $('#walkerSemaphoreId');
	const carSemaphoreRef = $('#carSemaphoreId');
	
	// Init values
	let shouldLog = false;
	monitoiringRef.text('False');
	emissionRef.text('False');
	
	// Attach events
	socket.on('connect', () => {
		console.log('Connected to websocket');
	});

	socket.on('semaphore_data', (msg) => {
		const { semaphoreState } = msg;
		const semaphoreStateWithoutNewLine = semaphoreState.trim();
		
		const CAR_RED = 'CarRed';
		const CAR_GREEN = 'CarGreen';
		const WALKER_RED = 'WalkerRed';
		const WALKER_GREEN = 'WalkerGreen';
		
		const semaphoreRedClass = 'semaphore--red';
		const semaphoreGreenClass = 'semaphore--green';
			
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
			htmlLogContainer.append(`Semaphore state: ${semaphoreStateWithoutNewLine} <br>`).html();
		}
	});
	
	startLogButtonRef.click((event) => {
		shouldLog = true;
		socket.emit('set_storing', {value: true});
		monitoiringRef.text('True');
	});
	
	stopLogtButtonRef.click((event) => {
		shouldLog = false;
		socket.emit('set_storing', {value: false});
		monitoiringRef.text('False');
	});
	
	beginEmissionButtonRef.click((event) => {
		console.log('Begin emission');
		socket.emit('set_emission_state', {value: true});
		emissionRef.text('True');
	});
	
	endEmissionButtonRef.click((event) => {
		console.log('End emission');
		socket.emit('set_emission_state', {value: false});
		emissionRef.text('False');
	});
	     
});
