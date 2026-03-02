// SocketContext.js
import React, { createContext, useContext } from "react";
import io from "socket.io-client";

const SocketContext = createContext(null);

// 🔑 LA CLÉ DU CORRECTIF :
// Le socket est créé ICI, au niveau du MODULE, complètement en dehors de React.
// Ainsi React StrictMode (qui monte/démonte les composants 2x) ne peut PAS le détruire.
// Chaque onglet du navigateur charge son propre module → chaque onglet a son propre socket.

// URL serveur en priorite via variable d'environnement (Vercel/React).
// Si la variable est absente/invalide:
// - localhost en developpement local
// - URL Render en fallback de production
const LOCAL_SOCKET_URL = "http://localhost:5000";
const RENDER_FALLBACK_URL = "https://chat-app-react-4a3k.onrender.com";
const envUrl = (process.env.REACT_APP_SERVER_URL || "").trim();
const isPlaceholderUrl = envUrl.includes("votre-app.railway.app");
const isLocalHost =
    typeof window !== "undefined" &&
    (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

const DEFAULT_SOCKET_URL = !envUrl || isPlaceholderUrl
    ? (isLocalHost ? LOCAL_SOCKET_URL : RENDER_FALLBACK_URL)
    : envUrl;

const socket = io(DEFAULT_SOCKET_URL, { autoConnect: false });

// ────────────────
// PROVIDER REACT
// ────────────────
export function SocketProvider({ children }) {
    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
}

// ────────────────
// HOOK UTILITAIRE
// ────────────────
export function useSocket() {
    return useContext(SocketContext);
}
