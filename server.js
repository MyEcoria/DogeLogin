// On importe le module 'express' et on le stocke dans la variable 'express'
const express = require('express');

// On importe le module 'path' et on le stocke dans la variable 'path'
const path = require('path');

// On crée une application express et on la stocke dans la variable 'app'
const app = express();

// On importe le module 'ws' (WebSocket) et on le stocke dans la variable 'WS'
const WS = require('ws');

// On importe le module 'reconnecting-websocket' et on le stocke dans la variable 'ReconnectingWebSocket'
const ReconnectingWebSocket = require('reconnecting-websocket');

// On importe le module 'request' et on le stocke dans la variable 'request'
const request = require('request');

// On importe le module 'axios' et on le stocke dans la variable 'axios'
const axios = require('axios');


// Charger les fichiers statiques depuis le répertoire 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Définir une route '/' qui renvoie le fichier 'index.html' du répertoire 'public'
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


app.get('/login', (req, res) => {
  
  console.log(req.query);
  if (req.query['action'] == "create") {
    const options = {
    url: 'http://31.37.136.162:7030',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      action: 'account_create',
      wallet: '2D7A8436F576688215489757D0FFDA7800245857ED9BBDFC49D53C533FBF3B2C'
    })
  };

  request(options, (error, response, body) => {
    if (error) {
      console.log("error")
    } else {
      const body = response.body;
      const data = JSON.parse(body);
      res.json(data);
      console.log(data)
    }
  });
} 

  if (req.query['action'] == "verify") {
    const add = req.query['account']
    if (req.query['account'].substring(0, 4) == "xdg_") {
      
      const ws = new ReconnectingWebSocket('wss://ws.dogenano.io', [], {
        WebSocket: WS,
        connectionTimeout: 1000,  
        maxRetries: 100000,
        maxReconnectionDelay: 2000,
        minReconnectionDelay: 10 // if not set, initial connection will take a few seconds by default
      });

      // As soon as we connect, subscribe to block confirmations
      ws.onopen = () => {
        const confirmation_subscription = {
          "action": "subscribe", 
          "topic": "confirmation",
          "options": { "accounts": [add] }
        }
        ws.send(JSON.stringify(confirmation_subscription));

        // Other subscriptions can go here
      };

      // The node sent us a message
      ws.onmessage = msg => {
        data_json = JSON.parse(msg.data);
        if (data_json.topic === "confirmation") {
          data = data_json["message"]
          data = data["account"]
          if (data != add) {
            data = { "account": data }
            console.log(data);
            res.json(data);
	    ws.close();
          }
        }

      };


      setTimeout(function close() {
        
	try {
          ws.send('un message');
          console.log('La connection WebSocket est ouverte');
          ws.close();
        } catch (error) {
          console.log('La connection WebSocket est fermée');
        }
      }, 60000);

    } else { console.log("Yes"); }

  }

});


const port = 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
