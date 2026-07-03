import React, { useState } from 'react'
import './PrivateChatPanel.css'

function getUserFromToken() {
    const token = localStorage.getItem('access_token')
    if (!token) return null
    const payload = token.split('.')[1]
    return JSON.parse(atob(payload))
}

const PrivateChatPanel = ({
    selectedPrivateChat,
    privateMessages,
    onSendMessage,
    onDeleteMessage,
    onEditMessage
}) => {
    const [nuevoMensaje, setNuevoMensaje] = useState('')
    const [editandoMensaje, setEditandoMensaje] = useState(null)
    const [textoEdit, setTextoEdit] = useState('')

    const currentUser = getUserFromToken()

    const nombreContacto = currentUser?.email === selectedPrivateChat?.fk_user_id?.email
        ? selectedPrivateChat?.fk_user_id2?.name || 'Usuario eliminado'
        : selectedPrivateChat?.fk_user_id?.name || 'Usuario eliminado'

    const inicial = nombreContacto?.charAt(0).toUpperCase() || '?'

    const handleSend = () => {
        if (!nuevoMensaje.trim()) return
        onSendMessage(nuevoMensaje)
        setNuevoMensaje('')
    }

    const handleEdit = (message_id) => {
        onEditMessage(message_id, textoEdit)
        setEditandoMensaje(null)
        setTextoEdit('')
    }

    if (!selectedPrivateChat) return null

    return (
        <div className="private-chat-panel">
            <div className="private-chat-panel__header">
                <div className="private-chat-panel__avatar">{inicial}</div>
                <h2>{nombreContacto}</h2>
            </div>

            <div className="private-chat-panel__messages">
                {privateMessages.length === 0
                    ? <p className="private-chat-panel__empty">No hay mensajes aún. ¡Iniciá la conversación!</p>
                    : privateMessages.map(msg => {
                        const esMio = msg.fk_sender_user_id?._id?.toString() === currentUser?.id?.toString()
                            || msg.fk_sender_user_id?.toString() === currentUser?.id?.toString()
                        const senderName = esMio ? 'Tú' : (msg.fk_sender_user_id?.name || 'Usuario eliminado')

                        return (
                            <div key={msg._id} className={`message-bubble ${esMio ? 'message-bubble--mine' : 'message-bubble--other'}`}>
                                {!esMio && <span className="message-bubble__sender">{senderName}</span>}
                                {editandoMensaje === msg._id ? (
                                    <div className="message-edit">
                                        <input
                                            className="message-edit__input"
                                            value={textoEdit}
                                            onChange={e => setTextoEdit(e.target.value)}
                                            onKeyDown={e => e.key === 'Enter' && handleEdit(msg._id)}
                                            autoFocus
                                        />
                                        <div className="message-edit__actions">
                                            <button className="message-edit__btn" onClick={() => handleEdit(msg._id)}>Guardar</button>
                                            <button className="message-edit__btn message-edit__btn--cancel" onClick={() => setEditandoMensaje(null)}>Cancelar</button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="message-bubble__content">
                                            <p className="message-bubble__text">{msg.mensaje}</p>
                                            <span className="message-bubble__time">
                                                {new Date(msg.fecha_creacion).toLocaleTimeString()}
                                            </span>
                                        </div>
                                        {esMio && (
                                            <div className="message-bubble__actions">
                                                <button className="message-bubble__btn" onClick={() => { setEditandoMensaje(msg._id); setTextoEdit(msg.mensaje) }}>✏️</button>
                                                <button className="message-bubble__btn" onClick={() => onDeleteMessage(msg._id)}>🗑️</button>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        )
                    })
                }
            </div>

            <div className="private-chat-panel__input-area">
                <div className="private-chat-panel__input-row">
                    <input
                        className="private-chat-panel__input"
                        placeholder={`Mensaje a ${nombreContacto}`}
                        value={nuevoMensaje}
                        onChange={e => setNuevoMensaje(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSend()}
                    />
                    <button className="private-chat-panel__send-btn" onClick={handleSend}>Enviar</button>
                </div>
            </div>
        </div>
    )
}

export default PrivateChatPanel