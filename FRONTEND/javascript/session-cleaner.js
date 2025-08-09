// Script para garantizar que NO haya auto-login después de logout
(function() {
    'use strict';
    
    // Verificar si venimos de un logout
    const fromLogout = sessionStorage.getItem('logout_flag') || localStorage.getItem('logout_flag');
    
    if (fromLogout) {
        console.log('Sesión cerrada - limpiando todo para evitar auto-login');
        
        // Limpiar TODO el almacenamiento
        localStorage.clear();
        sessionStorage.clear();
        
        // Limpiar cookies de Supabase
        document.cookie.split(";").forEach(function(c) { 
            document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
        });
        
        // Re-establecer el flag para que otros scripts sepan que vinimos de logout
        sessionStorage.setItem('logout_flag', 'true');
        localStorage.setItem('logout_flag', 'true');
        
        // Forzar que NO se haga ninguna verificación automática
        window.FORCE_MANUAL_LOGIN = true;
    }
    
    // Función global para limpiar flags después de login exitoso
    window.clearLogoutFlags = function() {
        sessionStorage.removeItem('logout_flag');
        localStorage.removeItem('logout_flag');
        delete window.FORCE_MANUAL_LOGIN;
    };
})();
