/**
 * Sistema de Registro con Supabase - Solo para Inspectores
 * Validación y registro integrado
 */

class SupabaseRegisterValidator {
    constructor() {
        this.form = document.getElementById('registerForm');
        this.fullNameInput = document.getElementById('fullName');
        this.emailInput = document.getElementById('email');
        this.phoneInput = document.getElementById('phone');
        this.institutionInput = null; // Campo removido
        this.passwordInput = document.getElementById('password');
        this.confirmPasswordInput = document.getElementById('confirmPassword');
        this.registerBtn = document.getElementById('registerBtn') || document.getElementById('registerButton');
        this.messageContainer = document.getElementById('messageContainer');
        
        this.init();
    }

    /**
     * Inicializar el sistema de registro
     */
    async init() {
        await this.loadSupabaseConfig();
        this.setupEventListeners();
        this.setupFormValidation();
    }

    /**
     * Cargar configuración de Supabase
     */
    async loadSupabaseConfig() {
        try {
            await import('./supabase-config.js');
            console.log('✅ Supabase configurado para registro');
        } catch (error) {
            console.error('❌ Error cargando Supabase:', error);
            this.showMessage('Error de configuración. Contacte al administrador.', 'error');
        }
    }

    /**
     * Configurar event listeners
     */
    setupEventListeners() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleRegister(e));
        }
        
        // Validaciones en tiempo real
        if (this.fullNameInput) {
            this.fullNameInput.addEventListener('input', (e) => this.validateNameRealTime(e));
            this.fullNameInput.addEventListener('blur', (e) => this.validateNameOnBlur(e));
        }
        
        if (this.emailInput) {
            this.emailInput.addEventListener('input', (e) => this.validateEmailRealTime(e));
            this.emailInput.addEventListener('blur', (e) => this.validateEmailOnBlur(e));
        }
        
        if (this.phoneInput) {
            this.phoneInput.addEventListener('input', (e) => this.validatePhoneRealTime(e));
        }
        
        if (this.passwordInput) {
            this.passwordInput.addEventListener('input', (e) => this.validatePasswordRealTime(e));
            this.passwordInput.addEventListener('blur', (e) => this.validatePasswordOnBlur(e));
        }
        
        if (this.confirmPasswordInput) {
            this.confirmPasswordInput.addEventListener('input', (e) => this.validateConfirmPasswordRealTime(e));
            this.confirmPasswordInput.addEventListener('blur', (e) => this.validateConfirmPasswordOnBlur(e));
        }
    }

    /**
     * Configurar validación del formulario
     */
    setupFormValidation() {
        // Configurar atributos HTML5
        if (this.fullNameInput) {
            this.fullNameInput.setAttribute('autocomplete', 'name');
        }
        
        if (this.emailInput) {
            this.emailInput.setAttribute('autocomplete', 'email');
            this.emailInput.setAttribute('inputmode', 'email');
        }
        
        if (this.phoneInput) {
            this.phoneInput.setAttribute('autocomplete', 'tel');
            this.phoneInput.setAttribute('inputmode', 'tel');
        }
        
        if (this.passwordInput) {
            this.passwordInput.setAttribute('autocomplete', 'new-password');
        }
        
        if (this.confirmPasswordInput) {
            this.confirmPasswordInput.setAttribute('autocomplete', 'new-password');
        }
    }

    /**
     * Manejar el registro
     */
    async handleRegister(e) {
        e.preventDefault();
        
        // Recopilar datos del formulario
        const formData = {
            fullName: this.fullNameInput?.value?.trim(),
            email: this.emailInput?.value?.trim(),
            phone: this.phoneInput?.value?.trim(),
            institution: null, // Campo removido
            password: this.passwordInput?.value,
            confirmPassword: this.confirmPasswordInput?.value
        };

        // Validar todos los campos
        if (!this.validateAllFields(formData)) {
            return;
        }

        // Mostrar estado de carga
        this.setLoadingState(true);
        
        try {
            // Registrar con Supabase
            const result = await window.supabaseAuth.registerInspector(formData);
            
            if (result.success) {
                this.handleSuccessfulRegistration(result);
            } else {
                this.handleFailedRegistration(result.error);
            }
        } catch (error) {
            this.handleRegistrationError(error);
        }
    }

    /**
     * Validar todos los campos
     */
    validateAllFields(data) {
        let isValid = true;
        
        // Validar nombre completo
        if (!data.fullName || data.fullName.length < 2) {
            this.setFieldError('fullName', 'Nombre completo es requerido (mínimo 2 caracteres)');
            this.setFieldStatus('fullName', 'error');
            isValid = false;
        }
        
        // Validar email
        if (!data.email || !this.isValidEmail(data.email)) {
            this.setFieldError('email', 'Email válido es requerido');
            this.setFieldStatus('email', 'error');
            isValid = false;
        }
        
        // Validar contraseña
        if (!data.password || data.password.length < 8) {
            this.setFieldError('password', 'Contraseña debe tener al menos 8 caracteres');
            this.setFieldStatus('password', 'error');
            isValid = false;
        }
        
        // Validar coincidencia de contraseñas
        if (data.password !== data.confirmPassword) {
            this.setFieldError('confirmPassword', 'Las contraseñas no coinciden');
            this.setFieldStatus('confirmPassword', 'error');
            isValid = false;
        }
        
        // Validar teléfono (opcional pero si se proporciona debe ser válido)
        if (data.phone && !this.isValidPhone(data.phone)) {
            this.setFieldError('phone', 'Formato de teléfono inválido');
            this.setFieldStatus('phone', 'error');
            isValid = false;
        }
        
        if (!isValid) {
            this.showMessage('Por favor, corrija los errores en el formulario.', 'error');
        }
        
        return isValid;
    }

    /**
     * Manejar registro exitoso
     */
    handleSuccessfulRegistration(result) {
        this.showMessage(result.message, 'success');
        
        // Limpiar formulario
        if (this.form) {
            this.form.reset();
        }
        
        // Redirigir al login después de un momento
        setTimeout(() => {
            window.location.href = '/index.html?message=registration_success';
        }, 3000);
        
        this.setLoadingState(false);
    }

    /**
     * Manejar registro fallido
     */
    handleFailedRegistration(errorMessage) {
        let message = 'Error en el registro: ';
        
        if (errorMessage.includes('already registered')) {
            message += 'Este email ya está registrado.';
        } else if (errorMessage.includes('weak password')) {
            message += 'La contraseña es muy débil.';
        } else if (errorMessage.includes('invalid email')) {
            message += 'El email no es válido.';
        } else {
            message += errorMessage;
        }
        
        this.showMessage(message, 'error');
        this.setLoadingState(false);
    }

    /**
     * Manejar error de registro
     */
    handleRegistrationError(error) {
        console.error('Registration error:', error);
        this.showMessage('Error de conexión. Intente nuevamente.', 'error');
        this.setLoadingState(false);
    }

    /**
     * Validaciones en tiempo real
     */
    validateNameRealTime(e) {
        const name = e.target.value;
        this.clearFieldError('fullName');
        
        if (name.length === 0) {
            this.setFieldStatus('fullName', 'neutral');
        } else if (name.length < 2) {
            this.setFieldStatus('fullName', 'warning');
            this.setFieldError('fullName', 'Nombre muy corto');
        } else {
            this.setFieldStatus('fullName', 'valid');
        }
    }

    validateNameOnBlur(e) {
        const name = e.target.value;
        if (!name || name.length < 2) {
            this.setFieldStatus('fullName', 'error');
            this.setFieldError('fullName', 'Nombre completo es requerido (mínimo 2 caracteres)');
        }
    }

    validateEmailRealTime(e) {
        const email = e.target.value;
        this.clearFieldError('email');
        
        if (email.length === 0) {
            this.setFieldStatus('email', 'neutral');
        } else if (email.length < 5) {
            this.setFieldStatus('email', 'warning');
            this.setFieldError('email', 'Email muy corto');
        } else if (!this.isValidEmail(email)) {
            this.setFieldStatus('email', 'warning');
            this.setFieldError('email', 'Formato de email inválido');
        } else {
            this.setFieldStatus('email', 'valid');
        }
    }

    validateEmailOnBlur(e) {
        const email = e.target.value;
        if (!email || !this.isValidEmail(email)) {
            this.setFieldStatus('email', 'error');
            this.setFieldError('email', 'Email válido es requerido');
        }
    }

    validatePhoneRealTime(e) {
        const phone = e.target.value;
        this.clearFieldError('phone');
        
        if (phone.length === 0) {
            this.setFieldStatus('phone', 'neutral');
        } else if (this.isValidPhone(phone)) {
            this.setFieldStatus('phone', 'valid');
        } else {
            this.setFieldStatus('phone', 'warning');
            this.setFieldError('phone', 'Formato de teléfono inválido');
        }
    }

    validatePasswordRealTime(e) {
        const password = e.target.value;
        this.clearFieldError('password');
        
        if (password.length === 0) {
            this.setFieldStatus('password', 'neutral');
        } else if (password.length < 8) {
            this.setFieldStatus('password', 'warning');
            this.setFieldError('password', 'Contraseña debe tener al menos 8 caracteres');
        } else if (this.isStrongPassword(password)) {
            this.setFieldStatus('password', 'valid');
        } else {
            this.setFieldStatus('password', 'warning');
            this.setFieldError('password', 'Contraseña débil (use mayúsculas, números y símbolos)');
        }
        
        // Revalidar confirmación si ya tiene contenido
        if (this.confirmPasswordInput?.value) {
            this.validateConfirmPasswordRealTime({ target: this.confirmPasswordInput });
        }
    }

    validatePasswordOnBlur(e) {
        const password = e.target.value;
        if (!password || password.length < 8) {
            this.setFieldStatus('password', 'error');
            this.setFieldError('password', 'Contraseña debe tener al menos 8 caracteres');
        }
    }

    validateConfirmPasswordRealTime(e) {
        const confirmPassword = e.target.value;
        const password = this.passwordInput?.value;
        
        this.clearFieldError('confirmPassword');
        
        if (confirmPassword.length === 0) {
            this.setFieldStatus('confirmPassword', 'neutral');
        } else if (confirmPassword === password) {
            this.setFieldStatus('confirmPassword', 'valid');
        } else {
            this.setFieldStatus('confirmPassword', 'warning');
            this.setFieldError('confirmPassword', 'Las contraseñas no coinciden');
        }
    }

    validateConfirmPasswordOnBlur(e) {
        const confirmPassword = e.target.value;
        const password = this.passwordInput?.value;
        
        if (!confirmPassword || confirmPassword !== password) {
            this.setFieldStatus('confirmPassword', 'error');
            this.setFieldError('confirmPassword', 'Las contraseñas no coinciden');
        }
    }

    /**
     * Funciones de utilidad
     */
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isValidPhone(phone) {
        // Acepta formatos: +593999999999, 0999999999, 999999999
        const phoneRegex = /^(\+593|0)?[0-9]{9,10}$/;
        return phoneRegex.test(phone.replace(/\s|-/g, ''));
    }

    isStrongPassword(password) {
        // Al menos 8 caracteres, una mayúscula, una minúscula, un número
        const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        return strongRegex.test(password);
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
            alert(message);
        }
    }

    setLoadingState(loading) {
        if (this.registerBtn) {
            this.registerBtn.disabled = loading;
            this.registerBtn.innerHTML = loading ? 
                '<span class="btn-loader">⏳</span> Registrando...' : 
                '<span class="btn-icon">👤</span> Registrar Inspector';
        }
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    window.registerValidator = new SupabaseRegisterValidator();
});

// Exportar para uso global
window.SupabaseRegisterValidator = SupabaseRegisterValidator;
