// ============================================================
// Sidebar.js — Panneau latéral avec la liste des utilisateurs
// ============================================================

import React from "react";

function Sidebar({ users, room, show, onClose }) {
    return (
        <>
            {/* Fond semi-transparent quand la sidebar est ouverte (mobile) */}
            {show && <div className="sidebarOverlay" onClick={onClose} />}

            <div className={`sidebar ${show ? "open" : ""}`}>
                <div className="sidebarHeader">
                    <h4>#{room}</h4>
                    <button className="closeSidebar" onClick={onClose}>✕</button>
                </div>

                <div className="sidebarSection">
                    <p className="sidebarLabel">
                        PARTICIPANTS ({users.length})
                    </p>

                    {/* 🔹 Afficher chaque utilisateur avec son initiale */}
                    {users.length > 0 ? (
                        users.map((u) => (
                            <div className="userItem" key={u.socketId}>
                                <div className="userAvatar">
                                    {u.username.charAt(0).toUpperCase()}
                                </div>
                                <span>{u.username}</span>
                                {/* Point vert = en ligne */}
                                <span className="onlineDot" />
                            </div>
                        ))
                    ) : (
                        <p className="noUsers">Aucun utilisateur</p>
                    )}
                </div>
            </div>
        </>
    );
}

export default Sidebar;
