import React, { useState } from 'react'
import useForm from '../../hooks/useForm'
import './Sidebar.css'

const Sidebar = ({
    workspaces,
    selectedWorkspace,
    onSelectWorkspace,
    onCreateWorkspace,
    onDeleteWorkspace,
    onEditWorkspace,
    chats,
    selectedChat,
    onSelectChat,
    onCreateChat,
    onDeleteChat,
    privateChats,
    selectedPrivateChat,
    onSelectPrivateChat,
    onDeletePrivateChat,
    onShowMembers,
    onShowContacts,
    pendingRequests,
    onLogout
}) => {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [editandoWorkspace, setEditandoWorkspace] = useState(null)
    const [textoEditWorkspace, setTextoEditWorkspace] = useState('')

    const { formState: wsForm, handleChange: handleWsChange, handleSubmit: handleWsSubmit } = useForm(
        { nombre: '' },
        (data) => { if (data.nombre.trim()) { onCreateWorkspace(data.nombre); wsForm.nombre = '' } }
    )

    const { formState: chatForm, handleChange: handleChatChange, handleSubmit: handleChatSubmit } = useForm(
        { nombre: '' },
        (data) => { if (data.nombre.trim()) { onCreateChat(data.nombre); chatForm.nombre = '' } }
    )

    const handleEditarWorkspace = (ws) => {
        onEditWorkspace(ws, textoEditWorkspace)
        setEditandoWorkspace(null)
        setTextoEditWorkspace('')
    }

    const closeSidebar = () => setSidebarOpen(false)

    return (
        <>
            <button className="sidebar__toggle" onClick={() => setSidebarOpen(true)}>☰</button>

            {sidebarOpen && <div className="sidebar__overlay" onClick={closeSidebar} />}

            <aside className={`sidebar ${sidebarOpen ? 'sidebar--open' : ''}`}>

                {/* Header */}
                <div className="sidebar__header">
                    <h2 className="sidebar__title">💬 MiSlack</h2>
                    <button className="sidebar__logout" onClick={onLogout}>Salir</button>
                </div>

                {/* Workspaces */}
                <div className="sidebar__section">
                    <p className="sidebar__section-title">Workspaces</p>

                    {workspaces.map(ws => (
                        <div key={ws.workspace_id} style={{ marginBottom: '2px' }}>
                            {editandoWorkspace === ws.workspace_id ? (
                                <div className="sidebar__edit-row">
                                    <input
                                        className="sidebar__edit-input"
                                        value={textoEditWorkspace}
                                        onChange={e => setTextoEditWorkspace(e.target.value)}
                                    />
                                    <button className="sidebar__icon-btn" onClick={() => handleEditarWorkspace(ws)}>✅</button>
                                    <button className="sidebar__icon-btn" onClick={() => setEditandoWorkspace(null)}>❌</button>
                                </div>
                            ) : (
                                <div className={`sidebar__item ${selectedWorkspace?.workspace_id === ws.workspace_id ? 'sidebar__item--active' : ''}`}>
                                    <span className="sidebar__item-name" onClick={() => { onSelectWorkspace(ws); closeSidebar() }}>
                                        🏢 {ws.workspace_nombre}
                                    </span>
                                    <div className="sidebar__item-actions">
                                        <button className="sidebar__icon-btn" onClick={() => { setEditandoWorkspace(ws.workspace_id); setTextoEditWorkspace(ws.workspace_nombre) }}>✏️</button>
                                        <button className="sidebar__icon-btn" onClick={() => onDeleteWorkspace(ws.workspace_id)}>🗑️</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}

                    <form onSubmit={handleWsSubmit} className="sidebar__new-row">
                        <input
                            className="sidebar__input"
                            placeholder="Nuevo workspace..."
                            name="nombre"
                            value={wsForm.nombre}
                            onChange={handleWsChange}
                        />
                        <button type="submit" className="sidebar__btn">+ Crear workspace</button>
                    </form>
                </div>

                {/* Canales */}
                {selectedWorkspace && (
                    <div className="sidebar__section">
                        <p className="sidebar__section-title"># Canales</p>

                        {chats.map(chat => (
                            <div
                                key={chat._id}
                                className={`sidebar__item ${selectedChat?._id === chat._id ? 'sidebar__item--active' : ''}`}
                            >
                                <span className="sidebar__item-name" onClick={() => { onSelectChat(chat); closeSidebar() }}>
                                    # {chat.nombre}
                                </span>
                                <div className="sidebar__item-actions">
                                    <button className="sidebar__icon-btn" onClick={() => onDeleteChat(chat._id)}>🗑️</button>
                                </div>
                            </div>
                        ))}

                        <form onSubmit={handleChatSubmit} className="sidebar__new-row">
                            <input
                                className="sidebar__input"
                                placeholder="Nuevo canal..."
                                name="nombre"
                                value={chatForm.nombre}
                                onChange={handleChatChange}
                            />
                            <button type="submit" className="sidebar__btn">+ Crear canal</button>
                        </form>

                        <button className="sidebar__btn" style={{ marginTop: '8px' }} onClick={() => { onShowMembers(); closeSidebar() }}>
                            👥 Miembros
                        </button>
                    </div>
                )}

                {/* Mensajes directos */}
                <div className="sidebar__section">
                    <p className="sidebar__section-title">@ Mensajes directos</p>
                    {privateChats.length === 0 && <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', margin: '4px 0' }}>Sin chats aún</p>}
                    {privateChats.map(chat => (
                        <div
                            key={chat._id}
                            className={`sidebar__item ${selectedPrivateChat?._id === chat._id ? 'sidebar__item--active' : ''}`}
                        >
                            <span className="sidebar__item-name" onClick={() => { onSelectPrivateChat(chat); closeSidebar() }}>
                                @ {chat.fk_user1_id?.name || chat.fk_user2_id?.name}
                            </span>
                            <div className="sidebar__item-actions">
                                <button className="sidebar__icon-btn" onClick={() => onDeletePrivateChat(chat._id)}>🗑️</button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Contactos */}
                <div className="sidebar__section">
                    <button className="sidebar__btn sidebar__btn--contacts" onClick={() => { onShowContacts(); closeSidebar() }}>
                        <span>📋 Contactos</span>
                        {pendingRequests.length > 0 && <span className="sidebar__badge">{pendingRequests.length}</span>}
                    </button>
                </div>

            </aside>
        </>
    )
}

export default Sidebar