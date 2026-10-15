export type Island = 
  | 'Gran Canaria' 
  | 'Tenerife' 
  | 'Lanzarote' 
  | 'Fuerteventura' 
  | 'La Palma' 
  | 'La Gomera' 
  | 'El Hierro';

export type Category = 
  | 'Sub-12' 
  | 'Sub-14' 
  | 'Sub-16' 
  | 'Sub-18' 
  | 'Sub-23' 
  | 'Absoluta';

export type PlayerPosition = 
  | 'POR' // Portero
  | 'DFC' // Defensa Central
  | 'LD'  // Lateral Derecho
  | 'LI'  // Lateral Izquierdo
  | 'CAD' // Carrilero Derecho
  | 'CAI' // Carrilero Izquierdo
  | 'MCD' // Mediocentro Defensivo
  | 'MC'  // Mediocentro
  | 'INT_D' // Interior Derecho
  | 'INT_I' // Interior Izquierdo
  | 'MCO' // Mediapunta
  | 'ED'  // Extremo Derecho
  | 'EI'  // Extremo Izquierdo
  | 'DC'  // Delantero Centro
  | 'SD'; // Segundo Delantero

export type PreferredFoot = 'Derecho' | 'Izquierdo' | 'Ambidiestro';

export type ScoutingStatus = 
  | 'Nuevo'
  | 'Pendiente de observar'
  | 'Observado por primera vez'
  | 'En seguimiento'
  | 'Prioritario'
  | 'Propuesto para convocatoria'
  | 'Convocado'
  | 'En evaluación adicional'
  | 'No prioritario'
  | 'Archivado';

export type UserRole = 
  | 'Administrador'
  | 'Coordinador de Selecciones'
  | 'Seleccionador'
  | 'Observador / Scout'
  | 'Entrenador'
  | 'Usuario de Consulta';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar_url?: string;
  island: Island;
}

export interface Club {
  id: string;
  name: string;
  island: Island;
  municipality: string;
  category: string;
  contactEmail?: string;
  contactPhone?: string;
  badgeUrl?: string;
}

export interface PlayerRatings {
  // Técnicas (1-10)
  controlOrientado: number;
  paseCorto: number;
  paseLargo: number;
  conduccion: number;
  regate: number;
  finalizacion: number;
  juegoAereo: number;
  centros: number;
  golpeo: number;
  recuperacion: number;
  anticipacion: number;
  tomaDecisiones: number;
  visionJuego: number;
  posicionamiento: number;

  // Físicas (1-10)
  velocidad: number;
  aceleracion: number;
  resistencia: number;
  fuerza: number;
  agilidad: number;
  coordinacion: number;
  salto: number;

  // Tácticas (1-10)
  comprensionJuego: number;
  disciplinaTactica: number;
  ocupacionEspacios: number;
  presion: number;
  transicionDefensiva: number;
  transicionOfensiva: number;
  juegoSinBalon: number;
  adaptacionSistemas: number;

  // Mentales y competitivas (1-10)
  liderazgo: number;
  concentracion: number;
  personalidadCompetitiva: number;
  comunicacion: number;
  trabajoEquipo: number;
  adaptabilidad: number;
}

export interface Observation {
  id: string;
  playerId: string;
  date: string;
  match: string;
  rival: string;
  competition: string;
  matchday: string;
  stadium: string;
  observerName: string;
  observerId: string;
  positionPlayed: PlayerPosition;
  minutesPlayed: number;
  matchContext: string;
  ratingTecnica: number; // 1-10
  ratingTactica: number; // 1-10
  ratingFisica: number;  // 1-10
  ratingMental: number;  // 1-10
  strengths: string[];
  improvements: string[];
  comments: string;
  recommendations: string;
  videoUrl?: string;
  nextAction: string;
  createdAt: string;
}

export interface Player {
  id: string;
  internalCode: string; // e.g. "CAN-2026-0042"
  firstName: string;
  lastName: string;
  sportsName: string; // e.g. "Pedri II", "Yeremy G."
  photoUrl: string;
  birthDate: string; // YYYY-MM-DD
  category: Category;
  currentClub: string;
  clubId?: string;
  originClub?: string;
  island: Island;
  municipality: string;
  competition: string;
  division: string;
  dorsal: number;
  dominantFoot: PreferredFoot;
  heightCm: number;
  nationality: string;
  registrationDate: string;
  scoutResponsible: string;
  primaryPosition: PlayerPosition;
  secondaryPositions: PlayerPosition[];
  positionComfort: number; // 1-10
  tacticalProfile: string; // "Organizador", "Vertical", "Defensivo contundente", "Extremo desequilibrante"
  status: ScoutingStatus;
  ratings: PlayerRatings;
  notes?: string;
  isPinned?: boolean;
  videoUrl?: string;
  callUpsCount: number;
  lastObservedDate?: string;
  updatedAt: string;
}

export interface ScoutingEvent {
  id: string;
  title: string;
  type: 'Partido' | 'Seguimiento individual' | 'Entrenamiento' | 'Concentración' | 'Reunión técnica' | 'Torneo' | 'Convocatoria';
  date: string;
  time: string;
  location: string;
  island: Island;
  responsible: string;
  relatedPlayerIds: string[];
  involvedTeams: string;
  status: 'Pendiente' | 'Completado' | 'Cancelado';
  notes: string;
}

export interface CallUp {
  id: string;
  title: string;
  category: Category;
  season: string; // "2025/2026"
  selectionName: string; // "Selección Canaria Sub-16 Masculina"
  tournament: string; // "Campeonato de España de Selecciones Autonómicas"
  date: string;
  endDate?: string;
  location: string;
  coachingStaff: string[];
  selectedPlayerIds: string[];
  reservePlayerIds: string[];
  pendingConfirmationIds: string[];
  notes: string;
  isOfficialPublished: boolean;
  createdAt: string;
}

export interface LineupPlayerPosition {
  playerId?: string;
  customName?: string;
  number: number;
  position: PlayerPosition;
  x: number; // 0 to 100%
  y: number; // 0 to 100%
  isCaptain?: boolean;
  instructions?: string;
}

export interface TacticalLineup {
  id: string;
  name: string;
  callUpId?: string;
  category: Category;
  formation: '4-3-3' | '4-2-3-1' | '4-4-2' | '3-5-2' | '3-4-3' | '5-3-2' | 'Personalizada';
  starters: LineupPlayerPosition[];
  substitutes: string[]; // player IDs
  notes: string;
  updatedAt: string;
}

export interface TacticalToken {
  id: string;
  team: 'canarias' | 'rival' | 'ball' | 'referee';
  number: number;
  label: string;
  role?: string;
  x: number; // 0 to 100%
  y: number; // 0 to 100%
  color?: string;
  playerId?: string;
}

export interface TacticalDrawing {
  id: string;
  type: 'straight-arrow' | 'dashed-arrow' | 'curved-arrow' | 'pass-line' | 'dribble-line' | 'defensive-line' | 'zone-box' | 'influence-circle' | 'text-note';
  points: { x: number; y: number }[];
  color: string;
  strokeWidth: number;
  text?: string;
}

export interface TacticalPhase {
  id: string;
  name: string;
  description: string;
  durationSeconds: number;
  tokens: TacticalToken[];
  drawings: TacticalDrawing[];
}

export interface TacticalPlay {
  id: string;
  title: string;
  category: 'Córner ofensivo' | 'Córner defensivo' | 'Falta directa' | 'Falta lateral larga' | 'Saque de banda' | 'Salida de balón' | 'Presión alta' | 'Bloque medio' | 'Transición ofensiva' | 'Transición defensiva' | 'Personalizada';
  description: string;
  author: string;
  team: string;
  phases: TacticalPhase[];
  pitchOrientation: 'horizontal' | 'vertical';
  pitchView: 'full' | 'half';
  createdAt: string;
  tags: string[];
}

export interface PushNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'observation' | 'callup' | 'priority' | 'system' | 'sync';
  read: boolean;
  linkUrl?: string;
}

export interface AuditLog {
  id: string;
  action: string;
  userName: string;
  details: string;
  timestamp: string;
  ip?: string;
}
