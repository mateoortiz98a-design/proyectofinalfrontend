import React, { useState } from 'react'
import './ChatPanel.css'

const ChatPanel = ({
    selectedChat,
    messages,
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

    if (!selectedChat) {
        return (
            <div className="chat-panel">
                <div className="chat-panel__placeholder">
                    <span className="chat-panel__placeholder-icon">💬</span>
                    <p>Seleccioná un canal para empezar a chatear</p>
                </div>
            </div>
        )
    }

    return (
        <div className="chat-panel">
            <div className="chat-panel__header">
                <h2># {selectedChat.nombre}</h2>
            </div>

            <div className="chat-panel__messages">
                {messages.length === 0
                    ? <p className="chat-panel__empty">No hay mensajes aún. ¡Sé el primero en escribir!</p>
                    : messages.map(msg => (
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

            <div className="chat-panel__input-area">
                <div className="chat-panel__input-row">
                    <input
                        className="chat-panel__input"
                        placeholder={`Mensaje en #${selectedChat.nombre}`}
                        value={nuevoMensaje}
                        onChange={e => setNuevoMensaje(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSend()}
                    />
                    <button className="chat-panel__send-btn" onClick={handleSend}>Enviar</button>
                </div>
            </div>
        </div>
    )
}

export default ChatPanel