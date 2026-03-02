// ============================================================
// Message.js — Affiche un message individuel (style WhatsApp)
// ============================================================

import React from "react";

function Message({ msg, username }) {
    // 🔹 Déterminer si le message vient de l'utilisateur courant
    const isOwn = msg.author === username;

    // 🔹 Messages système (quelqu'un rejoint/quitte)
    if (msg.system) {
        return (
            <div className="systemMessage">
                <span>{msg.message}</span>
            </div>
        );
    }

    return (
        // 🔹 Classe "own" pour les bulles à droite (mes messages)
        //    Classe "other" pour les bulles à gauche (messages des autres)
        <div className={`message ${isOwn ? "own" : "other"}`}>
            {/* Afficher l'auteur seulement pour les messages des autres */}
            {!isOwn && <p className="author">{msg.author}</p>}

            {/* Contenu du message */}
            <p className="messageText">{msg.message}</p>

            {/* Heure d'envoi */}
            <span className="messageTime">{msg.time}</span>
        </div>
    );
}

export default Message;
