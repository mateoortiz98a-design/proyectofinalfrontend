import React, { useState } from 'react'
import useForm from '../../hooks/useForm'
import './Sidebar.css'

function getUserFromToken() {
    const token = localStorage.getItem('access_token')
    if (!token) return null
    const payload = token.split('.')[1]
    return JSON.parse(atob(payload))
}

const AVATAR_COLORS = ['#6c5ce7', '#00b894', '#0984e3', '#e17055', '#e84393', '#00cec9', '#fdcb6e']

function colorFromId(id) {
    const str = String(id || '')
    let sum = 0
    for (let i = 0; i < str.length; i++) sum += str.charCodeAt(i)
    return AVATAR_COLORS[sum % AVATAR_COLORS.length]
}

function initialsFromName(name = '') {
    const parts = name.trim().split(/\s+/)
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
    return (parts[0][0] + parts[1][0]).toUpperCase()
}

/* ---------------------------------- Iconos (SVG en línea, sin dependencias) ---------------------------------- */
const IconHome = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11.5 12 4l9 7.5" /><path d="M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9" /></svg>)
const IconMessage = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg>)
const IconContacts = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="9" cy="10" r="2" /><path d="M6 16c0-1.7 1.3-3 3-3s3 1.3 3 3" /><path d="M14 9h5" /><path d="M14 13h5" /></svg>)
const IconBell = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.7 21a1.99 1.99 0 0 1-3.4 0" /></svg>)
const IconPlus = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>)
const IconHash = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 9h16M4 15h16M10 3 8 21M16 3l-2 18" /></svg>)
const IconChevron = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>)
const IconEdit = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>)
const IconTrash = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2" /><path d="M19 6l-1 14a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1L5 6" /></svg>)
const IconUsers = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-1a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v1" /><circle cx="9" cy="7" r="3.2" /><path d="M22 21v-1a4 4 0 0 0-3-3.9" /><path d="M15.5 3.6a4 4 0 0 1 0 7.7" /></svg>)
const IconCheck = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>)
const IconX = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>)
const IconDots = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="6" r="0.6" /><circle cx="12" cy="12" r="0.6" /><circle cx="12" cy="18" r="0.6" /></svg>)

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
    onLogout,
    onGoToProfile,
    notifications = [],
    onAcceptNotification,
    onRejectNotification,
    showContacts = false,
    showMembers = false
}) => {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [editandoWorkspace, setEditandoWorkspace] = useState(null)
    const [textoEditWorkspace, setTextoEditWorkspace] = useState('')
    const [creandoWorkspace, setCreandoWorkspace] = useState(false)
    const [creandoCanal, setCreandoCanal] = useState(false)
    const [dmOpen, setDmOpen] = useState(false)
    const [notifOpen, setNotifOpen] = useState(false)
    const [userMenuOpen, setUserMenuOpen] = useState(false)

    const currentUser = getUserFromToken()

    const { formState: wsForm, handleChange: handleWsChange, handleSubmit: handleWsSubmit } = useForm(
        { nombre: '' },
        (data) => { if (data.nombre.trim()) { onCreateWorkspace(data.nombre); wsForm.nombre = ''; setCreandoWorkspace(false) } }
    )

    const { formState: chatForm, handleChange: handleChatChange, handleSubmit: handleChatSubmit } = useForm(
        { nombre: '' },
        (data) => { if (data.nombre.trim()) { onCreateChat(data.nombre); chatForm.nombre = ''; setCreandoCanal(false) } }
    )

    const handleEditarWorkspace = (ws) => {
        onEditWorkspace(ws, textoEditWorkspace)
        setEditandoWorkspace(null)
        setTextoEditWorkspace('')
    }

    const closeSidebar = () => setSidebarOpen(false)

    const irAInicio = () => {
        setDmOpen(false)
        setNotifOpen(false)
    }

    const resetFormulariosCanal = () => {
        setCreandoCanal(false)
        setEditandoWorkspace(null)
    }

    const toggleDm = () => {
        setDmOpen(o => !o)
        setNotifOpen(false)
    }

    const toggleNotif = () => {
        setNotifOpen(o => !o)
        setDmOpen(false)
    }

    const seleccionarWorkspace = (ws) => {
        setDmOpen(false)
        setNotifOpen(false)
        resetFormulariosCanal()
        onSelectWorkspace(ws)
        closeSidebar()
    }

    return (
        <>
            <button className="sidebar__toggle" onClick={() => setSidebarOpen(true)} aria-label="Abrir menú">☰</button>

            {sidebarOpen && <div className="sidebar__overlay" onClick={closeSidebar} />}

            <aside className={`sidebar ${sidebarOpen ? 'sidebar--open' : ''}`}>

                {/* Header */}
                <div className="sidebar__header">
                    <div className="sidebar__logo">M</div>
                    <h2 className="sidebar__title">MiSlack</h2>
                </div>

                {/* Navegación principal */}
                <nav className="sidebar__nav">
                    <button className={`sidebar__nav-item ${!dmOpen && !notifOpen && !showContacts ? 'sidebar__nav-item--active' : ''}`} onClick={irAInicio}>
                        <span className="sidebar__nav-icon"><IconHome /></span>
                        Inicio
                    </button>

                    <button className={`sidebar__nav-item ${dmOpen ? 'sidebar__nav-item--active' : ''}`} onClick={toggleDm}>
                        <span className="sidebar__nav-icon"><IconMessage /></span>
                        Mensajes directos
                        <span className={`sidebar__nav-chevron ${dmOpen ? 'sidebar__nav-chevron--open' : ''}`}><IconChevron /></span>
                    </button>

                    {dmOpen && (
                        <div className="sidebar__nested">
                            {privateChats.length === 0 && <p className="sidebar__empty-hint">Sin chats aún</p>}
                            {privateChats.map(chat => {
                                const nombreContacto = currentUser?.email === chat.fk_user_id?.email
                                    ? chat.fk_user_id2?.name || 'Usuario eliminado'
                                    : chat.fk_user_id?.name || 'Usuario eliminado'

                                return (
                                    <div key={chat._id} className={`sidebar__item ${selectedPrivateChat?._id === chat._id ? 'sidebar__item--active' : ''}`}>
                                        <span className="sidebar__item-avatar" style={{ backgroundColor: colorFromId(chat._id) }}>
                                            {initialsFromName(nombreContacto)}
                                        </span>
                                        <span className="sidebar__item-name" onClick={() => { onSelectPrivateChat(chat); closeSidebar() }}>
                                            {nombreContacto}
                                        </span>
                                        <div className="sidebar__item-actions">
                                            <button className="sidebar__icon-btn" onClick={() => onDeletePrivateChat(chat._id)}><IconTrash /></button>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}

                    <button className={`sidebar__nav-item ${showContacts ? 'sidebar__nav-item--active' : ''}`} onClick={() => { onShowContacts(); closeSidebar() }}>
                        <span className="sidebar__nav-icon"><IconContacts /></span>
                        Contactos
                        {pendingRequests.length > 0 && <span className="sidebar__badge">{pendingRequests.length}</span>}
                    </button>

                    <button className={`sidebar__nav-item ${notifOpen ? 'sidebar__nav-item--active' : ''}`} onClick={toggleNotif}>
                        <span className="sidebar__nav-icon"><IconBell /></span>
                        Notificaciones
                        {notifications.length > 0 && <span className="sidebar__badge">{notifications.length}</span>}
                        <span className={`sidebar__nav-chevron ${notifOpen ? 'sidebar__nav-chevron--open' : ''}`}><IconChevron /></span>
                    </button>

                    {notifOpen && (
                        <div className="sidebar__nested">
                            {notifications.length === 0 && <p className="sidebar__empty-hint">No tenés notificaciones</p>}
                            {notifications.map((notif, index) => (
                                <div key={index} className="sidebar__notif-card">
                                    <p className="sidebar__notif-text">
                                        Invitación a <strong>{notif.workspace_nombre}</strong> como <strong>{notif.role}</strong>
                                    </p>
                                    <div className="sidebar__notif-actions">
                                        <button className="sidebar__notif-btn sidebar__notif-btn--accept" onClick={() => onAcceptNotification(notif)}>
                                            <IconCheck /> Aceptar
                                        </button>
                                        <button className="sidebar__notif-btn sidebar__notif-btn--reject" onClick={() => onRejectNotification(notif)}>
                                            <IconX /> Rechazar
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </nav>

                {/* Workspaces */}
                <div className="sidebar__section">
                    <div className="sidebar__section-header">
                        <p className="sidebar__section-title">Workspaces</p>
                        <button className="sidebar__section-add" onClick={() => setCreandoWorkspace(o => !o)} aria-label="Crear workspace">
                            <IconPlus />
                        </button>
                    </div>

                    {creandoWorkspace && (
                        <form onSubmit={handleWsSubmit} className="sidebar__new-row">
                            <input
                                className="sidebar__input"
                                placeholder="Nombre del workspace..."
                                name="nombre"
                                autoFocus
                                value={wsForm.nombre}
                                onChange={handleWsChange}
                            />
                            <button type="submit" className="sidebar__btn sidebar__btn--primary">Crear workspace</button>
                        </form>
                    )}

                    {workspaces.map(ws => {
                        const activo = selectedWorkspace?.workspace_id === ws.workspace_id
                        return (
                            <div key={ws.workspace_id} className="sidebar__ws-block">
                                {editandoWorkspace === ws.workspace_id ? (
                                    <div className="sidebar__edit-row">
                                        <input
                                            className="sidebar__edit-input"
                                            value={textoEditWorkspace}
                                            onChange={e => setTextoEditWorkspace(e.target.value)}
                                            autoFocus
                                        />
                                        <button className="sidebar__icon-btn" onClick={() => handleEditarWorkspace(ws)}><IconCheck /></button>
                                        <button className="sidebar__icon-btn" onClick={() => setEditandoWorkspace(null)}><IconX /></button>
                                    </div>
                                ) : (
                                    <div className={`sidebar__ws-row ${activo ? 'sidebar__ws-row--active' : ''}`}>
                                        <span className="sidebar__item-avatar" style={{ backgroundColor: colorFromId(ws.workspace_id) }}>
                                            {initialsFromName(ws.workspace_nombre)}
                                        </span>
                                        <span className="sidebar__item-name" onClick={() => seleccionarWorkspace(ws)}>
                                            {ws.workspace_nombre}
                                        </span>
                                        <div className="sidebar__item-actions">
                                            <button className="sidebar__icon-btn" onClick={() => { setEditandoWorkspace(ws.workspace_id); setTextoEditWorkspace(ws.workspace_nombre) }}><IconEdit /></button>
                                            <button className="sidebar__icon-btn" onClick={() => onDeleteWorkspace(ws.workspace_id)}><IconTrash /></button>
                                        </div>
                                        <span className={`sidebar__nav-chevron ${activo ? 'sidebar__nav-chevron--open' : ''}`} onClick={() => seleccionarWorkspace(ws)}>
                                            <IconChevron />
                                        </span>
                                    </div>
                                )}

                                {/* Canales anidados dentro del workspace activo */}
                                {activo && (
                                    <div className="sidebar__nested sidebar__nested--channels">
                                        {chats.map(chat => (
                                            <div key={chat._id} className={`sidebar__item ${selectedChat?._id === chat._id ? 'sidebar__item--active' : ''}`}>
                                                <span className="sidebar__hash"><IconHash /></span>
                                                <span className="sidebar__item-name" onClick={() => { onSelectChat(chat); closeSidebar() }}>
                                                    {chat.nombre}
                                                </span>
                                                <div className="sidebar__item-actions">
                                                    <button className="sidebar__icon-btn" onClick={() => onDeleteChat(chat._id)}><IconTrash /></button>
                                                </div>
                                            </div>
                                        ))}

                                        {creandoCanal ? (
                                            <form onSubmit={handleChatSubmit} className="sidebar__new-row">
                                                <input
                                                    className="sidebar__input"
                                                    placeholder="Nombre del canal..."
                                                    name="nombre"
                                                    autoFocus
                                                    value={chatForm.nombre}
                                                    onChange={handleChatChange}
                                                />
                                                <button type="submit" className="sidebar__btn sidebar__btn--primary">Crear canal</button>
                                            </form>
                                        ) : (
                                            <button className="sidebar__btn sidebar__btn--ghost" onClick={() => setCreandoCanal(true)}>
                                                <IconPlus /> Crear canal
                                            </button>
                                        )}

                                        <button className={`sidebar__btn sidebar__btn--ghost ${showMembers ? 'sidebar__btn--active' : ''}`} onClick={() => { onShowMembers(); closeSidebar() }}>
                                            <IconUsers /> Miembros
                                        </button>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>

                {/* Usuario / perfil */}
                <div className="sidebar__footer">
                    <button className="sidebar__user" onClick={() => setUserMenuOpen(o => !o)}>
                        <span className="sidebar__item-avatar" style={{ backgroundColor: colorFromId(currentUser?.id) }}>
                            {initialsFromName(currentUser?.name || '?')}
                        </span>
                        <span className="sidebar__user-info">
                            <span className="sidebar__user-name">{currentUser?.name || 'Usuario'}</span>
                            <span className="sidebar__user-status"><span className="sidebar__status-dot" /> En línea</span>
                        </span>
                        <span className="sidebar__nav-icon sidebar__user-dots"><IconDots /></span>
                    </button>

                    {userMenuOpen && (
                        <div className="sidebar__user-menu">
                            <button className="sidebar__user-menu-item" onClick={() => { setUserMenuOpen(false); onGoToProfile() }}>Ver perfil</button>
                            <button className="sidebar__user-menu-item sidebar__user-menu-item--danger" onClick={() => { setUserMenuOpen(false); onLogout() }}>Cerrar sesión</button>
                        </div>
                    )}
                </div>

            </aside>
        </>
    )
}

export default Sidebar
