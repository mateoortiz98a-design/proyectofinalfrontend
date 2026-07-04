# MiSlack - Frontend

Aplicación web de mensajería en tiempo real tipo Slack, construida con React + Vite.

## Tecnologías

- React 18
- Vite
- React Router
- Socket.io Client
- CSS Modules

## Instalación local

1. Cloná el repositorio:
```bash
git clone https://github.com/mateoortiz98a-design/proyectofinalfrontend.git
cd proyectofinalfrontend
```

2. Instalá las dependencias:
```bash
npm install
```

3. Creá el archivo `.env` en la raíz:
```env
VITE_API_URL=http://localhost:8080
```

4. Iniciá la aplicación:
```bash
npm run dev
```

## URL de producción

https://proyectofinalfrontend-eight.vercel.app

## Credenciales de prueba

MAIL:mateoortiz1998a@gmail.com
password:666666

mail: mateoortiz98a@gmail.com
password:666666

## Funcionalidades

- ✅ Registro y login con verificación de email  : estoy teniendo un error de render con el mail en local andababa todo
- ✅ Recuperación de contraseña
- ✅ Workspaces (crear, editar, eliminar)
- ✅ Canales de grupo (crear, eliminar)
- ✅ Mensajes en tiempo real (enviar, editar, eliminar)
- ✅ Chats privados entre usuarios
- ✅ Contactos (solicitar, aceptar, rechazar)
- ✅ Invitaciones a workspace en tiempo real
- ✅ Perfil de usuario y eliminación de cuenta
- ✅ Responsive (mobile, tablet, desktop)

## Estructura del proyecto
 
 src/
├── components/
│   ├── Sidebar/
│   ├── ChatPanel/
│   ├── PrivateChatPanel/
│   ├── MemberPanel/
│   ├── ContactPanel/
│   └── NotificationPanel/
├── Screens/
│   ├── LoginScreen/
│   ├── RegisterScreen/
│   ├── HomeScreen/
│   ├── ProfileScreen/
│   ├── ForgotPasswordScreen/
│   └── ResetPasswordScreen/
├── services/
│   ├── authService.js
│   ├── workspaceService.js
│   ├── chatService.js
│   ├── messageService.js
│   ├── memberService.js
│   ├── contactService.js
│   ├── privateChatService.js
│   ├── userService.js
│   └── socketService.js
├── hooks/
│   └── useForm.js
└── config.js
