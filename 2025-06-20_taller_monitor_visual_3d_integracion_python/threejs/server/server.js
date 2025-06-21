const WebSocket = require('ws'); 
const net = require('net');     

const WS_PORT = 8080;
const wss = new WebSocket.Server({ port: WS_PORT });

console.log(`WebSocket Server escuchando en ws://localhost:${WS_PORT}`);

const PYTHON_HOST = '127.0.0.1'; 
const PYTHON_PORT = 65432;       

let pythonClient = new net.Socket();
let pythonConnected = false;
let messageBuffer = ''; 

function connectToPython() {
    console.log(`Intentando conectar a Python en ${PYTHON_HOST}:${PYTHON_PORT}...`);
    pythonClient.connect(PYTHON_PORT, PYTHON_HOST, () => {
        console.log('Conectado al script de Python.');
        pythonConnected = true;
    });
}

pythonClient.on('close', () => {
    console.log('Desconectado del script de Python. Reconectando en 5 segundos...');
    pythonConnected = false;
    setTimeout(connectToPython, 5000);
});

pythonClient.on('error', (err) => {
    console.error('Error en la conexión con Python:', err.message);
    if (!pythonConnected) { 
        console.log('Reintentando conexión con Python...');
        setTimeout(connectToPython, 5000); 
    }
});

pythonClient.on('data', (data) => {
    messageBuffer += data.toString('utf-8');
    let messages = messageBuffer.split('\n');
    messageBuffer = messages.pop(); 

    messages.forEach(message => {
        if (message.trim()) {
            try {
                const parsedData = JSON.parse(message);
                
                wss.clients.forEach(client => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify(parsedData));
                    }
                });
            } catch (e) {
                console.error('Error parseando JSON de Python:', e, 'Mensaje:', message);
            }
        }
    });
});

connectToPython();

wss.on('connection', ws => {
    console.log('Cliente WebSocket conectado desde el navegador.');
    ws.on('close', () => {
        console.log('Cliente WebSocket desconectado.');
    });
    ws.on('error', error => {
        console.error('Error en WebSocket con cliente:', error);
    });
});