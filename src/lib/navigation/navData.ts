import {
    Frame,
    LifeBuoy,
    PieChart,
    Settings2,
    Shield,
    LayoutDashboard,
    ShoppingCart,
    Store,
    Briefcase
} from 'lucide-react';

export const navData = {
    navMain: [
        {
            title: 'Dashboard',
            url: '/admin/dashboard',
            icon: LayoutDashboard,
            roles: [],
        },
        {
            title: 'Ventas',
            url: '#',
            icon: ShoppingCart,
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
            title: 'Compras',
            url: '#',
            icon: Store,
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
            title: 'Operaciones',
            url: '#',
            icon: Briefcase,
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

    navAdministration: [
        {
            title: 'Administración',
            url: '#',
            icon: Settings2,
            roles: [],
            items: [
                {
                    title: 'Socios',
                    url: '#',
                    roles: [],
                },
                {
                    title: 'Países',
                    url: '/admin/administration/country',
                    roles: [],
                },
                {
                    title: 'Aeropuertos',
                    url: '#',
                    roles: [],
                },
                {
                    title: 'Puertos',
                    url: '#',
                    roles: [],
                },
                {
                    title: 'Commodities',
                    url: '#',
                    roles: [],
                },
                {
                    title: 'Lugares',
                    url: '#',
                    roles: [],
                },
                {
                    title: 'Buques',
                    url: '#',
                    roles: [],
                },
                {
                    title: 'Tráficos',
                    url: '#',
                    roles: [],
                },
                {
                    title: 'Incoterms',
                    url: '#',
                    roles: [],
                },
            ],
        },
    ],

    navSetting: [
        {
            title: 'Settings',
            url: '#',
            icon: Settings2,
            roles: [],
            items: [
                {
                    title: 'Usuarios',
                    url: '/admin/settings/users',
                    roles: [],
                },
            ],
        },
        {
            title: 'Ayuda',
            url: '/admin/settings/tickets',
            icon: LifeBuoy,
            roles: [],
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
                {
                    title: 'Permisos',
                    url: '/admin/settings/permissions',
                    roles: ['SuperAdministrador'],
                },
            ],
        },
    ],
};
