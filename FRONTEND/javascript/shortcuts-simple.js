/**
 * SISTEMA DE ATAJOS DE TECLADO - VERSIÓN SIMPLIFICADA
 * Sistema robusto que funciona independientemente de otras librerías
 */

// Variables globales
window.GMPI_SHORTCUTS_LOADED = false;

// Función para inicializar atajos
function initializeKeyboardShortcuts() {
    // Evitar inicialización múltiple
    if (window.GMPI_SHORTCUTS_LOADED) {
        console.log('🎹 Atajos ya inicializados, omitiendo...');
        return;
    }

    console.log('🎹 Inicializando sistema de atajos de teclado...');

    // Función principal de manejo de atajos
    function handleKeyboardShortcut(e) {
        // Solo procesar combinaciones con Alt o Ctrl
        if (!e.altKey && !e.ctrlKey) return;

        // ATAJOS CON ALT
        if (e.altKey) {
            switch(e.key.toLowerCase()) {
                case '1':
                    e.preventDefault();
                    console.log('🎹 Alt+1: Navegando a Dashboard');
                    navigateToPage('dashboard.html');
                    showNotificationMessage('📊 Navegando a Dashboard');
                    break;
                    
                case '2':
                    e.preventDefault();
                    console.log('🎹 Alt+2: Navegando a Infraestructuras');
                    navigateToPage('infraestructuras.html');
                    showNotificationMessage('🏢 Navegando a Infraestructuras');
                    break;
                    
                case '3':
                    e.preventDefault();
                    console.log('🎹 Alt+3: Gestión');
                    showNotificationMessage('⚙️ Gestión (función en desarrollo)');
                    break;
                    
                case '4':
                    e.preventDefault();
                    console.log('🎹 Alt+4: Navegando a Calendario');
                    navigateToPage('calendario.html');
                    showNotificationMessage('📅 Navegando a Calendario');
                    break;
                    
                case 'h':
                    e.preventDefault();
                    console.log('🎹 Alt+H: Mostrando ayuda');
                    showShortcutsHelp();
                    break;
                    
                case 'c':
                    e.preventDefault();
                    console.log('🎹 Alt+C: Navegando a Contacto');
                    navigateToPage('contact.html');
                    showNotificationMessage('📞 Navegando a Contacto');
                    break;
                    
                case 's':
                    e.preventDefault();
                    console.log('🎹 Alt+S: Cerrando sesión');
                    navigateToPage('index.html');
                    showNotificationMessage('🚪 Cerrando sesión');
                    break;
                    
                case 't':
                    e.preventDefault();
                    console.log('🎹 Alt+T: Cambiando tema');
                    toggleTheme();
                    break;
                    
                case 'l':
                    e.preventDefault();
                    console.log('🎹 Alt+L: Cambiando idioma');
                    toggleLanguage();
                    break;
            }
        }
        
        // ATAJOS CON CTRL
        if (e.ctrlKey && e.key.toLowerCase() === 'k') {
            e.preventDefault();
            console.log('🎹 Ctrl+K: Búsqueda rápida');
            showQuickSearch();
        }
        
        // ESC para cerrar
        if (e.key === 'Escape') {
            closeAllModals();
        }
    }

    // Función para navegar entre páginas
    function navigateToPage(page) {
        try {
            // Detectar si estamos en producción o local
            const isLocal = window.location.protocol === 'file:' || 
                           window.location.hostname === 'localhost' ||
                           window.location.hostname === '127.0.0.1';
            
            if (isLocal) {
                // En local, usar rutas relativas
                const currentPath = window.location.pathname;
                const basePath = currentPath.substring(0, currentPath.lastIndexOf('/') + 1);
                window.location.href = basePath + page;
            } else {
                // En producción, usar rutas absolutas
                window.location.href = '/' + page;
            }
        } catch (error) {
            console.error('Error navegando:', error);
            window.location.href = page;
        }
    }

    // Función para mostrar notificaciones
    function showNotificationMessage(message) {
        // Remover notificación anterior si existe
        const existing = document.getElementById('gmpi-notification');
        if (existing) existing.remove();

        const notification = document.createElement('div');
        notification.id = 'gmpi-notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #e67e22;
            color: white;
            padding: 15px 25px;
            border-radius: 25px;
            font-weight: bold;
            z-index: 10000;
            font-family: Arial, sans-serif;
            font-size: 14px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            animation: slideInRight 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Función para mostrar ayuda de atajos
    function showShortcutsHelp() {
        // Crear modal si no existe
        let modal = document.getElementById('shortcutsModal');
        if (!modal) {
            createShortcutsModal();
            modal = document.getElementById('shortcutsModal');
        }
        
        modal.style.display = 'flex';
        showNotificationMessage('📖 Ayuda de atajos mostrada');
    }
    
    // Función para crear el modal de atajos
    function createShortcutsModal() {
        const modalHTML = `
            <div class="shortcuts-modal" id="shortcutsModal" style="display: none;">
                <div class="shortcuts-content">
                    <div class="shortcuts-header">
                        <h3>Atajos de Teclado</h3>
                        <button class="close-btn" onclick="document.getElementById('shortcutsModal').style.display='none'">×</button>
                    </div>
                    <div class="shortcuts-body">
                        <div class="shortcuts-section">
                            <h4>Navegación</h4>
                            <div class="shortcut-item">
                                <span class="shortcut-key">Alt + 1</span>
                                <span class="shortcut-desc">Panel de Control</span>
                            </div>
                            <div class="shortcut-item">
                                <span class="shortcut-key">Alt + 2</span>
                                <span class="shortcut-desc">Infraestructuras</span>
                            </div>
                            <div class="shortcut-item">
                                <span class="shortcut-key">Alt + 3</span>
                                <span class="shortcut-desc">Gestión</span>
                            </div>
                            <div class="shortcut-item">
                                <span class="shortcut-key">Alt + 4</span>
                                <span class="shortcut-desc">Planificación</span>
                            </div>
                            <div class="shortcut-item">
                                <span class="shortcut-key">Alt + H</span>
                                <span class="shortcut-desc">Ayuda</span>
                            </div>
                            <div class="shortcut-item">
                                <span class="shortcut-key">Alt + C</span>
                                <span class="shortcut-desc">Contacto</span>
                            </div>
                            <div class="shortcut-item">
                                <span class="shortcut-key">Alt + S</span>
                                <span class="shortcut-desc">Cerrar Sesión</span>
                            </div>
                        </div>
                        <div class="shortcuts-section">
                            <h4>Configuración</h4>
                            <div class="shortcut-item">
                                <span class="shortcut-key">Alt + L</span>
                                <span class="shortcut-desc">Idioma</span>
                            </div>
                            <div class="shortcut-item">
                                <span class="shortcut-key">Alt + T</span>
                                <span class="shortcut-desc">Tema</span>
                            </div>
                            <div class="shortcut-item">
                                <span class="shortcut-key">Ctrl + K</span>
                                <span class="shortcut-desc">Búsqueda rápida</span>
                            </div>
                            <div class="shortcut-item">
                                <span class="shortcut-key">Esc</span>
                                <span class="shortcut-desc">Cerrar menús</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Cerrar modal al hacer clic fuera
        const modal = document.getElementById('shortcutsModal');
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }

    // Función para alternar tema
    function toggleTheme() {
        const html = document.documentElement;
        const currentTheme = html.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('gmpi-theme', newTheme);
        
        if (newTheme === 'dark') {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }
        
        showNotificationMessage(`🎨 Tema cambiado a ${newTheme === 'dark' ? 'oscuro' : 'claro'}`);
    }

    // Función para alternar idioma
    function toggleLanguage() {
        const html = document.documentElement;
        const currentLang = html.getAttribute('data-lang') || 'es';
        const newLang = currentLang === 'es' ? 'en' : 'es';
        
        html.setAttribute('data-lang', newLang);
        localStorage.setItem('gmpi-language', newLang);
        
        showNotificationMessage(`🌐 Idioma cambiado a ${newLang === 'es' ? 'Español' : 'English'}`);
    }

    // Función para búsqueda rápida
    function showQuickSearch() {
        const searchTerm = prompt('🔍 Búsqueda rápida:');
        if (searchTerm) {
            showNotificationMessage(`🔍 Buscando: "${searchTerm}"`);
            // Aquí podrías implementar la lógica de búsqueda real
        }
    }

    // Función para cerrar modales
    function closeAllModals() {
        // Cerrar modal de atajos
        const shortcutsModal = document.getElementById('shortcutsModal');
        if (shortcutsModal) {
            shortcutsModal.style.display = 'none';
        }
        
        // Cerrar cualquier modal o dropdown que esté abierto
        const modals = document.querySelectorAll('.modal, .dropdown.active');
        modals.forEach(modal => {
            modal.style.display = 'none';
            modal.classList.remove('active');
        });
        
        if (modals.length > 0 || shortcutsModal) {
            showNotificationMessage('❌ Modales cerrados');
        }
    }

    // Agregar event listener
    document.addEventListener('keydown', handleKeyboardShortcut);
    
    // Marcar como cargado
    window.GMPI_SHORTCUTS_LOADED = true;
    
    console.log('✅ Sistema de atajos de teclado inicializado correctamente');
    
    // Mostrar notificación de inicio
    setTimeout(() => {
        showNotificationMessage('🎹 Atajos de teclado activados - Alt+H para ayuda');
    }, 1000);
}

// Agregar estilos CSS para animaciones y modal
const styles = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .shortcuts-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    }

    .shortcuts-content {
        background: white;
        border-radius: 12px;
        padding: 30px;
        max-width: 600px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        position: relative;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    }

    .shortcuts-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        padding-bottom: 15px;
        border-bottom: 2px solid #f0f0f0;
    }

    .shortcuts-header h3 {
        margin: 0;
        color: #e67e22;
        font-size: 24px;
    }

    .close-btn {
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: #666;
        padding: 5px;
        border-radius: 50%;
        width: 35px;
        height: 35px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .close-btn:hover {
        background: #f0f0f0;
        color: #e67e22;
    }

    .shortcuts-body {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 30px;
    }

    .shortcuts-section h4 {
        margin: 0 0 15px 0;
        color: #333;
        font-size: 18px;
        border-bottom: 1px solid #e0e0e0;
        padding-bottom: 8px;
    }

    .shortcut-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 0;
        border-bottom: 1px solid #f5f5f5;
    }

    .shortcut-key {
        background: #f8f9fa;
        border: 1px solid #dee2e6;
        border-radius: 4px;
        padding: 4px 8px;
        font-family: monospace;
        font-size: 12px;
        font-weight: bold;
        color: #495057;
    }

    .shortcut-desc {
        color: #666;
        font-size: 14px;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    @media (max-width: 768px) {
        .shortcuts-body {
            grid-template-columns: 1fr;
            gap: 20px;
        }
        
        .shortcuts-content {
            padding: 20px;
        }
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeKeyboardShortcuts);
} else {
    initializeKeyboardShortcuts();
}

// También hacer disponible la función globalmente
window.initializeKeyboardShortcuts = initializeKeyboardShortcuts;

// Hacer disponible la función de ayuda globalmente para compatibilidad
window.showShortcuts = function() {
    // Crear modal si no existe
    let modal = document.getElementById('shortcutsModal');
    if (!modal) {
        createShortcutsModal();
        modal = document.getElementById('shortcutsModal');
    }
    modal.style.display = 'flex';
};

// Función para crear el modal globalmente
function createShortcutsModal() {
    if (document.getElementById('shortcutsModal')) return; // Ya existe
    
    const modalHTML = `
        <div class="shortcuts-modal" id="shortcutsModal" style="display: none;">
            <div class="shortcuts-content">
                <div class="shortcuts-header">
                    <h3>Atajos de Teclado</h3>
                    <button class="close-btn" onclick="document.getElementById('shortcutsModal').style.display='none'">×</button>
                </div>
                <div class="shortcuts-body">
                    <div class="shortcuts-section">
                        <h4>Navegación</h4>
                        <div class="shortcut-item">
                            <span class="shortcut-key">Alt + 1</span>
                            <span class="shortcut-desc">Panel de Control</span>
                        </div>
                        <div class="shortcut-item">
                            <span class="shortcut-key">Alt + 2</span>
                            <span class="shortcut-desc">Infraestructuras</span>
                        </div>
                        <div class="shortcut-item">
                            <span class="shortcut-key">Alt + 3</span>
                            <span class="shortcut-desc">Gestión</span>
                        </div>
                        <div class="shortcut-item">
                            <span class="shortcut-key">Alt + 4</span>
                            <span class="shortcut-desc">Planificación</span>
                        </div>
                        <div class="shortcut-item">
                            <span class="shortcut-key">Alt + H</span>
                            <span class="shortcut-desc">Ayuda</span>
                        </div>
                        <div class="shortcut-item">
                            <span class="shortcut-key">Alt + C</span>
                            <span class="shortcut-desc">Contacto</span>
                        </div>
                        <div class="shortcut-item">
                            <span class="shortcut-key">Alt + S</span>
                            <span class="shortcut-desc">Cerrar Sesión</span>
                        </div>
                    </div>
                    <div class="shortcuts-section">
                        <h4>Configuración</h4>
                        <div class="shortcut-item">
                            <span class="shortcut-key">Alt + L</span>
                            <span class="shortcut-desc">Idioma</span>
                        </div>
                        <div class="shortcut-item">
                            <span class="shortcut-key">Alt + T</span>
                            <span class="shortcut-desc">Tema</span>
                        </div>
                        <div class="shortcut-item">
                            <span class="shortcut-key">Ctrl + K</span>
                            <span class="shortcut-desc">Búsqueda rápida</span>
                        </div>
                        <div class="shortcut-item">
                            <span class="shortcut-key">Esc</span>
                            <span class="shortcut-desc">Cerrar menús</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Cerrar modal al hacer clic fuera
    const modal = document.getElementById('shortcutsModal');
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}
