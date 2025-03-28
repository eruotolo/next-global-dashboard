import AuthAdapter from '@/lib/auth/authAdapter';
import prisma from '@/dbprisma/db';
import bcrypt from 'bcrypt';
import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import NextAuth from 'next-auth';

// Definimos un tipo simple para el usuario personalizado
import type { CustomUser } from '@/tipos/Login/CustomUser';

// Configuración de opciones para NextAuth
const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: {
                    label: 'Email',
                    type: 'text',
                    placeholder: 'ejemplo@ejemplo.com',
                },
                password: {
                    label: 'Password',
                    type: 'password',
                    placeholder: '*************',
                },
            },
            async authorize(credentials, _req) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Email and password are required');
                }

                // Busca al usuario en la base de datos usando Prisma
                const userFound = await prisma.user.findUnique({
                    where: { email: credentials.email },
                    include: {
                        roles: {
                            include: {
                                role: true,
                            },
                        },
                    },
                });

                if (!userFound) {
                    throw new Error('No users found');
                }

                // Valida la contraseña
                const matchPassword = await bcrypt.compare(
                    credentials.password,
                    userFound.password,
                );

                if (!matchPassword) {
                    throw new Error('Wrong Password');
                }

                // Verifica que el usuario tenga roles asociados
                if (!userFound.roles || userFound.roles.length === 0) {
                    throw new Error('El usuario no tiene roles asignados');
                }

                // Extrae los roles asociados como un array de strings
                const roles = userFound.roles.map((userRole) => userRole.role?.name || '');

                return {
                    id: userFound.id,
                    email: userFound.email,
                    name: userFound.name,
                    lastName: userFound.lastName,
                    phone: userFound.phone || undefined,
                    address: userFound.address || undefined,
                    city: userFound.city || undefined,
                    image: userFound.image || undefined,
                    state: userFound.state || null,
                    roles, // Roles asignados al usuario
                } as CustomUser;
            },
        }),
    ],

    pages: {
        signIn: '/login',
    },

    secret: process.env.NEXTAUTH_SECRET,

    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60, // 30 días
    },

    callbacks: {
        async session({ session, token }) {
            try {
                const { getUserById } = AuthAdapter(); // Inicializa el adaptador

                // Obtener la información más reciente del usuario
                const freshUserData = await getUserById(token.id as string);

                session.user = {
                    ...session.user,
                    id: token.id as string,
                    name: token.name as string,
                    lastName: token.lastName as string,
                    email: token.email as string,
                    phone: token.phone as string,
                    address: token.address as string,
                    city: token.city as string,
                    image: token.image as string,
                    state: token.state as number | null,
                    ...freshUserData,
                    roles: token.roles as string[],
                };
                return session;
            } catch (error) {
                console.error('Error actualizando la sesión:', error);
                return session; // O `return null;` para invalidar la sesión
            }
        },
        async jwt({ token, user }) {
            if (user) {
                const customUser = user as CustomUser;

                token.id = customUser.id;
                token.name = customUser.name;
                token.lastName = customUser.lastName;
                token.email = customUser.email;
                token.phone = customUser.phone;
                token.address = customUser.address;
                token.city = customUser.city;
                token.image = customUser.image;
                token.state = customUser.state;
                token.roles = customUser.roles;
            }
            //console.log(token);
            return token;
        },
    },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
