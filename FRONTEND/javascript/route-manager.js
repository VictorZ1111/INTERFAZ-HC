/**
 * Utilidad para manejo de rutas que funciona tanto local como en producción
 */

class RouteManager {
    constructor() {
        this.isLocal = this.detectLocalEnvironment();
    }

    /**
     * Detectar si estamos en entorno local
     */
    detectLocalEnvironment() {
        const hostname = window.location.hostname;
        const port = window.location.port;
        
        // Entornos locales comunes
        return hostname === 'localhost' || 
               hostname === '127.0.0.1' || 
               hostname === '0.0.0.0' ||
               hostname.includes('192.168.') ||
               hostname.includes('10.') ||
               hostname.includes('172.') ||
               port !== '' ||
               window.location.protocol === 'file:';
    }

    /**
     * Obtener la ruta correcta según el entorno
     */
    getRoute(route) {
        // Remover barra inicial si existe
        const cleanRoute = route.startsWith('/') ? route.substring(1) : route;
        
        if (this.isLocal) {
            // En local usar rutas relativas
            return cleanRoute;
        } else {
            // En producción usar rutas absolutas
            return '/' + cleanRoute;
        }
    }

    /**
     * Navegar a una ruta
     */
    navigateTo(route) {
        window.location.href = this.getRoute(route);
    }

    /**
     * Obtener la URL base correcta
     */
    getBaseUrl() {
        if (this.isLocal) {
            return window.location.origin + window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/') + 1);
        } else {
            return window.location.origin + '/';
        }
    }
}

// Crear instancia global
window.routeManager = new RouteManager();

// Función helper global para navegación
window.navigateTo = function(route) {
    window.routeManager.navigateTo(route);
};

// Función helper para obtener rutas
window.getRoute = function(route) {
    return window.routeManager.getRoute(route);
};

// Mostrar información del entorno en consola
console.log('🌐 Entorno detectado:', window.routeManager.isLocal ? 'LOCAL' : 'PRODUCCIÓN');
console.log('📍 Base URL:', window.routeManager.getBaseUrl());
