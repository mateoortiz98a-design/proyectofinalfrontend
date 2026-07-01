import React from 'react'
import useForm from '../../hooks/useForm'
import './ContactPanel.css'

function getUserFromToken() {
    const token = localStorage.getItem('access_token')
    if (!token) return null
    const payload = token.split('.')[1]
    return JSON.parse(atob(payload))
}

const ContactPanel = ({
    contacts,
    pendingRequests,
    onSendRequest,
    onRespond,
    onDelete,
    onStartChat
}) => {
    const { formState, handleChange, handleSubmit } = useForm(
        { email: '' },
        (data) => {
            if (data.email.trim()) {
                onSendRequest(data.email)
                formState.email = ''
            }
        }
    )

    const currentUser = getUserFromToken()

    return (
        <div className="contact-panel">
            <div className="contact-panel__header">
                <h2>📋 Contactos</h2>
            </div>

            <form onSubmit={handleSubmit} className="contact-panel__add">
                <input
                    className="contact-panel__input"
                    placeholder="Email del usuario a agregar..."
                    name="email"
                    type="email"
                    value={formState.email}
                    onChange={handleChange}
                />
                <button type="submit" className="contact-panel__add-btn">Agregar contacto</button>
            </form>

            {pendingRequests.length > 0 && (
    <div className="contact-panel__pending">
        <p className="contact-panel__section-title">
            Solicitudes pendientes ({pendingRequests.length})
        </p>

        {pendingRequests.map(req => {
            console.log("Solicitud:", req);
            console.log("Sender:", req.fk_sender_id);

            return (
                <div key={req._id} className="contact-card">
                    <div className="contact-card__info">
                        <div className="contact-card__avatar">
                            {req.fk_sender_id?.name?.charAt(0).toUpperCase() || "?"}
                        </div>

                        <div>
                            <p className="contact-card__name">
                                {req.fk_sender_id?.name || "SIN NOMBRE"}
                            </p>

                            <p className="contact-card__email">
                                {req.fk_sender_id?.email || "SIN EMAIL"}
                            </p>
                        </div>
                    </div>

                    <div className="contact-card__actions">
                        <button
                            className="contact-card__btn contact-card__btn--accept"
                            onClick={() => onRespond(req._id, "ACEPTADO")}
                        >
                            ✅ Aceptar
                        </button>

                        <button
                            className="contact-card__btn contact-card__btn--reject"
                            onClick={() => onRespond(req._id, "RECHAZADO")}
                        >
                            ❌ Rechazar
                        </button>
                    </div>
                </div>
            );
        })}
    </div>
)}

            <p className="contact-panel__section-title">Mis contactos ({contacts.length})</p>

            {contacts.length === 0
                ? <p className="contact-panel__empty">No tenés contactos aún. ¡Agregá a alguien!</p>
                : contacts.map(contact => {
                    console.log("CONTACT:", contact);
                    const user = contact.fk_sender_id.email === currentUser?.email
                        ? contact.fk_receiver_id
                        : contact.fk_sender_id
                    const inicial = user.name?.charAt(0).toUpperCase() || '?'

                    return (
                        <div key={contact._id} className="contact-card">
                            <div className="contact-card__info">
                                <div className="contact-card__avatar">{inicial}</div>
                                <div>
                                    <p className="contact-card__name">{user.name}</p>
                                    <p className="contact-card__email">{user.email}</p>
                                </div>
                            </div>
                            <div className="contact-card__actions">
                                <button className="contact-card__btn contact-card__btn--chat" onClick={() => onStartChat(user._id)}>
                                    💬 Chat
                                </button>
                                <button className="contact-card__btn contact-card__btn--delete" onClick={() => onDelete(contact._id)}>
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default ContactPanel