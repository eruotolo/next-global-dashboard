import AuthAdapter from '@/lib/auth/authAdapter';
import prisma from '@/dbprisma/db';
import bcrypt from 'bcrypt';
import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import NextAuth from 'next-auth';

// Tipo personalizado para el usuario
import type { CustomUser } from '@/tipos/Login/CustomUser';

// Configuración de opciones para NextAuth
const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'text', placeholder: 'ejemplo@ejemplo.com' },
                password: { label: 'Password', type: 'password', placeholder: '*************' },
            },
            async authorize(credentials, _req) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Email and password are required');
                }

                // Busca al usuario en la base de datos con Prisma, incluyendo roles y permisos
                const userFound = await prisma.user.findUnique({
                    where: { email: credentials.email },
                    include: {
                        roles: {
                            include: {
                                role: {
                                    include: {
                                        permissionRole: {
                                            include: {
                                                permission: true, // Incluye los permisos asociados al rol
                                            },
                                        },
                                    },
                                },
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

                // Extrae los roles como un array de strings
                const roles = userFound.roles.map((userRole) => userRole.role?.name || '');

                // Extrae los permisos asociados a los roles
                const permissions = userFound.roles
                    .flatMap((userRole) =>
                        userRole.role?.permissionRole.map((pr) => pr.permission?.name || ''),
                    )
                    .filter(Boolean); // Filtra valores vacíos

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
                    permissions, // Permisos asociados a los roles
                } as CustomUser & { permissions: string[] };
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
                const { getUserById } = AuthAdapter();

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
                    permissions: token.permissions as string[], // Asegura que los permisos estén en la sesión
                };

                return session;
            } catch (error) {
                console.error('Error actualizando la sesión:', error);
                return session; // Devuelve la sesión incluso si falla la actualización
            }
        },
        async jwt({ token, user }) {
            if (user) {
                const customUser = user as CustomUser & { permissions: string[] };

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
                token.permissions = customUser.permissions; // Asegura que los permisos estén en el token
            }

            return token;
        },
    },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
