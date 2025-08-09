/**
 * Sistema de Autenticación con Supabase
 * Validación y autenticación integrada para inspectores
 */

class SupabaseLoginValidator {
    constructor() {
        this.form = document.getElementById('loginForm');
        this.emailInput = document.getElementById('email');
        this.passwordInput = document.getElementById('password');
        this.loginBtn = document.getElementById('loginButton') || document.getElementById('loginBtn');
        this.rememberCheckbox = document.getElementById('rememberUser') || document.getElementById('remember');
        this.messageContainer = document.getElementById('messageContainer');
        
        this.maxAttempts = 5;
        this.failedAttempts = 0;
        this.lockoutTime = 1 * 60 * 1000; // 1 minuto
        
        this.init();
    }

    /**
     * Inicializar el sistema de validación
     */
    async init() {
        await this.loadSupabaseConfig();
        this.setupEventListeners();
        this.setupFormValidation();
        this.checkLockoutStatus();
        
        // NUNCA cargar usuario recordado o verificar auth si tenemos flag de forzar login manual
        const forceManual = window.FORCE_MANUAL_LOGIN;
        const fromLogout = sessionStorage.getItem('logout_flag') || localStorage.getItem('logout_flag');
        
        if (!forceManual && !fromLogout) {
            this.loadRememberedUser();
        }
        
        // NUNCA verificar auth status automáticamente - solo login manual
        // await this.checkAuthStatus();
    }

    /**
     * Cargar configuración de Supabase
     */
    async loadSupabaseConfig() {
        try {
            // Importar configuración de Supabase
            await import('./supabase-config.js');
            // Configuración cargada correctamente (sin console.log)
        } catch (error) {
            this.showMessage('Error de configuración. Contacte al administrador.', 'error');
        }
    }

    /**
     * Verificar estado de autenticación al cargar
     */
    async checkAuthStatus() {
        // Si hay flag de logout, NO verificar autenticación
        const fromLogout = sessionStorage.getItem('logout_flag');
        if (fromLogout) {
            sessionStorage.removeItem('logout_flag');
            return; // Salir inmediatamente sin verificar
        }

        // Solo verificar si NO venimos de logout
        if (window.supabaseAuth) {
            const user = await window.supabaseAuth.checkAuthStatus();
            // Solo redirigir si hay usuario Y estamos en login Y NO hay flag de logout
            if (user && window.location.pathname.includes('index.html')) {
                window.location.href = '/dashboard.html';
                return;
            }
        }
    }

    /**
     * Configurar event listeners
     */
    setupEventListeners() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleLogin(e));
        }
        
        if (this.emailInput) {
            this.emailInput.addEventListener('input', (e) => this.validateEmailRealTime(e));
            this.emailInput.addEventListener('blur', (e) => this.validateEmailOnBlur(e));
        }
        
        if (this.passwordInput) {
            this.passwordInput.addEventListener('input', (e) => this.validatePasswordRealTime(e));
            this.passwordInput.addEventListener('blur', (e) => this.validatePasswordOnBlur(e));
        }
    }

    /**
     * Configurar validación del formulario
     */
    setupFormValidation() {
        // Configurar validación HTML5 mejorada
        if (this.emailInput) {
            this.emailInput.setAttribute('autocomplete', 'email');
            this.emailInput.setAttribute('inputmode', 'email');
        }
        
        if (this.passwordInput) {
            this.passwordInput.setAttribute('autocomplete', 'current-password');
        }
    }

    /**
     * Manejar el login
     */
    async handleLogin(e) {
        e.preventDefault();
        
        if (this.isLocked()) {
            this.showMessage('Cuenta bloqueada temporalmente. Intente más tarde.', 'error');
            return;
        }

        const email = this.emailInput?.value?.trim();
        const password = this.passwordInput?.value;

        // Validaciones básicas
        if (!email || !password) {
            this.showMessage('Por favor, complete todos los campos.', 'error');
            return;
        }

        if (!this.isValidEmail(email)) {
            this.showMessage('Por favor, ingrese un email válido.', 'error');
            return;
        }

        // Mostrar estado de carga
        this.setLoadingState(true);
        
        try {
            // Intentar login con Supabase
            const result = await window.supabaseAuth.signIn(email, password);
            
            if (result.success) {
                await this.handleSuccessfulLogin(result);
            } else {
                this.handleFailedLogin(result.error);
            }
        } catch (error) {
            this.handleLoginError(error);
        }
    }

    /**
     * Manejar login exitoso
     */
    async handleSuccessfulLogin(result) {
        // Guardar usuario si está marcado
        if (this.rememberCheckbox?.checked) {
            this.saveRememberedUser();
        }
        
        // Resetear intentos fallidos
        this.resetFailedAttempts();
        
        // Mostrar mensaje de éxito
        this.showMessage('¡Bienvenido! Redirigiendo...', 'success');
        
        // Guardar datos del usuario en sessionStorage
        sessionStorage.setItem('currentUser', JSON.stringify({
            id: result.user.id,
            email: result.user.email,
            role: 'inspector',
            profile: result.profile
        }));
        
        // Limpiar flags de logout después de login exitoso
        if (window.clearLogoutFlags) {
            window.clearLogoutFlags();
        }
        
        // Pequeña demora para mostrar el mensaje
        setTimeout(() => {
            window.location.href = '/dashboard.html';
        }, 1000);
        
        this.setLoadingState(false);
    }

    /**
     * Manejar login fallido
     */
    handleFailedLogin(errorMessage) {
        this.failedAttempts++;
        localStorage.setItem('loginFailedAttempts', this.failedAttempts.toString());
        localStorage.setItem('lastFailedAttempt', Date.now().toString());
        
        let message = 'Email o contraseña incorrectos.';
        
        if (this.failedAttempts >= this.maxAttempts) {
            this.lockAccount();
            message = `Cuenta bloqueada por 1 minuto debido a múltiples intentos fallidos.`;
        } else {
            const remainingAttempts = this.maxAttempts - this.failedAttempts;
            message += ` ${remainingAttempts} intentos restantes.`;
        }
        
        this.showMessage(message, 'error');
        this.setLoadingState(false);
    }

    /**
     * Manejar error de login
     */
    handleLoginError(error) {
        this.showMessage('Correo o contraseña incorrectos', 'error');
        this.setLoadingState(false);
    }

    /**
     * Validación de email en tiempo real
     */
    validateEmailRealTime(e) {
        const email = e.target.value;
        const emailStatus = document.getElementById('email-status');
        const emailError = document.getElementById('email-error');
        
        // Limpiar errores previos
        this.clearFieldError('email');
        
        if (email.length === 0) {
            this.setFieldStatus('email', 'neutral');
            return;
        }
        
        // Validación básica
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (email.length > 0 && email.length < 5) {
            this.setFieldStatus('email', 'warning');
            this.setFieldError('email', 'Email muy corto');
            return;
        }
        
        if (email.length >= 5 && !emailRegex.test(email)) {
            this.setFieldStatus('email', 'warning');
            this.setFieldError('email', 'Formato de email inválido');
            return;
        }
        
        if (emailRegex.test(email)) {
            this.setFieldStatus('email', 'valid');
        }
    }

    /**
     * Validación de email al perder foco
     */
    validateEmailOnBlur(e) {
        const email = e.target.value;
        
        if (email.length === 0) {
            this.setFieldStatus('email', 'error');
            this.setFieldError('email', 'Email es requerido');
            return;
        }
        
        if (!this.isValidEmail(email)) {
            this.setFieldStatus('email', 'error');
            this.setFieldError('email', 'Por favor ingrese un email válido');
        }
    }

    /**
     * Validación de contraseña en tiempo real
     */
    validatePasswordRealTime(e) {
        const password = e.target.value;
        
        this.clearFieldError('password');
        
        if (password.length === 0) {
            this.setFieldStatus('password', 'neutral');
            return;
        }
        
        if (password.length > 0 && password.length < 6) {
            this.setFieldStatus('password', 'warning');
            this.setFieldError('password', 'Contraseña muy corta');
            return;
        }
        
        if (password.length >= 6) {
            this.setFieldStatus('password', 'valid');
        }
    }

    /**
     * Validación de contraseña al perder foco
     */
    validatePasswordOnBlur(e) {
        const password = e.target.value;
        
        if (password.length === 0) {
            this.setFieldStatus('password', 'error');
            this.setFieldError('password', 'Contraseña es requerida');
            return;
        }
        
        if (password.length < 6) {
            this.setFieldStatus('password', 'error');
            this.setFieldError('password', 'Contraseña debe tener al menos 6 caracteres');
        }
    }

    /**
     * Funciones de utilidad
     */
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    setFieldStatus(fieldName, status) {
        const field = document.getElementById(fieldName);
        const statusElement = document.getElementById(`${fieldName}-status`);
        
        if (field) {
            field.className = field.className.replace(/\b(valid|error|warning|neutral)\b/g, '');
            field.classList.add(status);
        }
        
        if (statusElement) {
            const statusIcons = {
                valid: '✅',
                error: '❌',
                warning: '⚠️',
                neutral: ''
            };
            statusElement.textContent = statusIcons[status] || '';
        }
    }

    setFieldError(fieldName, message) {
        const errorElement = document.getElementById(`${fieldName}-error`);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }

    clearFieldError(fieldName) {
        const errorElement = document.getElementById(`${fieldName}-error`);
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }
    }

    showMessage(message, type) {
        if (this.messageContainer) {
            this.messageContainer.innerHTML = `
                <div class="message ${type}">
                    <span class="message-icon">${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}</span>
                    <span class="message-text">${message}</span>
                </div>
            `;
            this.messageContainer.style.display = 'block';
        } else {
            // Fallback a alert si no hay contenedor
            alert(message);
        }
    }

    setLoadingState(loading) {
        if (this.loginBtn) {
            this.loginBtn.disabled = loading;
            this.loginBtn.innerHTML = loading ? 
                '<span class="btn-loader">⏳</span> Iniciando sesión...' : 
                '<span class="btn-icon">🔑</span> Iniciar Sesión';
        }
    }

    // Funciones de bloqueo y recordar usuario
    isLocked() {
        const lastFailedAttempt = parseInt(localStorage.getItem('lastFailedAttempt') || '0');
        const attempts = parseInt(localStorage.getItem('loginFailedAttempts') || '0');
        
        // Si no hay intentos fallidos registrados, no está bloqueado
        if (attempts === 0 || lastFailedAttempt === 0) {
            return false;
        }
        
        if (attempts >= this.maxAttempts) {
            const timePassed = Date.now() - lastFailedAttempt;
            const isStillLocked = timePassed < this.lockoutTime;
            
            // Si ya pasó el tiempo de bloqueo, limpiar los datos
            if (!isStillLocked) {
                this.resetFailedAttempts();
                return false;
            }
            
            return true;
        }
        
        return false;
    }

    lockAccount() {
        localStorage.setItem('lastFailedAttempt', Date.now().toString());
    }

    resetFailedAttempts() {
        localStorage.removeItem('loginFailedAttempts');
        localStorage.removeItem('lastFailedAttempt');
        this.failedAttempts = 0;
    }

    checkLockoutStatus() {
        if (this.isLocked()) {
            const remainingTime = this.getRemainingLockTime();
            const minutes = Math.ceil(remainingTime / (1000 * 60));
            this.showMessage(`Cuenta bloqueada temporalmente. Intente nuevamente en ${minutes} minutos.`, 'error');
            if (this.loginBtn) {
                this.loginBtn.disabled = true;
            }
        } else {
            // Asegurarse de que el botón esté habilitado si no hay bloqueo
            if (this.loginBtn) {
                this.loginBtn.disabled = false;
            }
        }
    }

    getRemainingLockTime() {
        const lastFailedAttempt = parseInt(localStorage.getItem('lastFailedAttempt') || '0');
        const timePassed = Date.now() - lastFailedAttempt;
        return Math.max(0, this.lockoutTime - timePassed);
    }

    saveRememberedUser() {
        if (this.emailInput?.value) {
            localStorage.setItem('rememberedEmail', this.emailInput.value);
        }
    }

    loadRememberedUser() {
        // NO cargar usuario recordado si venimos de logout
        const fromLogout = sessionStorage.getItem('logout_flag') || localStorage.getItem('logout_flag');
        if (fromLogout) {
            // Limpiar también el remember user si venimos de logout
            localStorage.removeItem('rememberedEmail');
            localStorage.removeItem('remember-user');
            return;
        }
        
        const rememberedEmail = localStorage.getItem('rememberedEmail');
        if (rememberedEmail && this.emailInput) {
            this.emailInput.value = rememberedEmail;
            if (this.rememberCheckbox) {
                this.rememberCheckbox.checked = true;
            }
        }
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    window.loginValidator = new SupabaseLoginValidator();
});

// Exportar para uso global
window.SupabaseLoginValidator = SupabaseLoginValidator;
