// GESTOR DE MANTENIMIENTO PREVENTIVO - Backend Authentication
// Simulación de autenticación para el sistema

class AuthenticationSystem {
    constructor() {
        this.users = [
            {
                id: 1,
                email: 'admin@colegio.edu',
                password: 'admin123',
                role: 'administrator',
                name: 'Administrador del Sistema',
                permissions: ['read', 'write', 'delete', 'manage_users', 'manage_maintenance']
            }
        ];
        
        this.sessions = new Map();
        this.sessionTimeout = 30 * 60 * 1000; // 30 minutos
    }

    // Validar credenciales de usuario
    validateCredentials(email, password) {
        const user = this.users.find(u => u.email === email && u.password === password);
        return user || null;
    }

    // Crear sesión de usuario
    createSession(user) {
        const sessionId = this.generateSessionId();
        const session = {
            id: sessionId,
            userId: user.id,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                permissions: user.permissions
            },
            createdAt: new Date(),
            lastActivity: new Date(),
            expiresAt: new Date(Date.now() + this.sessionTimeout)
        };
        
        this.sessions.set(sessionId, session);
        return session;
    }

    // Validar sesión existente
    validateSession(sessionId) {
        const session = this.sessions.get(sessionId);
        
        if (!session) {
            return null;
        }
        
        // Verificar si la sesión ha expirado
        if (new Date() > session.expiresAt) {
            this.sessions.delete(sessionId);
            return null;
        }
        
        // Actualizar última actividad
        session.lastActivity = new Date();
        session.expiresAt = new Date(Date.now() + this.sessionTimeout);
        
        return session;
    }

    // Cerrar sesión
    logout(sessionId) {
        return this.sessions.delete(sessionId);
    }

    // Generar ID de sesión único
    generateSessionId() {
        return 'sess_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    }

    // Limpiar sesiones expiradas
    cleanExpiredSessions() {
        const now = new Date();
        for (let [sessionId, session] of this.sessions) {
            if (now > session.expiresAt) {
                this.sessions.delete(sessionId);
            }
        }
    }

    // Verificar permisos de usuario
    hasPermission(sessionId, permission) {
        const session = this.validateSession(sessionId);
        if (!session) return false;
        
        return session.user.permissions.includes(permission);
    }
}

// Sistema de Gestión de Mantenimiento
class MaintenanceManagementSystem {
    constructor() {
        this.auth = new AuthenticationSystem();
        this.maintenanceRecords = [];
        this.facilities = [];
        this.personnel = [];
        this.materials = [];
        
        this.initializeData();
    }

    // Inicializar datos de ejemplo
    initializeData() {
        // Instalaciones de ejemplo
        this.facilities = [
            {
                id: 1,
                name: 'Edificio Principal',
                type: 'academic',
                location: 'Campus Central',
                status: 'active',
                lastMaintenance: '2024-12-15',
                nextMaintenance: '2025-03-15'
            },
            {
                id: 2,
                name: 'Laboratorio de Ciencias',
                type: 'laboratory',
                location: 'Piso 2 - Ala Norte',
                status: 'maintenance_required',
                lastMaintenance: '2024-11-20',
                nextMaintenance: '2025-02-20'
            },
            {
                id: 3,
                name: 'Gimnasio',
                type: 'sports',
                location: 'Campus Deportivo',
                status: 'active',
                lastMaintenance: '2025-01-05',
                nextMaintenance: '2025-04-05'
            }
        ];

        // Personal de mantenimiento
        this.personnel = [
            {
                id: 1,
                name: 'Carlos Rodríguez',
                role: 'Supervisor de Mantenimiento',
                specialization: 'Sistemas Eléctricos',
                status: 'available'
            },
            {
                id: 2,
                name: 'María González',
                role: 'Técnica de Plomería',
                specialization: 'Sistemas Hidráulicos',
                status: 'occupied'
            },
            {
                id: 3,
                name: 'Juan Pérez',
                role: 'Técnico General',
                specialization: 'Mantenimiento General',
                status: 'available'
            }
        ];

        // Materiales y suministros
        this.materials = [
            {
                id: 1,
                name: 'Pintura Blanca',
                category: 'Pintura',
                quantity: 25,
                unit: 'galones',
                minStock: 5
            },
            {
                id: 2,
                name: 'Cables Eléctricos',
                category: 'Eléctrico',
                quantity: 150,
                unit: 'metros',
                minStock: 50
            },
            {
                id: 3,
                name: 'Tubería PVC',
                category: 'Plomería',
                quantity: 8,
                unit: 'metros',
                minStock: 10
            }
        ];
    }

    // Login de usuario
    login(email, password) {
        try {
            const user = this.auth.validateCredentials(email, password);
            
            if (!user) {
                return {
                    success: false,
                    message: 'Credenciales inválidas'
                };
            }

            const session = this.auth.createSession(user);
            
            return {
                success: true,
                message: 'Login exitoso',
                session: {
                    id: session.id,
                    user: session.user,
                    expiresAt: session.expiresAt
                }
            };
        } catch (error) {
            return {
                success: false,
                message: 'Error interno del servidor'
            };
        }
    }

    // Logout de usuario
    logout(sessionId) {
        const success = this.auth.logout(sessionId);
        return {
            success,
            message: success ? 'Logout exitoso' : 'Sesión no encontrada'
        };
    }

    // Obtener dashboard data
    getDashboardData(sessionId) {
        const session = this.auth.validateSession(sessionId);
        if (!session) {
            return { success: false, message: 'Sesión inválida' };
        }

        const stats = {
            totalFacilities: this.facilities.length,
            activeFacilities: this.facilities.filter(f => f.status === 'active').length,
            maintenanceRequired: this.facilities.filter(f => f.status === 'maintenance_required').length,
            availablePersonnel: this.personnel.filter(p => p.status === 'available').length,
            lowStockMaterials: this.materials.filter(m => m.quantity <= m.minStock).length
        };

        return {
            success: true,
            data: {
                user: session.user,
                stats,
                upcomingMaintenance: this.getUpcomingMaintenance(),
                recentActivity: this.getRecentActivity()
            }
        };
    }

    // Obtener mantenimientos próximos
    getUpcomingMaintenance() {
        const now = new Date();
        const oneMonth = new Date();
        oneMonth.setMonth(oneMonth.getMonth() + 1);

        return this.facilities
            .filter(f => {
                const nextDate = new Date(f.nextMaintenance);
                return nextDate >= now && nextDate <= oneMonth;
            })
            .sort((a, b) => new Date(a.nextMaintenance) - new Date(b.nextMaintenance));
    }

    // Obtener actividad reciente
    getRecentActivity() {
        return [
            {
                id: 1,
                type: 'maintenance_completed',
                description: 'Mantenimiento de aires acondicionados completado',
                facility: 'Biblioteca Principal',
                date: '2025-01-02',
                technician: 'Carlos Rodríguez'
            },
            {
                id: 2,
                type: 'inspection_scheduled',
                description: 'Inspección de sistemas eléctricos programada',
                facility: 'Laboratorio de Química',
                date: '2025-01-03',
                technician: 'María González'
            }
        ];
    }
}

// Exportar para uso en diferentes entornos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AuthenticationSystem, MaintenanceManagementSystem };
} else if (typeof window !== 'undefined') {
    window.GMPI = { AuthenticationSystem, MaintenanceManagementSystem };
}

// Inicializar sistema (para demo)
console.log('🏫 GMPI - Gestor de Mantenimiento Preventivo Inicializado');
console.log('📧 Usuario: admin@colegio.edu / admin123');

// Crear instancia global para demo
const gmpiSystem = new MaintenanceManagementSystem();

// Función helper para testing
function testLogin() {
    const result = gmpiSystem.login('admin@colegio.edu', 'admin123');
    console.log('Test Login Result:', result);
    
    if (result.success) {
        const dashboardData = gmpiSystem.getDashboardData(result.session.id);
        console.log('Dashboard Data:', dashboardData);
    }
    
    return result;
}
