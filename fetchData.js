const axios = require('axios');
const WebSocket = require('ws')

axios.get('https://livetiming.formula1.com/signalr/negotiate', {
	params: {
		connectionData: '[{\"name\":\"Streaming\"}]',
        clientProtocol: '1.5'
	}
})
.then(function (response) {
    console.log(response.headers['set-cookie'])
    const ws = new WebSocket('wss://livetiming.formula1.com/signalr/connect?transport=webSockets&connectionData=[{\"name\":\"Streaming\"}]&connectionToken='+ response.data.ConnectionToken + '&clientProtocol={"1.5"}', [], {
        'headers': {
            'Cookie': response.headers['set-cookie']
        }
    });

    ws.on('error', console.error);

    ws.on('open', function open() {
        console.log("ws open")
    });
})