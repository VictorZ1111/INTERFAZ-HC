/**
 * Módulo para gestionar instituciones con Supabase
 * Reemplaza las funciones de localStorage
 */

class InstitutionsSupabase {
    constructor() {
        // Esperar a que Supabase esté inicializado
        this.waitForSupabase();
    }

    async waitForSupabase() {
        let attempts = 0;
        while (!window.supabase && attempts < 50) {
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }
        
        if (window.supabase) {
            this.supabase = window.supabase;
            console.log('✅ Supabase inicializado correctamente');
        } else {
            console.error('❌ Supabase no se pudo inicializar');
        }
    }

    /**
     * Cargar todas las instituciones desde Supabase
     */
    async loadInstitutions() {
        try {
            console.log('=== CARGANDO INSTITUCIONES ===');
            
            // Asegurar que Supabase esté listo
            if (!this.supabase) {
                await this.waitForSupabase();
            }
            
            if (!this.supabase) {
                throw new Error('Supabase no está disponible');
            }

            const { data, error } = await this.supabase
                .from('institutions')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error al cargar instituciones:', error);
                return [];
            }

            console.log('Instituciones cargadas desde BD:', data);
            console.log('🗓️ FECHAS DE LAS PRIMERAS 3 INSTITUCIONES:');
            if (data && data.length > 0) {
                data.slice(0, 3).forEach((inst, index) => {
                    console.log(`  Institución ${index + 1} (${inst.name}):`);
                    console.log(`    - last_maintenance: ${inst.last_maintenance}`);
                    console.log(`    - next_maintenance: ${inst.next_maintenance}`);
                });
            }
            return data || [];
        } catch (error) {
            console.error('Error de conexión al cargar instituciones:', error);
            return [];
        }
    }

    /**
     * Guardar nueva institución en Supabase
     */
    async saveInstitution(institutionData) {
        try {
            console.log('=== INICIANDO GUARDADO ===');
            console.log('🗓️ FECHAS RECIBIDAS:');
            console.log('  - last_maintenance:', institutionData.last_maintenance);
            console.log('  - next_maintenance:', institutionData.next_maintenance);
            console.log('  - Tipo de last_maintenance:', typeof institutionData.last_maintenance);
            console.log('  - Tipo de next_maintenance:', typeof institutionData.next_maintenance);
            
            // Asegurar que Supabase esté listo
            if (!this.supabase) {
                await this.waitForSupabase();
            }
            
            if (!this.supabase) {
                throw new Error('Supabase no está disponible');
            }
            
            console.log('Datos recibidos:', institutionData);

            const newInstitution = {
                name: institutionData.name,
                type: institutionData.type,
                acronym: institutionData.acronym || this.generateAcronym(institutionData.name),
                location: institutionData.location,
                buildings: parseInt(institutionData.buildings) || 1,
                classrooms: parseInt(institutionData.classrooms) || 1,
                laboratories: parseInt(institutionData.laboratories) || 0,
                last_maintenance: institutionData.last_maintenance || null,
                next_maintenance: institutionData.next_maintenance || null
            };

            console.log('Datos COMPLETOS a insertar:', newInstitution);

            const { data, error } = await this.supabase
                .from('institutions')
                .insert([newInstitution])
                .select();

            if (error) {
                console.error('=== ERROR DETALLADO ===');
                console.error('Error completo:', error);
                alert(`ERROR: ${error.message}`);
                throw error;
            }

            console.log('=== ÉXITO ===');
            console.log('Institución guardada:', data);
            console.log('🗓️ FECHAS GUARDADAS EN BD:');
            if (data && data[0]) {
                console.log('  - last_maintenance guardado:', data[0].last_maintenance);
                console.log('  - next_maintenance guardado:', data[0].next_maintenance);
            }
            return data[0];
        } catch (error) {
            console.error('=== ERROR CATCH ===');
            console.error('Error completo:', error);
            alert(`ERROR: ${error.message}`);
            throw error;
        }
    }

    /**
     * Generar acrónimo automáticamente
     */
    generateAcronym(name) {
        return name
            .split(' ')
            .map(word => word.charAt(0).toUpperCase())
            .join('')
            .substring(0, 4) || 'INST';
    }

    /**
     * Actualizar institución existente
     */
    async updateInstitution(id, updates) {
        try {
            console.log('=== ACTUALIZANDO INSTITUCIÓN ===');
            console.log('ID:', id);
            console.log('Datos a actualizar:', updates);
            
            // Asegurar que Supabase esté listo
            if (!this.supabase) {
                await this.waitForSupabase();
            }
            
            if (!this.supabase) {
                throw new Error('Supabase no está disponible');
            }

            const { data, error } = await this.supabase
                .from('institutions')
                .update(updates)
                .eq('id', id)
                .select();

            if (error) {
                console.error('Error al actualizar institución:', error);
                throw error;
            }

            console.log('Institución actualizada:', data);
            return data[0];
        } catch (error) {
            console.error('Error de conexión al actualizar institución:', error);
            throw error;
        }
    }

    /**
     * Eliminar institución
     */
    async deleteInstitution(id) {
        try {
            console.log('=== ELIMINANDO INSTITUCIÓN ===');
            console.log('ID a eliminar:', id);
            
            // Asegurar que Supabase esté listo
            if (!this.supabase) {
                await this.waitForSupabase();
            }
            
            if (!this.supabase) {
                throw new Error('Supabase no está disponible');
            }

            const { error } = await this.supabase
                .from('institutions')
                .delete()
                .eq('id', id);

            if (error) {
                console.error('Error al eliminar institución:', error);
                throw error;
            }

            console.log('Institución eliminada exitosamente');
            return true;
        } catch (error) {
            console.error('Error de conexión al eliminar institución:', error);
            throw error;
        }
    }

    /**
     * Buscar institución por ID
     */
    async getInstitutionById(id) {
        try {
            console.log('=== BUSCANDO INSTITUCIÓN ===');
            console.log('ID:', id);
            
            // Asegurar que Supabase esté listo
            if (!this.supabase) {
                await this.waitForSupabase();
            }
            
            if (!this.supabase) {
                throw new Error('Supabase no está disponible');
            }

            const { data, error } = await this.supabase
                .from('institutions')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                console.error('Error al buscar institución:', error);
                return null;
            }

            console.log('Institución encontrada:', data);
            return data;
        } catch (error) {
            console.error('Error de conexión al buscar institución:', error);
            return null;
        }
    }
}

// Instancia global para usar en las páginas
window.institutionsManager = new InstitutionsSupabase();
