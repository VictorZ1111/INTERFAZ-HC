# GMPI - Gestor de Mantenimiento Preventivo de Infraestructuras

Sistema web para la gestión y administración del mantenimiento preventivo de infraestructuras educativas, diseñado para inspectores y administradores educativos.

## 🚀 Estado Actual del Proyecto

### ✅ **Funcionalidades Implementadas:**

#### **🔐 Sistema de Autenticación**
- Login de inspectores con validación
- Registro de nuevos usuarios
- Gestión de sesiones
- Recuperación de contraseñas

#### **🏫 Gestión de Infraestructuras**
- **Visualización de instituciones** con tarjetas informativas
- **Agregar nuevas instituciones** con formulario completo
- **Editar instituciones existentes** con datos pre-cargados
- **Eliminar instituciones** con confirmación
- **Ver detalles** en modal informativo
- **Búsqueda y filtros** por tipo de institución

#### **📅 Sistema de Calendario**
- Calendario interactivo para programar mantenimientos
- Vista mensual con navegación
- Eventos programables
- Integración con datos de instituciones

#### **� Dashboard Administrativo**
- Panel principal con estadísticas
- Acceso rápido a funcionalidades
- Interfaz adaptada para inspectores

#### **🎨 Experiencia de Usuario**
- Diseño responsive y moderno
- Interfaz intuitiva y accesible
- Navegación consistente
- Validación de formularios en tiempo real

### � **Documentación de Requisitos Funcionales**
- **RF3 - RF11**: Análisis completo con evaluación ISO 9241-11 y heurísticas de Nielsen
- **Documentación técnica** de interfaces y funcionalidades
- **Especificaciones de usabilidad** y métricas de rendimiento

## 🏗️ Tecnologías

- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Almacenamiento**: LocalStorage para datos dinámicos
- **Diseño**: CSS Grid, Flexbox, Responsive Design
- **Validación**: JavaScript nativo con feedback visual

## 🚀 Próximo Paso: Despliegue

**Preparado para despliegue** en plataforma web con todas las funcionalidades operativas.

**Repository**: [https://github.com/VictorZ1111/INTERFAZ-HC](https://github.com/VictorZ1111/INTERFAZ-HC)

---

## 📁 Estructura del Proyecto

## 📁 Estructura del Proyecto

```
INTERFAZ-HC/
├── FRONTEND/
│   ├── html/
│   │   ├── index.html                 # Página de login
│   │   ├── dashboard.html             # Panel principal
│   │   ├── infraestructuras.html      # Gestión de instituciones
│   │   ├── calendario.html            # Sistema de calendario  
│   │   ├── add-institution.html       # Formulario agregar institución
│   │   ├── edit-institution.html      # Formulario editar institución
│   │   └── register-inspector.html    # Registro de usuarios
│   ├── css/
│   │   ├── styles.css                 # Estilos principales
│   │   ├── dashboard.css              # Estilos del dashboard
│   │   ├── calendar.css               # Estilos del calendario
│   │   └── forms.css                  # Estilos de formularios
│   └── javascript/
│       ├── navigation.js              # Sistema de navegación
│       ├── settings.js                # Configuraciones generales
│       ├── calendar.js                # Funcionalidad del calendario
│       └── validation.js              # Validación de formularios
├── BACKEND/                           # Preparado para futuras integraciones
├── DOCUMENTACION/
│   ├── RF3_REQUISITO_COMPLETO.md      # Análisis RF3 - Gestión Infraestructuras
│   ├── RF4_REQUISITO_COMPLETO.md      # Análisis RF4 - Visualización
│   ├── RF5_REQUISITO_COMPLETO.md      # Análisis RF5 - Búsqueda/Filtros
│   ├── RF6_REQUISITO_COMPLETO.md      # Análisis RF6 - Agregar Institución
│   ├── RF7_REQUISITO_COMPLETO.md      # Análisis RF7 - Dashboard
│   ├── RF8_REQUISITO_COMPLETO.md      # Análisis RF8 - Calendario
│   ├── RF9_REQUISITO_COMPLETO.md      # Análisis RF9 - Login
│   ├── RF10_REQUISITO_COMPLETO.md     # Análisis RF10 - Registro
│   ├── RF11_REQUISITO_COMPLETO.md     # Análisis RF11 - Editar Institución
│   └── RF11_FORMATO_TABLA.md          # RF11 en formato tabla específico
└── README.md                          # Este archivo
```

## 🎯 Funcionalidades Principales

### **🏫 Gestión de Instituciones**
- ✅ **Crear**: Formulario completo con validaciones
- ✅ **Leer**: Visualización en tarjetas con información detallada  
- ✅ **Actualizar**: Edición con datos pre-cargados
- ✅ **Eliminar**: Confirmación y eliminación segura
- ✅ **Buscar**: Sistema de búsqueda y filtros dinámicos

### **📅 Sistema de Calendario**
- ✅ **Navegación mensual** con controles intuitivos
- ✅ **Programación de eventos** de mantenimiento
- ✅ **Vista detallada** de eventos programados
- ✅ **Integración** con datos de instituciones

### **👤 Gestión de Usuarios**
- ✅ **Login de inspectores** con validación
- ✅ **Registro de nuevos usuarios** con verificación
- ✅ **Perfil personalizado** para cada inspector
- ✅ **Navegación contextual** basada en rol

## 🎨 Características de Diseño

- **📱 Responsive Design**: Adaptable a dispositivos móviles y desktop
- **🎨 UI/UX Profesional**: Diseño limpio y profesional para entorno educativo  
- **♿ Accesibilidad**: Cumple estándares de accesibilidad web
- **⚡ Performance**: Optimizado para carga rápida
- **🔍 Usabilidad**: Evaluado con ISO 9241-11 y heurísticas de Nielsen

## 📊 Documentación Técnica

Cada requisito funcional cuenta con análisis completo:

- **📐 Análisis ISO 9241-11**: Eficacia, Eficiencia y Satisfacción
- **🔍 Evaluación Nielsen**: 10 heurísticas de usabilidad  
- **🎨 Análisis de Interfaz**: Componentes y elementos identificados
- **⚙️ Especificaciones Técnicas**: Validaciones y flujos de interacción
- **📈 Métricas de Rendimiento**: Objetivos y indicadores de calidad

## 🚀 Listo para Producción

**Estado**: ✅ **COMPLETO Y OPERATIVO**

El proyecto está completamente funcional con todas las características implementadas y listo para despliegue en producción.

**Repository GitHub**: [https://github.com/VictorZ1111/INTERFAZ-HC](https://github.com/VictorZ1111/INTERFAZ-HC)

---

*Sistema desarrollado para la gestión eficiente del mantenimiento preventivo de infraestructuras educativas*
   - Agregar:
     ```
     SUPABASE_URL = tu_supabase_url
     SUPABASE_ANON_KEY = tu_supabase_anon_key
     ```

4. **Deploy**:
   - Vercel automáticamente desplegará el proyecto
   - Obtendrás una URL como: `https://interfaz-hc.vercel.app`

### Método 2: Vercel CLI

1. **Instalar Vercel CLI**:
```bash
npm i -g vercel
```

2. **Login y deploy**:
```bash
vercel login
vercel --prod
```

## 🔐 Configuración de Autenticación

### Configurar URL de redirección en Supabase:

1. Ve a tu proyecto en Supabase Dashboard
2. Settings → Authentication → URL Configuration
3. Agregar tu dominio de Vercel:
   ```
   Site URL: https://tu-proyecto.vercel.app
   Redirect URLs: 
   - https://tu-proyecto.vercel.app/FRONTEND/html/dashboard.html
   - https://tu-proyecto.vercel.app/FRONTEND/html/index.html
   ```

## 👤 Sistema de Usuarios

El sistema maneja un solo tipo de usuario: **Inspector**

### Registro:
- Solo permite registro como inspector
- Campos requeridos: Nombre completo, email, contraseña
- Campos opcionales: Teléfono, institución
- Confirmación por email automática

### Login:
- Autenticación con email y contraseña
- Sesión persistente
- Redirección automática al dashboard

## 📁 Estructura del Proyecto

```
INTERFAZ-HC/
├── FRONTEND/
│   ├── html/
│   │   ├── index.html              # Página de login
│   │   ├── register-inspector.html # Registro de inspectores
│   │   ├── dashboard.html          # Panel principal
│   │   ├── infraestructuras.html   # Gestión de instituciones
│   │   └── calendario.html         # Sistema de calendario
│   ├── css/
│   │   ├── login.css              # Estilos de autenticación
│   │   ├── register.css           # Estilos de registro
│   │   └── styles.css             # Estilos generales
│   └── javascript/
│       ├── supabase-config.js     # Configuración de Supabase
│       ├── supabase-login.js      # Lógica de login
│       └── supabase-register.js   # Lógica de registro
├── .env                           # Variables de entorno
├── vercel.json                    # Configuración de Vercel
├── package.json                   # Dependencias del proyecto
└── README.md                      # Este archivo
```

## 🐛 Solución de Problemas

### Error: "Invalid API key"
- Verificar que las credenciales de Supabase sean correctas
- Asegurarse de usar la clave ANON (no la SERVICE_ROLE)

### Error: "User not found"
- Verificar que el usuario esté confirmado en Supabase
- Revisar el email de confirmación

### Error de CORS
- Configurar correctamente las URLs en Supabase
- Verificar que el dominio esté agregado en Authentication settings

## 📞 Soporte

Para problemas técnicos o preguntas:
- Crear un issue en GitHub
- Contactar: victor.zamora@example.com

## 📄 Licencia

MIT License - Ver archivo LICENSE para más detalles.

---

**¡Proyecto listo para producción! 🎉**
