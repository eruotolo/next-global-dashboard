const commonDashboardApiRoles = [
    'SuperAdministrador',
    'Administrador',
    'Editor',
    'Colaborador',
    'Suscriptor',
];

const routeRoles = {
    '/api': commonDashboardApiRoles,
    '/admin': commonDashboardApiRoles,
    '/admin/dashboard': commonDashboardApiRoles,
    '/admin/settings/users': ['SuperAdministrador', 'Administrador'],
    '/admin/settings/tickets': commonDashboardApiRoles,
    '/admin/settings/audit': ['SuperAdministrador'],
};

export default routeRoles;
