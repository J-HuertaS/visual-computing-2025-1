# Espacios Proyectivos y Matrices de Proyección

Este proyecto es una demostración interactiva de los conceptos de espacios proyectivos y matrices de proyección, mostrando las diferencias entre proyecciones ortográficas y perspectivas en un entorno 3D.

## Requisitos

- Node.js 18.x o superior
- npm 9.x o superior

## Instalación

1. Clona este repositorio:
\`\`\`bash
git clone https://github.com/tu-usuario/espacios-proyectivos.git
cd espacios-proyectivos
\`\`\`

2. Instala las dependencias:
\`\`\`bash
npm install
\`\`\`

## Ejecución

Para ejecutar el proyecto en modo desarrollo:

\`\`\`bash
npm run dev
\`\`\`

Esto iniciará el servidor de desarrollo en `http://localhost:3000`.

Para construir el proyecto para producción:

\`\`\`bash
npm run build
\`\`\`

Para iniciar la versión de producción:

\`\`\`bash
npm run start
\`\`\`

## Estructura del Proyecto

\`\`\`
├── app/                  # Directorio principal de la aplicación Next.js
│   ├── globals.css       # Estilos globales
│   ├── layout.tsx        # Layout principal
│   └── page.tsx          # Página principal
├── components/           # Componentes React
│   ├── camera-controls.tsx       # Controles de cámara
│   ├── projection-context.tsx    # Contexto para gestionar el estado de proyección
│   ├── projective-space-demo.tsx # Componente principal de la demostración 3D
│   ├── theme-provider.tsx        # Proveedor de tema
│   └── ui/               # Componentes de UI (shadcn/ui)
├── public/               # Archivos estáticos
├── next.config.mjs       # Configuración de Next.js
├── package.json          # Dependencias y scripts
├── postcss.config.js     # Configuración de PostCSS
├── tailwind.config.js    # Configuración de Tailwind CSS
└── tsconfig.json         # Configuración de TypeScript
\`\`\`

## Características

- Visualización interactiva de proyecciones ortográficas y perspectivas
- Controles para ajustar parámetros de cámara (FOV, zoom)
- Visualización de frustum de cámara
- Información técnica sobre matrices de proyección
- Objetos 3D a diferentes profundidades para demostrar efectos de proyección
- Interfaz de usuario moderna y responsiva

## Tecnologías Utilizadas

- Next.js
- React
- Three.js con React Three Fiber
- Tailwind CSS
- shadcn/ui
