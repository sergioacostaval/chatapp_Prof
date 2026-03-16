# Question 1 - Analyse du code existant (10 points)

## App.js
C'est le composant principal de l’application React. 
Il gère les états généraux comme le nom d’utilisateur, la room choisie et l’état de connexion.

## Chat.js
C'est le composant principal de la discussion (Le chat).  
Il permet d’afficher les messages dans une conversation, d’envoyer un nouveau message et de voir la liste des utilisateurs connectés.  
Il gère aussi le défilement vers le bas quand un nouveau message arrive. (Avec: UseEffect messagesEndRef.current?.scrollIntoView)

## Message.js
Ce fichier permettre d'afficher un message individuel dans le chat.  
Il vérifie si le message appartient à l’utilisateur ou à un autre utilisateur afin d’appliquer un style différent.

## Sidebar.js
C'est pour afficher la barre latérale du chat.  
Elle montre la room actuelle et la liste des participants connectés. Elle permet aussi de fermer la sidebar sur mobile.

## Join.js
C'est l’écran d’entrée de l’application.  
Il permet à l’utilisateur d’écrire son nom et de choisir une room existante ou d’en créer une nouvelle.

## server.js
C'est le fichier plus important du backend (Node.js) avec Express et Socket.io.  
Il gère les connexions des utilisateurs, les rooms et l’envoi des messages entre les utilisateurs des rooms. Il met aussi à jour la liste des utilisateurs et des rooms.

## SocketContext.js
Ce fichier crée et partage la connexion Socket.io dans toute l’application. De cette facon, tous les composants peuvent utiliser le même socket avec `useSocket()` sans faire une connexion dans chaque fichier.

# Question 2 - Communication frontend / backend (10 points)

## Comment le socket est créé et partagé entre tous les composants React? (indice : SocketContext.js)
Le socket est créé dans le fichier `SocketContext.js` avec la fonction `io(SERVER_URL)`.  
Dans ce fichier, on utilise `createContext()` pour créer un contexte React. Après, le composant `SocketProvider` envoie le socket à toute l’application dans le 'Return' avec :

```js 
<SocketContext.Provider value={socket}>
```

## Quel évènement Socket.io est émis quand un utilisateur rejoint une room, et ce qui se passe cote serveur?
Quand un utilisateur rejoint une room, le frontend envoie cet évènement Socket.io :

```js 
socket.emit("join_room", {
    username: username.trim(),
    room: roomToJoin.trim(),
});
```
Après, le serveur fait plusieurs actions :

- Il vérifie si la room existe, sinon il la crée
- Il ajoute le socket dans la room avec socket.join(room)
- Il sauvegarde le nom de la room et le username dans le socket
- Il ajoute l’utilisateur dans la liste rooms
- Il envoie aussi un message système pour dire que l’utilisateur a rejoint la room

## Comment les messages sont diffusés à tous les membres d'une room (emit vs broadcast)?
Quand un utilisateur envoie un message dans Chat.js, le frontend fait :
```js 
socket.emit("send_message", messageData);
```
Cela veut dire que le client envoie le message au serveur.

Après, dans server.js, le serveur reçoit ce message avec :
```js 
socket.on("send_message", (data) => {
    io.to(data.room).emit("receive_message", data);
});
```
Avec ca, on envoie le message à tous les utilisateurs de la room, incluant l’auteur aussi (C'est pour ca qu'on utilise emit).

## Question 3 - Modification de Message.js (15 points)
j'ai modifié le fichier `Message.js` pour ajouter le texte ✓✓ après `msg.time`.
Après, j'ai ajouté une classe CSS dans `App.css` pour changer la couleur et la taille afin que cet indicateur soit différent du texte du message.

# Question 4 - Bouton 'Quitter la salle' dans Chat.js (15 points)
J'ai ajouté un bouton "Quitter la salle" dans `Chat.js`, dans le header du chat a droite du nom de la room.
Quand l'utilisateur clique sur ce bouton, le client envoie l'evenement `leave_room` au serveur avec le username et la room.
Apres, le serveur envoie un message systeme aux autres utilisateurs pour dire que la personne a quitte la salle. Il met aussi a jour la liste des utilisateurs de la room.
Finalement, dans le frontend, l'etat `connected` devient `false`, donc l'application affiche de nouveau le composant `Join.js`.

# Question 5 - Historique des connexions dans Sidebar.js (20 points)
Jai ajoute un historique des connexions et deconnexions dans la sidebar.
Dans `server.js`, on utilise un tableau `activityLog` pour garder seulement les 5 dernieres activites. Quand un utilisateur rejoint ou quitte une room, le serveur envoie un evenement `activity_log` a tous les clients.
Dans `Sidebar.js`, on ecoute les evenements `activity_log` et `activity_history` avec `useEffect`. Apres, jaffiche les activites dans une nouvelle section avec le titre `ACTIVITE RECENTE`.
