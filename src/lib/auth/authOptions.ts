import bcrypt from 'bcrypt';
import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import prisma from '@/dbprisma/db';
import { logAuditEvent } from '@/lib/audit/auditLogger';
import { AUDIT_ACTIONS, AUDIT_ENTITIES } from '@/lib/audit/auditType';
import type { CustomUser } from '@/types/settings/Login/CustomUser';

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'text', placeholder: 'ejemplo@ejemplo.com' },
                password: { label: 'Password', type: 'password', placeholder: '*************' },
            },
            async authorize(credentials, _req) {
                if (!credentials?.email || !credentials?.password) {
                    // Registrar intento fallido de inicio de sesión (datos incompletos)
                    await logAuditEvent({
                        action: AUDIT_ACTIONS.LOGIN.FAILED,
                        entity: AUDIT_ENTITIES.USER,
                        description: 'Intento de inicio de sesión con datos incompletos',
                        metadata: { email: credentials?.email || 'no proporcionado' },
                    });
                    throw new Error('Email and password are required');
                }

                // Buscar usuario en la base de datos, incluyendo roles/permisos
                const userFound = await prisma.user.findUnique({
                    where: { email: credentials.email },
                    include: {
                        roles: {
                            include: {
                                role: {
                                    include: {
                                        permissionRole: {
                                            include: {
                                                permission: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                });

                if (!userFound) {
                    // Registrar intento fallido de inicio de sesión (usuario no encontrado)
                    await logAuditEvent({
                        action: AUDIT_ACTIONS.LOGIN.FAILED,
                        entity: AUDIT_ENTITIES.USER,
                        description: 'Intento de inicio de sesión con email no registrado',
                        metadata: { email: credentials.email },
                    });
                    throw new Error('No users found');
                }

                // Validar contraseña
                const matchPassword = await bcrypt.compare(
                    credentials.password,
                    userFound.password,
                );
                if (!matchPassword) {
                    // Registrar intento fallido de inicio de sesión (contraseña incorrecta)
                    await logAuditEvent({
                        action: AUDIT_ACTIONS.LOGIN.FAILED,
                        entity: AUDIT_ENTITIES.USER,
                        entityId: userFound.id,
                        description: 'Intento de inicio de sesión con contraseña incorrecta',
                        metadata: { email: credentials.email, userId: userFound.id },
                        userId: userFound.id,
                        userName: `${userFound.name} ${userFound.lastName || ''}`.trim(),
                    });
                    throw new Error('Wrong Password');
                }

                // Verificar que tenga roles
                if (!userFound.roles || userFound.roles.length === 0) {
                    // Registrar intento fallido de inicio de sesión (sin roles)
                    await logAuditEvent({
                        action: AUDIT_ACTIONS.LOGIN.FAILED,
                        entity: AUDIT_ENTITIES.USER,
                        entityId: userFound.id,
                        description: 'Intento de inicio de sesión de usuario sin roles asignados',
                        metadata: { email: credentials.email, userId: userFound.id },
                        userId: userFound.id,
                        userName: `${userFound.name} ${userFound.lastName || ''}`.trim(),
                    });
                    throw new Error('El usuario no tiene roles asignados');
                }

                // Obtener roles y permisos en arrays simples
                const roles = userFound.roles.map((userRole) => userRole.role?.name || '');
                const permissions = userFound.roles
                    .flatMap((userRole) =>
                        userRole.role?.permissionRole.map((pr) => pr.permission?.name || ''),
                    )
                    .filter(Boolean);

                // Registrar inicio de sesión exitoso
                await logAuditEvent({
                    action: AUDIT_ACTIONS.LOGIN.SUCCESS,
                    entity: AUDIT_ENTITIES.USER,
                    entityId: userFound.id,
                    description: 'Inicio de sesión exitoso',
                    metadata: {
                        email: userFound.email,
                        roles: roles,
                    },
                    userId: userFound.id,
                    userName: `${userFound.name} ${userFound.lastName || ''}`.trim(),
                });

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
                    roles,
                    permissions,
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
        updateAge: 24 * 60 * 60, // 24 horas
    },
    callbacks: {
        async session({ session, token }) {
            try {
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
                    roles: token.roles as string[],
                    permissions: token.permissions as string[],
                };
                return session;
            } catch (error) {
                console.error('Error actualizando la sesión:', error);
                return session;
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
                token.permissions = customUser.permissions;
            }
            return token;
        },
    },
    events: {
        async signOut({ token }) {
            if (token) {
                try {
                    await logAuditEvent({
                        action: AUDIT_ACTIONS.LOGIN.LOGOUT,
                        entity: AUDIT_ENTITIES.USER,
                        entityId: token.id as string,
                        description: 'Cierre de sesión',
                        userId: token.id as string,
                        userName: `${token.name} ${token.lastName || ''}`.trim(),
                    });
                } catch (error) {
                    console.error('Error al registrar cierre de sesión:', error);
                }
            }
        },
    },
};
