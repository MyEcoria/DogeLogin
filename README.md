# DogeLogin

Ce code crée un serveur web avec le framework Express et utilise plusieurs modules pour gérer les connexions WebSocket, les requêtes HTTP et les réponses JSON.

Il définit une route '/' qui renvoie le fichier 'index.html' du répertoire 'public' et une route '/login' qui gère les requêtes GET avec deux actions possibles : 'create' et 'verify'.

Pour l'action 'create', il envoie une requête POST à l'URL 'http://31.37.136.162:7030' avec le contenu spécifié dans le corps de la requête et renvoie la réponse au client.

Pour l'action 'verify', il vérifie si l'adresse passée en paramètre commence par 'xdg_', puis crée une connexion WebSocket avec le serveur 'wss://ws.dogenano.io' et souscrit aux notifications de confirmation de blocs pour cette adresse. Lorsqu'un message est reçu, il vérifie s'il s'agit d'une notification de confirmation et renvoie l'adresse au client s'il s'agit d'une adresse différente de celle passée en paramètre. Si aucun message n'est reçu pendant 60 secondes, la connexion est fermée.

Le serveur écoute également les requêtes entrantes sur le port 3000.

# Installation avec Docker

Modifier le fichier `.env`

1) `sudo docker build --no-cache -t login:latest .`
2) `sudo docker run --restart=unless-stopped --env-file .env -d --name login -p 3000:3000 login:latest`

# Contribution

Si vous souhaitez contribuer à ce projet, n'hésitez pas à créer une pull request ou à ouvrir une issue pour signaler un bug ou suggérer une amélioration.
