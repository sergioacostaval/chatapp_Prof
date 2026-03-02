// ============================================================
// index.js — Point d'entrée React
// ============================================================

import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { SocketProvider } from "./context/SocketContext";

// 🔑 On enveloppe <App> dans <SocketProvider>
// Ainsi, TOUS les composants enfants ont accès au socket via useSocket()
// et chaque onglet crée sa propre instance indépendante.
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    // 🔹 StrictMode retiré intentionnellement en développement :
    // il monte/démonte les composants 2 fois, ce qui peut doubler
    // les listeners Socket.io et créer de faux bugs.
    <SocketProvider>
        <App />
    </SocketProvider>
);
