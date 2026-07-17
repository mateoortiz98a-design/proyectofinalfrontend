import BASE_URL from '../../config.js'
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { getWorkspaces, createWorkspace, deleteWorkspace, updateWorkspace } from '../../services/workspaceService'
import { getChatsByWorkspace, createChat, deleteChat } from '../../services/chatService'
import { getMessages, sendMessage, deleteMessage, updateMessage } from '../../services/messageService'
import { getMembers, inviteUser, removeMember, updateMemberRole, getPendingInvitations, leaveWorkspace } from '../../services/memberService'
import { getContacts, getPendingRequests, sendContactRequest, respondRequest, deleteContact } from '../../services/contactService'
import { getMyPrivateChats, createPrivateChat, deletePrivateChat, getPrivateMessages, sendPrivateMessage, deletePrivateMessage, updatePrivateMessage } from '../../services/privateChatService'
import { logout } from '../../services/authService'
import socket from '../../services/socketService'
import Sidebar from '../../components/Sidebar/Sidebar'
import ChatPanel from '../../components/ChatPanel/ChatPanel'
import PrivateChatPanel from '../../components/PrivateChatPanel/PrivateChatPanel'
import MemberPanel from '../../components/MemberPanel/MemberPanel'
import ContactPanel from '../../components/ContactPanel/ContactPanel'
import './HomeScreen.css'

function getUserFromToken() {
    const token = localStorage.getItem('access_token')
    if (!token) return null
    const payload = token.split('.')[1]
    return JSON.parse(atob(payload))
}

export const HomeScreen = () => {

    const navigate = useNavigate()
    const [notifications, setNotifications] = useState([])
    const [workspaces, setWorkspaces] = useState([])
    const [selectedWorkspace, setSelectedWorkspace] = useState(null)
    const [chats, setChats] = useState([])
    const [selectedChat, setSelectedChat] = useState(null)
    const [messages, setMessages] = useState([])
    const [members, setMembers] = useState([])
    const [contacts, setContacts] = useState([])
    const [pendingRequests, setPendingRequests] = useState([])
    const [privateChats, setPrivateChats] = useState([])
    const [selectedPrivateChat, setSelectedPrivateChat] = useState(null)
    const [privateMessages, setPrivateMessages] = useState([])
    const [showMembers, setShowMembers] = useState(false)
    const [showContacts, setShowContacts] = useState(false)

    // Socket — usuario y contactos
    useEffect(() => {
        const currentUser = getUserFromToken()
        if (currentUser) {
            socket.emit('join_user', currentUser.id)
        }
        socket.on('new_contact_request', () => cargarContactos())
        socket.on('contact_request_response', () => cargarContactos())
        socket.on('workspace_invitation', (invitation) => {
            setNotifications(prev =>
                prev.some(n => n.member_id === invitation.member_id) ? prev : [...prev, invitation]
            )
        })
        return () => {
            socket.off('new_contact_request')
            socket.off('contact_request_response')
            socket.off('workspace_invitation')
        }
    }, [])


    // Socket — chat de grupo
    useEffect(() => {
        if (selectedChat) {
            socket.emit('join_chat', selectedChat._id)
            socket.on('new_message', (msg) => setMessages(prev => [...prev, msg]))
            socket.on('updated_message', (msg) => setMessages(prev => prev.map(m => m._id === msg._id ? msg : m)))
            socket.on('deleted_message', ({ message_id }) => setMessages(prev => prev.filter(m => m._id !== message_id)))
            return () => {
                socket.off('new_message')
                socket.off('updated_message')
                socket.off('deleted_message')
            }
        }
    }, [selectedChat])

    // Socket — chat privado
    useEffect(() => {
        if (selectedPrivateChat) {
            socket.emit('join_private_chat', selectedPrivateChat._id)
            socket.on('new_private_message', (msg) => setPrivateMessages(prev => [...prev, msg]))
            socket.on('updated_private_message', (msg) => setPrivateMessages(prev => prev.map(m => m._id === msg._id ? msg : m)))
            socket.on('deleted_private_message', ({ message_id }) => setPrivateMessages(prev => prev.filter(m => m._id !== message_id)))
            return () => {
                socket.off('new_private_message')
                socket.off('updated_private_message')
                socket.off('deleted_private_message')
            }
        }
    }, [selectedPrivateChat])

    useEffect(() => {
        cargarWorkspaces()
        cargarContactos()
        cargarChatsPrivados()
        cargarInvitacionesPendientes()
    }, [])

    useEffect(() => {
        if (selectedWorkspace) {
            cargarChats(selectedWorkspace.workspace_id)
            cargarMiembros(selectedWorkspace.workspace_id)
            setSelectedChat(null)
            setMessages([])
            setShowMembers(false)
            setShowContacts(false)
            setSelectedPrivateChat(null)
        }
    }, [selectedWorkspace])

    useEffect(() => {
        if (selectedChat) cargarMensajes(selectedChat._id)
    }, [selectedChat])

    useEffect(() => {
        if (selectedPrivateChat) cargarMensajesPrivados(selectedPrivateChat._id)
    }, [selectedPrivateChat])


    async function handleAceptarInvitacion(notif) {
        const response = await fetch(
            `${BASE_URL}/api/workspace/${notif.workspace_id}/invite/ACEPTADO?invitation_token=${notif.invitation_token}`
        )
        if (response.ok) {
            setNotifications(prev => prev.filter(n => n.member_id !== notif.member_id))
            cargarWorkspaces()
        }
    }

    async function handleRechazarInvitacion(notif) {
        await fetch(
            `${BASE_URL}/api/workspace/${notif.workspace_id}/invite/RECHAZADO?invitation_token=${notif.invitation_token}`
        )
        setNotifications(prev => prev.filter(n => n.member_id !== notif.member_id))
    }
    async function cargarWorkspaces() {
        const response = await getWorkspaces()
        if (response.ok) setWorkspaces(response.data.workspaces)
    }

    async function cargarChats(workspace_id) {
        const response = await getChatsByWorkspace(workspace_id)
        if (response.ok) setChats(response.chats)
    }

    async function cargarMensajes(chat_id) {
        const response = await getMessages(chat_id)
        if (response.ok) setMessages(response.messages)
    }

    async function cargarMiembros(workspace_id) {
        const response = await getMembers(workspace_id)
        if (response.ok) setMembers(response.data.members)
    }

    async function cargarContactos() {
        const response = await getContacts()
        if (response.ok && response.data?.contacts) {
            // Filtrar para ignorar contactos rotos donde fk_sender_id venga null
            const contactosValidos = response.data.contacts.filter(
                c => c.fk_sender_id !== null && c.fk_sender_id !== undefined
            )
            setContacts(contactosValidos)
        }
        const pending = await getPendingRequests()
        if (pending.ok && pending.data?.requests) {
            // Hacemos lo mismo con las solicitudes pendientes
            const solicitudesValidas = pending.data.requests.filter(
                r => r.fk_sender_id !== null && r.fk_sender_id !== undefined
            )
            setPendingRequests(solicitudesValidas)
        }
    }

    async function cargarInvitacionesPendientes() {
        const response = await getPendingInvitations()
        if (response.ok && response.data?.invitations) {
            setNotifications(prev => {
                const idsExistentes = new Set(prev.map(n => n.member_id))
                const nuevas = response.data.invitations.filter(inv => !idsExistentes.has(inv.member_id))
                return [...prev, ...nuevas]
            })
        }
    }

    async function cargarChatsPrivados() {
        const response = await getMyPrivateChats()
        if (response.ok) setPrivateChats(response.chats)
    }

    async function cargarMensajesPrivados(chat_id) {
        const response = await getPrivateMessages(chat_id)
        if (response.ok) setPrivateMessages(response.messages)
    }

    // Workspace handlers
    async function handleCrearWorkspace(nombre) {
        const response = await createWorkspace(nombre)
        if (response.ok) cargarWorkspaces()
    }

    async function handleEliminarWorkspace(workspace_id) {
        const response = await deleteWorkspace(workspace_id)
        if (response.ok) {
            if (selectedWorkspace?.workspace_id === workspace_id) {
                setSelectedWorkspace(null); setChats([]); setMessages([])
            }
            cargarWorkspaces()
        }
    }

    async function handleEditarWorkspace(ws, nuevoNombre) {
        const response = await updateWorkspace(ws.workspace_id, nuevoNombre)
        if (response.ok) cargarWorkspaces()
    }

    async function handleSalirWorkspace(workspace_id) {
        const response = await leaveWorkspace(workspace_id)
        if (response.ok) {
            if (selectedWorkspace?.workspace_id === workspace_id) {
                setSelectedWorkspace(null); setChats([]); setMessages([])
            }
            cargarWorkspaces()
        } else {
            alert(response.message || 'No se pudo salir del espacio de trabajo')
        }
    }

    // Chat handlers
    async function handleCrearChat(nombre) {
        const response = await createChat(selectedWorkspace.workspace_id, nombre)
        if (response.ok) cargarChats(selectedWorkspace.workspace_id)
    }

    async function handleEliminarChat(chat_id) {
        const response = await deleteChat(chat_id)
        if (response.ok) {
            if (selectedChat?._id === chat_id) { setSelectedChat(null); setMessages([]) }
            cargarChats(selectedWorkspace.workspace_id)
        }
    }

    // Message handlers
    async function handleEnviarMensaje(mensaje) {
        const response = await sendMessage(selectedChat._id, mensaje)
        if (response.ok) cargarMensajes(selectedChat._id)
    }

    async function handleEliminarMensaje(message_id) {
        const response = await deleteMessage(message_id)
        if (response.ok) cargarMensajes(selectedChat._id)
    }

    async function handleEditarMensaje(message_id, texto) {
        const response = await updateMessage(message_id, texto)
        if (response.ok) cargarMensajes(selectedChat._id)
    }

    // Member handlers
    async function handleInvitarUsuario(email, rol) {
        const response = await inviteUser(selectedWorkspace.workspace_id, email, rol)
        if (response.ok) alert('Invitación enviada!')
        else alert(response.message)
    }

    async function handleEliminarMiembro(member_id) {
        const response = await removeMember(selectedWorkspace.workspace_id, member_id)
        if (response.ok) cargarMiembros(selectedWorkspace.workspace_id)
    }

    async function handleCambiarRol(member_id, nuevoRol) {
        const response = await updateMemberRole(selectedWorkspace.workspace_id, member_id, nuevoRol)
        if (response.ok) cargarMiembros(selectedWorkspace.workspace_id)
    }

    // Contact handlers
    async function handleEnviarSolicitud(email) {
        const response = await sendContactRequest(email)
        if (response.ok) alert('Solicitud enviada!')
        else alert(response.message)
    }

    async function handleResponderSolicitud(contact_id, decision) {
        const response = await respondRequest(contact_id, decision)
        if (response.ok) cargarContactos()
    }

    async function handleEliminarContacto(contact_id) {
        const response = await deleteContact(contact_id)
        if (response.ok) cargarContactos()
    }

    async function handleIniciarChatPrivado(user_id) {
        const response = await createPrivateChat(user_id)
        if (response.ok) {
            const listado = await getMyPrivateChats()
            if (listado.ok) {
                setPrivateChats(listado.chats)
                // Buscamos la versión ya populada (con el nombre del contacto) en vez del objeto crudo de la creación
                const chatPoblado = listado.chats.find(c => c._id === response.chat._id) || response.chat
                setSelectedPrivateChat(chatPoblado)
            } else {
                setSelectedPrivateChat(response.chat)
            }
            setShowContacts(false)
            setShowMembers(false)
            setSelectedChat(null)
        } else {
            alert(response.message)
        }
    }

    // Private chat handlers
    async function handleEliminarChatPrivado(chat_id) {
        try {
            const response = await deletePrivateChat(chat_id)
            if (response.ok) {
                if (selectedPrivateChat?._id === chat_id) { setSelectedPrivateChat(null); setPrivateMessages([]) }
                cargarChatsPrivados()
            } else {
                alert(response.message || 'No se pudo eliminar el chat')
            }
        } catch {
            alert('Error al conectar con el servidor')
        }
    }

    async function handleEnviarMensajePrivado(mensaje) {
        const response = await sendPrivateMessage(selectedPrivateChat._id, mensaje)
        if (response.ok) cargarMensajesPrivados(selectedPrivateChat._id)
    }

    async function handleEliminarMensajePrivado(message_id) {
        const response = await deletePrivateMessage(message_id)
        if (response.ok) cargarMensajesPrivados(selectedPrivateChat._id)
    }

    async function handleEditarMensajePrivado(message_id, texto) {
        const response = await updatePrivateMessage(message_id, texto)
        if (response.ok) cargarMensajesPrivados(selectedPrivateChat._id)
    }

    function handleLogout() {
        logout()
        navigate('/login')
    }

    function handleGoToProfile() {
        navigate('/profile')
    }

    const renderMain = () => {
        if (showContacts) {
            return (
                <ContactPanel
                    contacts={contacts}
                    pendingRequests={pendingRequests}
                    onSendRequest={handleEnviarSolicitud}
                    onRespond={handleResponderSolicitud}
                    onDelete={handleEliminarContacto}
                    onStartChat={handleIniciarChatPrivado}
                />
            )
        }

        if (showMembers && selectedWorkspace) {
            return (
                <MemberPanel
                    selectedWorkspace={selectedWorkspace}
                    members={members}
                    onInvite={handleInvitarUsuario}
                    onRemove={handleEliminarMiembro}
                    onChangeRole={handleCambiarRol}
                />
            )
        }

        if (selectedPrivateChat) {
            return (
                <PrivateChatPanel
                    selectedPrivateChat={selectedPrivateChat}
                    privateMessages={privateMessages}
                    onSendMessage={handleEnviarMensajePrivado}
                    onDeleteMessage={handleEliminarMensajePrivado}
                    onEditMessage={handleEditarMensajePrivado}
                />
            )
        }

        if (selectedChat) {
            return (
                <ChatPanel
                    selectedChat={selectedChat}
                    messages={messages}
                    onSendMessage={handleEnviarMensaje}
                    onDeleteMessage={handleEliminarMensaje}
                    onEditMessage={handleEditarMensaje}
                />
            )
        }

        return (
            <div className="home-screen__placeholder">
                <span className="home-screen__placeholder-icon">👋</span>
                <h3>{selectedWorkspace ? `Bienvenido a ${selectedWorkspace.workspace_nombre}` : 'Bienvenido'}</h3>
                <p>{selectedWorkspace ? 'Seleccioná un canal o iniciá un chat directo' : 'Seleccioná un workspace para comenzar'}</p>
            </div>
        )
    }

    return (
        <div className="home-screen">

            <Sidebar
                workspaces={workspaces}
                selectedWorkspace={selectedWorkspace}
                onSelectWorkspace={(ws) => {
                    setSelectedWorkspace(ws)
                    setShowContacts(false)
                    setShowMembers(false)
                }}
                onCreateWorkspace={handleCrearWorkspace}
                onDeleteWorkspace={handleEliminarWorkspace}
                onEditWorkspace={handleEditarWorkspace}
                onLeaveWorkspace={handleSalirWorkspace}
                chats={chats}
                selectedChat={selectedChat}
                onSelectChat={(chat) => {
                    setSelectedChat(chat)
                    setShowMembers(false)
                    setShowContacts(false)
                    setSelectedPrivateChat(null)
                }}
                onCreateChat={handleCrearChat}
                onDeleteChat={handleEliminarChat}
                privateChats={privateChats}
                selectedPrivateChat={selectedPrivateChat}
                onSelectPrivateChat={(chat) => {
                    setSelectedPrivateChat(chat)
                    setShowContacts(false)
                    setShowMembers(false)
                    setSelectedChat(null)
                }}
                onDeletePrivateChat={handleEliminarChatPrivado}
                onShowMembers={() => {
                    setShowMembers(true)
                    setShowContacts(false)
                    setSelectedChat(null)
                    setSelectedPrivateChat(null)
                }}
                onShowContacts={() => {
                    setShowContacts(true)
                    setShowMembers(false)
                    setSelectedChat(null)
                    setSelectedPrivateChat(null)
                }}
                pendingRequests={pendingRequests}
                onLogout={handleLogout}
                onGoToProfile={handleGoToProfile}
                notifications={notifications}
                onAcceptNotification={handleAceptarInvitacion}
                onRejectNotification={handleRechazarInvitacion}
                showContacts={showContacts}
                showMembers={showMembers}
            />

            <main className="home-screen__main">
                {renderMain()}
            </main>

        </div>
    )
}

export default HomeScreen