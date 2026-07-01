import React, { useState } from 'react'
import './PrivateChatPanel.css'

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

    const nombreContacto = selectedPrivateChat?.fk_user1_id?.name || selectedPrivateChat?.fk_user2_id?.name || '?'
    const inicial = nombreContacto.charAt(0).toUpperCase()

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
                    : privateMessages.map(msg => (
                        <div key={msg._id} className="message-bubble">
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
                                    <div className="message-bubble__actions">
                                        <button className="message-bubble__btn" onClick={() => { setEditandoMensaje(msg._id); setTextoEdit(msg.mensaje) }}>✏️</button>
                                        <button className="message-bubble__btn" onClick={() => onDeleteMessage(msg._id)}>🗑️</button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))
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