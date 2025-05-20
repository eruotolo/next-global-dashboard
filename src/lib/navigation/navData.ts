import {
    BookOpen,
    Bot,
    Frame,
    LifeBuoy,
    PieChart,
    Settings2,
    Shield,
    SquareTerminal,
} from 'lucide-react';

export const navData = {
    navMain: [
        {
            title: 'Playground',
            url: '#',
            icon: SquareTerminal,
            isActive: true,
            roles: [], // Sin restricciones
            items: [
                {
                    title: 'Dashboard',
                    url: '/admin/dashboard',
                    roles: [],
                },
                {
                    title: 'Starred',
                    url: '#',
                    roles: [],
                },
                {
                    title: 'Settings',
                    url: '#',
                    roles: [],
                },
            ],
        },
        {
            title: 'Models',
            url: '#',
            icon: Bot,
            roles: [],
            items: [
                {
                    title: 'Genesis',
                    url: '#',
                    roles: [],
                },
                {
                    title: 'Explorer',
                    url: '#',
                    roles: [],
                },
                {
                    title: 'Quantum',
                    url: '#',
                    roles: [],
                },
            ],
        },
        {
            title: 'Documentation',
            url: '#',
            icon: BookOpen,
            roles: [],
            items: [
                {
                    title: 'Tasks',
                    url: '/examples/tasks',
                    roles: [],
                },
                {
                    title: 'Get Started',
                    url: '#',
                    roles: [],
                },
                {
                    title: 'Tutorials',
                    url: '#',
                    roles: [],
                },
                {
                    title: 'Changelog',
                    url: '#',
                    roles: [],
                },
            ],
        },
        {
            title: 'Settings',
            url: '#',
            icon: Settings2,
            roles: [],
            items: [
                {
                    title: 'General',
                    url: '#',
                    roles: [],
                },
                {
                    title: 'Team',
                    url: '#',
                    roles: [],
                },
                {
                    title: 'Billing',
                    url: '#',
                    roles: [],
                },
                {
                    title: 'Limits',
                    url: '#',
                    roles: [],
                },
            ],
        },
    ],

    projects: [
        {
            name: 'Design Engineering',
            url: '#',
            icon: Frame,
            roles: [],
        },
        {
            name: 'Sales & Marketing',
            url: '#',
            icon: PieChart,
            roles: [],
        },
    ],

    navSetting: [
        {
            title: 'Settings',
            url: '#',
            icon: Settings2,
            roles: ['Administrador', 'SuperAdministrador'],
            items: [
                {
                    title: 'Usuarios',
                    url: '/admin/settings/users',
                    roles: ['Administrador', 'SuperAdministrador'],
                },
            ],
        },
        {
            title: 'Ayuda',
            url: '/admin/settings/tickets',
            icon: LifeBuoy,
            roles: ['Usuario', 'Administrador', 'SuperAdministrador'],
        },
    ],

    adminSetting: [
        {
            title: 'Privado',
            url: '#',
            icon: Shield,
            roles: ['SuperAdministrador'],
            items: [
                {
                    title: 'Auditoria',
                    url: '/admin/settings/audit',
                    roles: ['SuperAdministrador'],
                },
            ],
        },
    ],
};
