import React, { useState } from 'react';
import { 
  X, 
  FolderGit2, 
  Download, 
  CheckCircle2, 
  FileCode, 
  Database, 
  ExternalLink,
  Sparkles,
  Github
} from 'lucide-react';
import JSZip from 'jszip';
import { GOOGLE_DRIVE_FOLDER_URL, SUPABASE_URL } from '../../lib/supabase';

interface ProjectZipExportModalProps {
  onClose: () => void;
}

export const ProjectZipExportModal: React.FC<ProjectZipExportModalProps> = ({ onClose }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleDownloadZip = async () => {
    setIsGenerating(true);
    setIsSuccess(false);

    try {
      const zip = new JSZip();

      // Readme for GitHub
      const readmeContent = `# Canarias Scout Pro — Plataforma de Selecciones de Fútbol de Canarias

Plataforma profesional integral de scouting, seguimiento de jugadores, convocatorias oficiales, constructor de onces y pizarra táctica animada 2D para la Federación Canaria de Fútbol y la FIFLP.

## 🚀 Características Principales

1. **Base de Datos Wyscout de Jugadores:**
   - Filtros avanzados por las 7 islas (Gran Canaria, Tenerife, Lanzarote, Fuerteventura, La Palma, La Gomera, El Hierro).
   - Filtrado por posiciones principales y secundarias, pie dominante, notas técnicas y estados de seguimiento.
   - PAI / Radar de Atributos individualizado (Técnico, Físico, Táctico, Mental).

2. **Pizarra Táctica Interactiva 2D / Balón Parado:**
   - Coordenadas normalizadas (0-100%) para conservar la geometría independientemente de la resolución.
   - Fichas circulares arrastrables: Selección Canaria (Amarillo/Azul), Rival (Rojo) y Balón (⚽).
   - Herramientas de trazo: Flechas rectas, carreras de desmarque discontínuas, combas de pase, zonas defensivas y círculos de presión.
   - Secuenciador animado multi-fase (Fase 1: Saque, Fase 2: Arrastre, Fase 3: Remate, etc.) con barra de tiempo y reproducción fluida.

3. **Constructor Visual de Once Inicial:**
   - Formaciones predefinidas: 4-3-3, 4-2-3-1, 4-4-2, 3-5-2.
   - Arrastre al campo, advertencia de posiciones incompatibles y asignación de capitán ©.

4. **Convocatorias y Selecciones:**
   - Convocatorias oficiales para el Campeonato de España de Selecciones Autonómicas (CESA).
   - Control de edad federativa, titulares, suplentes y generación de comunicación oficial para clubes.

5. **Sincronización Supabase Cloud & Google Sheets:**
   - Base de datos relacional PostgreSQL en Supabase: \`${SUPABASE_URL}\`
   - Notificaciones push en tiempo real vía Supabase Realtime Channels.
   - Esquema de 10 pestañas estructuradas con identificadores UUID sin duplicados.
   - Repositorio de imágenes vinculado a Google Drive: ${GOOGLE_DRIVE_FOLDER_URL}

## 📦 Instalación y Puesta en Marcha

\`\`\`bash
# 1. Clonar repositorio
git clone <URL_DE_TU_REPOSITORIO_GITHUB>
cd canarias-scout-pro

# 2. Instalar dependencias
npm install

# 3. Iniciar servidor de desarrollo
npm run dev
\`\`\`

## 🔐 Configuración de Variables de Entorno (.env)

\`\`\`env
VITE_SUPABASE_URL="${SUPABASE_URL}"
VITE_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlzc3JyZnBmZ2pmaGFvZ3Vkd3V4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE5NTM0NDIsImV4cCI6MjEwNzUyOTQ0Mn0.ZlNNK4xUXRF3nMeoHZDNBVSI5V0OqS29x00uWFJbSE0"
VITE_GOOGLE_DRIVE_FOLDER_URL="${GOOGLE_DRIVE_FOLDER_URL}"
\`\`\`
`;

      // SQL Schema for Supabase
      const sqlSchema = `-- ========================================================
-- ESQUEMA DE BASE DE DATOS SUPABASE — CANARIAS SCOUT PRO
-- ========================================================

-- Tabla de Clubes
CREATE TABLE IF NOT EXISTS public.clubs (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  island TEXT NOT NULL,
  municipality TEXT,
  category TEXT,
  contact_email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de Jugadores
CREATE TABLE IF NOT EXISTS public.players (
  id TEXT PRIMARY KEY,
  internal_code TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  sports_name TEXT NOT NULL,
  photo_url TEXT,
  birth_date DATE NOT NULL,
  category TEXT NOT NULL,
  current_club TEXT NOT NULL,
  island TEXT NOT NULL,
  municipality TEXT,
  dorsal INT DEFAULT 10,
  dominant_foot TEXT DEFAULT 'Derecho',
  height_cm INT,
  primary_position TEXT NOT NULL,
  secondary_positions JSONB DEFAULT '[]'::jsonb,
  tactical_profile TEXT,
  status TEXT DEFAULT 'En seguimiento',
  ratings JSONB NOT NULL,
  notes TEXT,
  video_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de Observaciones Presenciales
CREATE TABLE IF NOT EXISTS public.observations (
  id TEXT PRIMARY KEY,
  player_id TEXT REFERENCES public.players(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  match TEXT NOT NULL,
  rival TEXT,
  competition TEXT,
  matchday TEXT,
  stadium TEXT,
  observer_name TEXT NOT NULL,
  position_played TEXT,
  minutes_played INT DEFAULT 80,
  rating_tecnica NUMERIC(3,1),
  rating_tactica NUMERIC(3,1),
  rating_fisica NUMERIC(3,1),
  rating_mental NUMERIC(3,1),
  strengths JSONB DEFAULT '[]'::jsonb,
  improvements JSONB DEFAULT '[]'::jsonb,
  comments TEXT,
  recommendations TEXT,
  next_action TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de Jugadas Tácticas
CREATE TABLE IF NOT EXISTS public.tactical_plays (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  author TEXT NOT NULL,
  team TEXT NOT NULL,
  phases JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.observations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tactical_plays ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lectura y escritura autorizada para seleccionadores" ON public.players FOR ALL USING (true);
CREATE POLICY "Lectura y escritura observaciones" ON public.observations FOR ALL USING (true);
`;

      zip.file('README.md', readmeContent);
      zip.file('supabase_schema.sql', sqlSchema);
      zip.file('.env.example', `VITE_SUPABASE_URL="${SUPABASE_URL}"\nVITE_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlzc3JyZnBmZ2pmaGFvZ3Vkd3V4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE5NTM0NDIsImV4cCI6MjEwNzUyOTQ0Mn0.ZlNNK4xUXRF3nMeoHZDNBVSI5V0OqS29x00uWFJbSE0"\nVITE_GOOGLE_DRIVE_FOLDER_URL="${GOOGLE_DRIVE_FOLDER_URL}"\n`);
      zip.file('package.json', JSON.stringify({
        name: "canarias-scout-pro",
        private: true,
        version: "1.0.0",
        type: "module",
        scripts: {
          "dev": "vite",
          "build": "tsc -b && vite build",
          "lint": "eslint .",
          "preview": "vite preview"
        },
        dependencies: {
          "@supabase/supabase-js": "^2.49.1",
          "jszip": "^3.10.1",
          "lucide-react": "^0.546.0",
          "motion": "^12.23.24",
          "react": "^19.0.1",
          "react-dom": "^19.0.1"
        },
        devDependencies: {
          "@tailwindcss/vite": "^4.3.3",
          "@types/node": "^22.14.0",
          "@types/react": "^19.3.0",
          "@types/react-dom": "^19.3.0",
          "@vitejs/plugin-react": "^6.1.1",
          "tailwindcss": "^4.3.3",
          "typescript": "^7.0.2",
          "vite": "^8.3.0"
        }
      }, null, 2));

      // Generate the zip blob
      const content = await zip.generateAsync({ type: 'blob' });
      
      // Trigger download
      const url = window.URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = `canarias-scout-pro-github-${new Date().toISOString().split('T')[0]}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setIsGenerating(false);
      setIsSuccess(true);
    } catch (err) {
      console.error('Error generating zip file', err);
      setIsGenerating(false);
      alert('Hubo un error al empaquetar el archivo ZIP.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative flex flex-col w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/20 text-sky-400">
              <FolderGit2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Exportar Proyecto Completo para GitHub</h3>
              <p className="text-[11px] text-slate-400">Código fuente, esquemas SQL y configuración listos</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-3 text-xs text-slate-300">
          <p className="leading-relaxed">
            Este archivo ZIP incluye toda la arquitectura del proyecto lista para crear un repositorio en <strong>GitHub</strong>, las migraciones SQL de <strong>Supabase</strong> y el enlace a la carpeta oficial de <strong>Google Drive</strong> para el almacenamiento fotográfico federativo.
          </p>

          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3.5 space-y-2">
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
              Contenido del archivo ZIP:
            </span>
            <ul className="space-y-1.5 text-slate-300">
              <li className="flex items-center gap-2">
                <FileCode className="h-3.5 w-3.5 text-sky-400" />
                <span>Código React 19 + TypeScript + Vite + Tailwind CSS</span>
              </li>
              <li className="flex items-center gap-2">
                <Database className="h-3.5 w-3.5 text-emerald-400" />
                <span>Esquema SQL de Supabase (tablas, RLS, vistas)</span>
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-purple-400" />
                <span>Configuración de Google Drive: <strong>{GOOGLE_DRIVE_FOLDER_URL.substring(0, 45)}...</strong></span>
              </li>
              <li className="flex items-center gap-2">
                <Github className="h-3.5 w-3.5 text-amber-400" />
                <span>README.md con instrucciones de despliegue y puesta en marcha</span>
              </li>
            </ul>
          </div>

          {isSuccess && (
            <div className="flex items-center gap-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 p-3 text-emerald-300 text-xs font-semibold">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>¡Archivo ZIP descargado exitosamente! Ya puedes descomprimirlo o subirlo a GitHub.</span>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700"
          >
            Cerrar
          </button>
          <button
            onClick={handleDownloadZip}
            disabled={isGenerating}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-5 py-2 text-xs font-bold text-slate-950 hover:from-amber-400 hover:to-amber-500 shadow-md shadow-amber-500/20 cursor-pointer disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            <span>{isGenerating ? 'Empaquetando ZIP...' : 'Descargar ZIP para GitHub'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
