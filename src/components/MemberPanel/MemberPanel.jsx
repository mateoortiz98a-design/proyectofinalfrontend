import React from 'react'
import useForm from '../../hooks/useForm'
import './MemberPanel.css'

const MemberPanel = ({
    selectedWorkspace,
    members,
    onInvite,
    onRemove,
    onChangeRole
}) => {
    const { formState, handleChange, handleSubmit } = useForm(
        { email: '', rol: 'usuario' },
        (data) => {
            if (data.email.trim()) {
                onInvite(data.email, data.rol)
                formState.email = ''
            }
        }
    )

    return (
        <div className="member-panel">
            <div className="member-panel__header">
                <h2>👥 Miembros de {selectedWorkspace?.workspace_nombre}</h2>
                <p>{members.length} miembro{members.length !== 1 ? 's' : ''}</p>
            </div>

            <form onSubmit={handleSubmit} className="member-panel__invite">
                <input
                    className="member-panel__invite-input"
                    placeholder="Email a invitar..."
                    name="email"
                    type="email"
                    value={formState.email}
                    onChange={handleChange}
                />
                <select
                    className="member-panel__invite-select"
                    name="rol"
                    value={formState.rol}
                    onChange={handleChange}
                >
                    <option value="usuario">Usuario</option>
                    <option value="admin">Admin</option>
                </select>
                <button type="submit" className="member-panel__invite-btn">Invitar</button>
            </form>

            <p className="member-panel__list-title">Miembros actuales</p>

            {members.map(member => {
                const nombre = member.user_nombre || member.user_email || 'Usuario'
                const inicial = nombre.charAt(0).toUpperCase()

                return (
                    <div key={member.member_id} className="member-card">
                        <div className="member-card__info">
                            <div className="member-card__avatar">{inicial}</div>
                            <div style={{ minWidth: 0 }}>
                                <p className="member-card__name">{nombre}</p>
                                <p className="member-card__email">{member.user_email}</p>
                            </div>
                        </div>
                        <div className="member-card__actions">
                            <select
                                className="member-card__select"
                                value={member.member_rol}
                                onChange={e => onChangeRole(member.member_id, e.target.value)}
                            >
                                <option value="usuario">Usuario</option>
                                <option value="admin">Admin</option>
                                <option value="dueño">Dueño</option>
                            </select>
                            <button
                                className="member-card__delete-btn"
                                onClick={() => onRemove(member.member_id)}
                            >
                                🗑️
                            </button>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default MemberPanel