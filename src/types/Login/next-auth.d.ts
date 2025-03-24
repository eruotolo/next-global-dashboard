import type { CustomUser } from './login/CustomUser'; // Importa tu tipo CustomUser

declare module 'next-auth' {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        user: CustomUser;
    }
}

// Tipado para JWT para cuando se use el token en las peticiones al servidor
declare module 'next-auth/jwt' {
    interface JWT extends CustomUser {}
}
