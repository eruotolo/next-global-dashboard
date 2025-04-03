const commonDashboardApiRoles = ['SuperAdministrador', 'Administrador', 'Editor'];

const routeRoles = {
    '/api': commonDashboardApiRoles,
    '/admin': commonDashboardApiRoles,
    '/admin/dashboard': commonDashboardApiRoles,
    '/admin/settings/users': ['SuperAdministrador', 'Administrador'],
    '/admin/settings/tickets': commonDashboardApiRoles,
};

export default routeRoles;
