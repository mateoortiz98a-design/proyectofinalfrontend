import React from 'react'
import './NotificationPanel.css'

const NotificationPanel = ({ notifications, onAccept, onReject }) => {
    if (notifications.length === 0) return null

    return (
        <div className="notification-panel">
            {notifications.map((notif, index) => (
                <div key={index} className="notification-card">
                    <div className="notification-card__info">
                        <p className="notification-card__title">📨 Invitación a workspace</p>
                        <p className="notification-card__text">
                            Te invitaron a <strong>{notif.workspace_nombre}</strong> como <strong>{notif.role}</strong>
                        </p>
                    </div>
                    <div className="notification-card__actions">
                        <button className="notification-card__btn notification-card__btn--accept" onClick={() => onAccept(notif)}>
                            ✅ Aceptar
                        </button>
                        <button className="notification-card__btn notification-card__btn--reject" onClick={() => onReject(notif)}>
                            ❌ Rechazar
                        </button>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default NotificationPanel