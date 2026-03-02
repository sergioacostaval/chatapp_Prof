# chat-app-React

Application de chat temps reel avec:
- `client`: React + Socket.IO client
- `server`: Express + Socket.IO server

## Prerequis
- Node.js 18+ (recommande)
- npm

## Structure
- `client/public/index.html` est deja present (fichier de depart front-end)
- `client/src` contient l'application React
- `server/server.js` contient le serveur HTTP + WebSocket

## Installation locale
Dans deux terminaux separes:

```bash
# Terminal 1
cd server
npm install
```

```bash
# Terminal 2
cd client
npm install
```

## Lancer en local
Terminal 1 (serveur):

```bash
cd server
npm start
```

Terminal 2 (client React):

```bash
cd client
npm start
```

Le client est sur `http://localhost:3000`.
Le serveur ecoute sur `http://localhost:5000` (ou `PORT` si definie).

## Variables d'environnement
### Frontend (Vercel / React)
- `REACT_APP_SERVER_URL`: URL publique du backend (Render)
- Exemple: `https://chat-app-server.onrender.com`

Le client utilise:
1. `REACT_APP_SERVER_URL` si definie
2. sinon `http://localhost:5000`

### Backend (Render)
- `PORT`: fourni automatiquement par Render
- `CLIENT_URL`: URL du frontend Vercel (ex: `https://chat-app-react.vercel.app`)

## Deploiement Backend sur Render
### Option A (simple via interface)
1. Va sur Render -> `New +` -> `Web Service`.
2. Connecte le repo `MouradIntellij/chat-app-React`.
3. Configure:
- `Root Directory`: `server`
- `Build Command`: `npm install`
- `Start Command`: `npm start`
- `Plan`: Free
4. Dans `Environment Variables`, ajoute:
- `CLIENT_URL=https://<ton-frontend-vercel>.vercel.app`
5. Deploy et copie l'URL publique Render.

### Option B (render.yaml deja fourni)
Le fichier `render.yaml` est deja a la racine.
Tu peux deployer en mode Blueprint depuis Render en important ce fichier.
Il te restera a definir `CLIENT_URL` dans Render.

## Deploiement Frontend sur Vercel
1. Va sur Vercel -> `Add New...` -> `Project`.
2. Importe `MouradIntellij/chat-app-React`.
3. Configure:
- `Root Directory`: `client`
- Build command: `npm run build`
- Output directory: `build`
4. Ajoute la variable Vercel:
- `REACT_APP_SERVER_URL=https://<ton-backend-render>.onrender.com`
5. Deploy.

## Ordre conseille
1. Deploy backend sur Render
2. Recuperer son URL publique
3. Configurer `REACT_APP_SERVER_URL` sur Vercel
4. Redeployer frontend

## Fichiers utiles
- `client/.env.example` (exemple de variable frontend)
- `render.yaml` (configuration Render optionnelle)

## GitHub
Depot distant:
`https://github.com/MouradIntellij/chat-app-React.git`
