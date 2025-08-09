// Configuración de Supabase
import { createClient } from 'https://cdn.skypack.dev/@supabase/supabase-js'

// Configuración del cliente Supabase
const SUPABASE_URL = 'https://mnfowfbamxjkbbzilkbc.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1uZm93ZmJhbXhqa2Jiemlsa2JjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3MDQ1MzUsImV4cCI6MjA3MDI4MDUzNX0.Ts4lr6EzVcFOA1ZJJAA3nmikcbqGLlQsUPW0V10evpI'

// Crear cliente de Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Exportar para uso global
window.supabase = supabase

// Funciones de utilidad para autenticación
class SupabaseAuth {
    constructor() {
        this.supabase = supabase
        this.currentUser = null
        // NO verificar automáticamente en constructor
        // this.checkAuthStatus()
    }

    // Verificar estado de autenticación
    async checkAuthStatus() {
        // Si hay flag de logout, devolver null inmediatamente
        const logoutFlag = sessionStorage.getItem('logout_flag') || localStorage.getItem('logout_flag');
        if (logoutFlag) {
            this.currentUser = null;
            return null;
        }

        try {
            const { data: { user } } = await this.supabase.auth.getUser()
            this.currentUser = user
            return user
        } catch (error) {
            this.currentUser = null
            return null
        }
    }

    // Registrar nuevo usuario inspector
    async registerInspector(userData) {
        try {
            // 1. Crear usuario en Supabase Auth (sin iniciar sesión automáticamente)
            const { data: authData, error: authError } = await this.supabase.auth.signUp({
                email: userData.email,
                password: userData.password,
                options: {
                    data: {
                        full_name: userData.fullName,
                        role: 'inspector'
                    }
                }
            })

            if (authError) throw authError

            // 2. Crear perfil de usuario en la tabla profiles
            if (authData.user) {
                const { data: profileData, error: profileError } = await this.supabase
                    .from('profiles')
                    .insert([
                        {
                            id: authData.user.id,
                            email: userData.email,
                            full_name: userData.fullName,
                            phone: userData.phone || null,
                            institution: userData.institution || null,
                            role: 'inspector',
                            created_at: new Date().toISOString()
                        }
                    ])

                if (profileError) {
                    console.error('Error creating profile:', profileError)
                    // Opcional: eliminar el usuario de auth si falla la creación del perfil
                }
            }

            // 3. Cerrar cualquier sesión automática que se haya creado
            await this.supabase.auth.signOut()
            this.currentUser = null

            return { success: true, user: authData.user, message: 'Usuario registrado exitosamente. Revisa tu email para confirmar tu cuenta y luego podrás iniciar sesión.' }

        } catch (error) {
            console.error('Registration error:', error)
            return { success: false, error: error.message }
        }
    }

    // Iniciar sesión
    async signIn(email, password) {
        try {
            const { data, error } = await this.supabase.auth.signInWithPassword({
                email: email,
                password: password
            })

            if (error) throw error

            this.currentUser = data.user
            
            // Obtener perfil del usuario
            const profile = await this.getUserProfile(data.user.id)
            
            return { 
                success: true, 
                user: data.user, 
                profile: profile,
                message: 'Inicio de sesión exitoso' 
            }

        } catch (error) {
            console.error('Sign in error:', error)
            return { success: false, error: error.message }
        }
    }

    // Cerrar sesión
    async signOut() {
        try {
            // Forzar logout completo en TODOS los dispositivos
            const { error } = await this.supabase.auth.signOut({ scope: 'global' })
            if (error) throw error
            
            // Limpiar TODO
            this.currentUser = null
            
            // BORRAR TODO el localStorage y sessionStorage
            localStorage.clear()
            sessionStorage.clear()
            
            // FORZAR la eliminación de cookies de Supabase también
            document.cookie.split(";").forEach(function(c) { 
                document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
            });
            
            // Establecer flag de logout DESPUÉS de limpiar todo
            sessionStorage.setItem('logout_flag', 'true')
            localStorage.setItem('logout_flag', 'true')
            
            return { success: true, message: 'Sesión cerrada exitosamente' }
            
        } catch (error) {
            // Incluso si hay error, limpiar todo localmente
            this.currentUser = null
            localStorage.clear()
            sessionStorage.clear()
            sessionStorage.setItem('logout_flag', 'true')
            localStorage.setItem('logout_flag', 'true')
            
            return { success: false, message: error.message }
        }
    }

    // Obtener perfil del usuario
    // Obtener perfil del usuario
    async getUserProfile(userId) {
        try {
            const { data, error } = await this.supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single()

            if (error) throw error
            return data

        } catch (error) {
            console.error('Error getting user profile:', error)
            return null
        }
    }

    // Actualizar perfil de usuario
    async updateProfile(userId, profileData) {
        try {
            const { data, error } = await this.supabase
                .from('profiles')
                .update(profileData)
                .eq('id', userId)

            if (error) throw error
            return { success: true, data: data }

        } catch (error) {
            console.error('Error updating profile:', error)
            return { success: false, error: error.message }
        }
    }

    // Listener para cambios de autenticación
    onAuthStateChange(callback) {
        return this.supabase.auth.onAuthStateChange((event, session) => {
            this.currentUser = session?.user || null
            callback(event, session)
        })
    }

    // Obtener usuario actual
    getCurrentUser() {
        return this.currentUser
    }

    // Verificar si el usuario está autenticado
    isAuthenticated() {
        return !!this.currentUser
    }
}

// Crear instancia global
window.supabaseAuth = new SupabaseAuth()

export { SupabaseAuth, supabase }
