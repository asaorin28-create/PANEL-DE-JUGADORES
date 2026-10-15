import React, { useState, useEffect } from 'react';
import { 
  X, 
  MapPin, 
  Calendar, 
  Star, 
  Plus, 
  ExternalLink, 
  FileText, 
  Award, 
  Shield, 
  TrendingUp, 
  CheckCircle,
  Video,
  Edit3,
  Save,
  Check,
  ChevronDown
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { Player, Observation, ScoutingStatus, PlayerRatings } from '../../types';

interface PlayerDetailModalProps {
  playerId: string;
  onClose: () => void;
  onAddObservation: () => void;
}

export const PlayerDetailModal: React.FC<PlayerDetailModalProps> = ({ 
  playerId, 
  onClose,
  onAddObservation 
}) => {
  const { players, observations, updatePlayer, setEditingPlayer } = useApp();
  const player = players.find((p) => p.id === playerId);
  const playerObs = observations.filter((o) => o.playerId === playerId);

  const [activeTab, setActiveTab] = useState<'perfil' | 'metricas' | 'observaciones'>('perfil');
  const [editedNotes, setEditedNotes] = useState(player?.notes || '');
  const [localRatings, setLocalRatings] = useState<PlayerRatings>(
    player?.ratings || {
      controlOrientado: 7.8,
      paseCorto: 7.9,
      paseLargo: 7.5,
      conduccion: 7.6,
      regate: 7.7,
      finalizacion: 7.2,
      juegoAereo: 7.0,
      centros: 7.4,
      golpeo: 7.5,
      recuperacion: 7.1,
      anticipacion: 7.6,
      tomaDecisiones: 7.8,
      visionJuego: 8.0,
      posicionamiento: 7.7,
      velocidad: 7.9,
      aceleracion: 8.0,
      resistencia: 7.8,
      fuerza: 7.4,
      agilidad: 7.9,
      coordinacion: 8.0,
      salto: 7.3,
      comprensionJuego: 8.0,
      disciplinaTactica: 8.1,
      ocupacionEspacios: 7.9,
      presion: 7.6,
      transicionDefensiva: 7.4,
      transicionOfensiva: 8.1,
      juegoSinBalon: 7.8,
      adaptacionSistemas: 7.9,
      liderazgo: 7.5,
      concentracion: 7.8,
      personalidadCompetitiva: 8.0,
      comunicacion: 7.4,
      trabajoEquipo: 8.2,
      adaptabilidad: 7.9,
    }
  );

  const [ratingsSavedSuccess, setRatingsSavedSuccess] = useState(false);
  const [notesSavedSuccess, setNotesSavedSuccess] = useState(false);
  const [isEditingQuickInfo, setIsEditingQuickInfo] = useState(false);
  const [quickDorsal, setQuickDorsal] = useState(player?.dorsal || 10);
  const [quickClub, setQuickClub] = useState(player?.currentClub || '');

  // Synchronize local states when the player record is updated
  useEffect(() => {
    if (player) {
      setLocalRatings(player.ratings);
      setEditedNotes(player.notes || '');
      setQuickDorsal(player.dorsal);
      setQuickClub(player.currentClub);
    }
  }, [player]);

  if (!player) return null;

  // Age calculation
  const getAge = (birthDate: string): number => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const age = getAge(player.birthDate);
  const r = localRatings;

  // Radar points calculation for hexagon
  const radarCategories = [
    { label: 'Técnica', value: (r.controlOrientado + r.paseCorto + r.regate + r.finalizacion) / 4 },
    { label: 'Físico', value: (r.velocidad + r.aceleracion + r.resistencia + r.fuerza) / 4 },
    { label: 'Táctica', value: (r.comprensionJuego + r.disciplinaTactica + r.ocupacionEspacios) / 3 },
    { label: 'Mental', value: (r.liderazgo + r.concentracion + r.personalidadCompetitiva) / 3 },
    { label: 'Visión', value: (r.visionJuego + r.tomaDecisiones) / 2 },
    { label: 'Recuperación', value: (r.recuperacion + r.anticipacion + r.presion) / 3 },
  ];

  // SVG Radar generator (normalized to 0-10)
  const size = 180;
  const center = size / 2;
  const radius = center - 24;

  const getCoordinates = (value: number, index: number, total: number) => {
    const angle = (Math.PI * 2 / total) * index - Math.PI / 2;
    const distance = (Math.min(10, Math.max(0, value)) / 10) * radius;
    const x = center + distance * Math.cos(angle);
    const y = center + distance * Math.sin(angle);
    return { x, y };
  };

  const radarPolygonPoints = radarCategories
    .map((cat, idx) => {
      const { x, y } = getCoordinates(cat.value, idx, radarCategories.length);
      return `${x},${y}`;
    })
    .join(' ');

  const gridLevels = [0.25, 0.5, 0.75, 1];

  const handleStatusChange = (newStatus: ScoutingStatus) => {
    updatePlayer(player.id, { status: newStatus });
  };

  const handleSaveRatings = () => {
    updatePlayer(player.id, { ratings: localRatings });
    setRatingsSavedSuccess(true);
    setTimeout(() => setRatingsSavedSuccess(false), 3000);
  };

  const handleSaveNotes = () => {
    updatePlayer(player.id, { notes: editedNotes });
    setNotesSavedSuccess(true);
    setTimeout(() => setNotesSavedSuccess(false), 3000);
  };

  const handleRatingChange = (key: keyof PlayerRatings, val: number) => {
    setLocalRatings((prev) => ({
      ...prev,
      [key]: val,
    }));
  };

  const statusOptions: ScoutingStatus[] = [
    'Prioritario',
    'Convocado',
    'Propuesto para convocatoria',
    'En seguimiento',
    'Pendiente de observar',
    'Nuevo',
    'En evaluación adicional',
    'No prioritario',
    'Archivado',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative flex flex-col w-full max-w-4xl max-h-[92vh] rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl overflow-hidden">
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-5 py-3.5">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded">
              {player.internalCode}
            </span>
            <span className="text-xs text-slate-400">
              Federación Interinsular de Fútbol de Las Palmas / FCF
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Player Profile Hero */}
        <div className="p-5 border-b border-slate-800 bg-gradient-to-r from-slate-900 via-slate-850 to-sky-950/60">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <img
              src={player.photoUrl}
              alt={player.sportsName}
              className="h-24 w-24 rounded-2xl object-cover border-2 border-amber-400/80 shadow-md"
            />
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                <h3 className="text-xl md:text-2xl font-black text-white">
                  {player.sportsName}
                </h3>
                <span className="text-sm font-bold text-slate-400">#{player.dorsal}</span>
                <span className="rounded bg-amber-400 text-slate-950 font-black px-2 py-0.5 text-xs">
                  {player.primaryPosition}
                </span>

                {/* Interactive Status Selector */}
                <div className="relative inline-block">
                  <select
                    value={player.status}
                    onChange={(e) => handleStatusChange(e.target.value as ScoutingStatus)}
                    className="rounded-full bg-slate-800 border border-amber-500/40 px-3 py-0.5 text-xs font-bold text-amber-300 focus:outline-none cursor-pointer"
                  >
                    {statusOptions.map((st) => (
                      <option key={st} value={st} className="bg-slate-900 text-slate-200">
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <p className="text-xs text-slate-300 font-medium">
                {player.firstName} {player.lastName} • {age} años ({player.birthDate})
              </p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-400 mt-2">
                <span className="flex items-center gap-1 text-slate-200">
                  <MapPin className="h-3.5 w-3.5 text-sky-400" />
                  {player.island} ({player.municipality})
                </span>
                <span>•</span>
                {isEditingQuickInfo ? (
                  <div className="flex items-center gap-2 bg-slate-800/80 p-1 rounded-lg border border-slate-700">
                    <span className="text-[11px] text-slate-300">Club:</span>
                    <input
                      type="text"
                      value={quickClub}
                      onChange={(e) => setQuickClub(e.target.value)}
                      className="rounded bg-slate-900 px-2 py-0.5 text-xs text-white border border-slate-600 w-32"
                    />
                    <span className="text-[11px] text-slate-300">Dorsal:</span>
                    <input
                      type="number"
                      value={quickDorsal}
                      onChange={(e) => setQuickDorsal(Number(e.target.value))}
                      className="rounded bg-slate-900 px-2 py-0.5 text-xs text-white border border-slate-600 w-14"
                    />
                    <button
                      onClick={() => {
                        updatePlayer(player.id, { currentClub: quickClub, dorsal: quickDorsal });
                        setIsEditingQuickInfo(false);
                      }}
                      className="rounded bg-emerald-500 px-2 py-0.5 text-xs font-bold text-slate-950 hover:bg-emerald-400"
                    >
                      Guardar
                    </button>
                    <button
                      onClick={() => setIsEditingQuickInfo(false)}
                      className="rounded bg-slate-700 px-2 py-0.5 text-xs text-slate-300 hover:text-white"
                    >
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <>
                    <span className="text-slate-200">
                      Club: <strong>{player.currentClub}</strong>
                      <button 
                        onClick={() => setIsEditingQuickInfo(true)} 
                        className="ml-1 text-slate-500 hover:text-amber-400 p-0.5"
                        title="Editar club y dorsal rápido"
                      >
                        <Edit3 className="h-3 w-3 inline" />
                      </button>
                    </span>
                    <span>•</span>
                    <span>Pie: <strong>{player.dominantFoot}</strong></span>
                    <span>•</span>
                    <span>Altura: <strong>{player.heightCm} cm</strong></span>
                  </>
                )}
              </div>
            </div>

            {/* Actions in Hero */}
            <div className="flex sm:flex-col gap-2">
              <button
                onClick={() => {
                  setEditingPlayer(player);
                }}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-sky-500/20 border border-sky-500/50 px-3 py-1.5 text-xs font-bold text-sky-300 hover:bg-sky-500/30 transition-all cursor-pointer shadow-sm"
                title="Editar todos los datos del jugador"
              >
                <Edit3 className="h-3.5 w-3.5" />
                <span>Editar Ficha</span>
              </button>

              <button
                onClick={onAddObservation}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-amber-500 px-3 py-1.5 text-xs font-bold text-slate-950 hover:bg-amber-400 transition-all cursor-pointer shadow-sm"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Observación</span>
              </button>

              {player.videoUrl && (
                <a
                  href={player.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-300 hover:text-sky-300 transition-colors"
                >
                  <Video className="h-3.5 w-3.5 text-sky-400" />
                  <span>Vídeo</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 px-5 gap-2 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('perfil')}
            className={`py-3 px-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'perfil' 
                ? 'border-amber-400 text-amber-300 font-bold' 
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Ficha Táctica & Radar
          </button>
          <button
            onClick={() => setActiveTab('metricas')}
            className={`py-3 px-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'metricas' 
                ? 'border-amber-400 text-amber-300 font-bold' 
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Valoraciones Actualizables (1-10)
          </button>
          <button
            onClick={() => setActiveTab('observaciones')}
            className={`py-3 px-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'observaciones' 
                ? 'border-amber-400 text-amber-300 font-bold' 
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Historial de Observaciones ({playerObs.length})
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {activeTab === 'perfil' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left: Radar Chart */}
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 flex flex-col items-center">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Star className="h-3.5 w-3.5 text-amber-400" />
                  <span>Perfil PAI / Radar de Atributos</span>
                </h4>
                <div className="relative">
                  <svg width={size} height={size} className="overflow-visible">
                    {/* Background Grid polygons */}
                    {gridLevels.map((lvl, lidx) => {
                      const pts = radarCategories
                        .map((_, idx) => {
                          const { x, y } = getCoordinates(10 * lvl, idx, radarCategories.length);
                          return `${x},${y}`;
                        })
                        .join(' ');
                      return (
                        <polygon
                          key={lidx}
                          points={pts}
                          fill="none"
                          stroke="#334155"
                          strokeWidth="1"
                          strokeDasharray={lvl < 1 ? '2,2' : undefined}
                        />
                      );
                    })}

                    {/* Radial axis lines */}
                    {radarCategories.map((_, idx) => {
                      const { x, y } = getCoordinates(10, idx, radarCategories.length);
                      return (
                        <line
                          key={idx}
                          x1={center}
                          y1={center}
                          x2={x}
                          y2={y}
                          stroke="#1e293b"
                          strokeWidth="1"
                        />
                      );
                    })}

                    {/* Value Polygon */}
                    <polygon
                      points={radarPolygonPoints}
                      fill="rgba(245, 158, 11, 0.35)"
                      stroke="#f59e0b"
                      strokeWidth="2"
                    />

                    {/* Value vertices dots */}
                    {radarCategories.map((cat, idx) => {
                      const { x, y } = getCoordinates(cat.value, idx, radarCategories.length);
                      return (
                        <circle
                          key={idx}
                          cx={x}
                          cy={y}
                          r="3.5"
                          fill="#fbbf24"
                          stroke="#78350f"
                          strokeWidth="1"
                        />
                      );
                    })}

                    {/* Labels */}
                    {radarCategories.map((cat, idx) => {
                      const { x, y } = getCoordinates(12.2, idx, radarCategories.length);
                      return (
                        <text
                          key={idx}
                          x={x}
                          y={y}
                          textAnchor="middle"
                          dominantBaseline="central"
                          fill="#94a3b8"
                          fontSize="9"
                          fontWeight="bold"
                        >
                          {cat.label} ({cat.value.toFixed(1)})
                        </text>
                      );
                    })}
                  </svg>
                </div>

                <div className="w-full mt-4 border-t border-slate-800 pt-3 text-xs text-slate-300 space-y-1">
                  <p><strong>Perfil Táctico:</strong> {player.tacticalProfile}</p>
                  <p><strong>Posiciones Secundarias:</strong> {player.secondaryPositions.join(', ') || 'Ninguna'}</p>
                </div>
              </div>

              {/* Right: Tactical Pitch & Editable Notes */}
              <div className="space-y-4">
                {/* Mini Field Position Visualizer */}
                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">
                    Ubicación en Terreno de Juego
                  </h4>
                  <div className="relative h-44 w-full rounded-lg bg-emerald-900/60 border border-emerald-600/50 p-2 flex items-center justify-center overflow-hidden">
                    {/* Pitch Markings */}
                    <div className="absolute inset-2 border border-emerald-400/40 rounded pointer-events-none" />
                    <div className="absolute top-2 bottom-2 left-1/2 -translate-x-1/2 w-[1px] bg-emerald-400/40 pointer-events-none" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-14 w-14 rounded-full border border-emerald-400/40 pointer-events-none" />
                    <div className="absolute top-1/2 left-2 -translate-y-1/2 h-20 w-10 border-r border-y border-emerald-400/40 pointer-events-none" />
                    <div className="absolute top-1/2 right-2 -translate-y-1/2 h-20 w-10 border-l border-y border-emerald-400/40 pointer-events-none" />

                    {/* Position Dot */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/40 ring-4 ring-amber-400/30 animate-pulse">
                        {player.primaryPosition}
                      </div>
                      <span className="mt-1 rounded bg-slate-950/90 px-2 py-0.5 text-[10px] font-bold text-amber-300">
                        {player.sportsName}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Editable Observer Notes */}
                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Observaciones y Criterio del Scout
                    </h4>
                    <button
                      onClick={handleSaveNotes}
                      className="flex items-center gap-1 rounded bg-amber-500 px-2 py-1 text-[11px] font-bold text-slate-950 hover:bg-amber-400 cursor-pointer"
                    >
                      <Save className="h-3 w-3" />
                      <span>Guardar Nota</span>
                    </button>
                  </div>

                  <textarea
                    rows={3}
                    value={editedNotes}
                    onChange={(e) => setEditedNotes(e.target.value)}
                    placeholder="Escribe comentarios de seguimiento técnico..."
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2 text-slate-200 text-xs focus:border-amber-400 focus:outline-none"
                  />

                  {notesSavedSuccess && (
                    <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                      <Check className="h-3 w-3" />
                      <span>Nota guardada correctamente en Supabase</span>
                    </p>
                  )}

                  <p className="text-[11px] text-slate-400 pt-1">
                    Scout asignado: <strong className="text-slate-200">{player.scoutResponsible}</strong>
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'metricas' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                <div>
                  <h4 className="font-bold text-amber-400 text-xs uppercase tracking-wider">
                    Actualización de Valoraciones Técnicas (Escala 1 al 10)
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Ajusta los sliders interactivos para actualizar el rendimiento del jugador y pulsa Guardar.
                  </p>
                </div>
                <button
                  onClick={handleSaveRatings}
                  className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400 shadow-md shadow-amber-500/20 cursor-pointer"
                >
                  <Save className="h-4 w-4" />
                  <span>Guardar Valoraciones Actualizadas</span>
                </button>
              </div>

              {ratingsSavedSuccess && (
                <div className="flex items-center gap-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 p-2.5 text-xs font-bold text-emerald-300 animate-in fade-in">
                  <CheckCircle className="h-4 w-4 text-emerald-400" />
                  <span>¡Valoraciones técnicas actualizadas y guardadas con éxito en Supabase!</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                {/* Technical (14 items) */}
                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-2">
                  <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
                    Características Técnicas
                  </h4>
                  <div className="space-y-2">
                    {[
                      ['Control Orientado', 'controlOrientado'],
                      ['Pase Corto', 'paseCorto'],
                      ['Pase Largo', 'paseLargo'],
                      ['Conducción', 'conduccion'],
                      ['Regate / 1vs1', 'regate'],
                      ['Finalización', 'finalizacion'],
                      ['Juego Aéreo', 'juegoAereo'],
                      ['Centros', 'centros'],
                      ['Golpeo', 'golpeo'],
                      ['Recuperación', 'recuperacion'],
                      ['Anticipación', 'anticipacion'],
                      ['Toma de Decisiones', 'tomaDecisiones'],
                      ['Visión de Juego', 'visionJuego'],
                      ['Posicionamiento', 'posicionamiento'],
                    ].map(([label, key]) => {
                      const val = localRatings[key as keyof PlayerRatings];
                      return (
                        <div key={key} className="space-y-1">
                          <div className="flex justify-between items-center text-slate-300">
                            <span>{label}</span>
                            <span className="font-bold text-amber-400">{val.toFixed(1)}</span>
                          </div>
                          <input
                            type="range"
                            min="1"
                            max="10"
                            step="0.1"
                            value={val}
                            onChange={(e) => handleRatingChange(key as keyof PlayerRatings, parseFloat(e.target.value))}
                            className="w-full accent-amber-400 cursor-pointer"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Physical & Tactical & Mental */}
                <div className="space-y-4">
                  {/* Physical */}
                  <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-2">
                    <h4 className="text-xs font-bold text-sky-400 uppercase tracking-wider mb-2">
                      Características Físicas
                    </h4>
                    <div className="space-y-2">
                      {[
                        ['Velocidad Punta', 'velocidad'],
                        ['Aceleración', 'aceleracion'],
                        ['Resistencia Aeróbica', 'resistencia'],
                        ['Fuerza / Duelo', 'fuerza'],
                        ['Agilidad', 'agilidad'],
                        ['Salto', 'salto'],
                      ].map(([label, key]) => {
                        const val = localRatings[key as keyof PlayerRatings];
                        return (
                          <div key={key} className="space-y-1">
                            <div className="flex justify-between items-center text-slate-300">
                              <span>{label}</span>
                              <span className="font-bold text-sky-400">{val.toFixed(1)}</span>
                            </div>
                            <input
                              type="range"
                              min="1"
                              max="10"
                              step="0.1"
                              value={val}
                              onChange={(e) => handleRatingChange(key as keyof PlayerRatings, parseFloat(e.target.value))}
                              className="w-full accent-sky-400 cursor-pointer"
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Mental */}
                  <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-2">
                    <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-2">
                      Capacidades Mentales y Competitivas
                    </h4>
                    <div className="space-y-2">
                      {[
                        ['Liderazgo', 'liderazgo'],
                        ['Concentración', 'concentracion'],
                        ['Personalidad Competitiva', 'personalidadCompetitiva'],
                        ['Trabajo en Equipo', 'trabajoEquipo'],
                      ].map(([label, key]) => {
                        const val = localRatings[key as keyof PlayerRatings];
                        return (
                          <div key={key} className="space-y-1">
                            <div className="flex justify-between items-center text-slate-300">
                              <span>{label}</span>
                              <span className="font-bold text-purple-400">{val.toFixed(1)}</span>
                            </div>
                            <input
                              type="range"
                              min="1"
                              max="10"
                              step="0.1"
                              value={val}
                              onChange={(e) => handleRatingChange(key as keyof PlayerRatings, parseFloat(e.target.value))}
                              className="w-full accent-purple-400 cursor-pointer"
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'observaciones' && (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <p className="text-slate-400">
                  Histórico de partidos observados en vivo por los seleccionadores y scouts de la FIFLP.
                </p>
                <button
                  onClick={onAddObservation}
                  className="rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-bold text-slate-950 hover:bg-amber-400 cursor-pointer"
                >
                  + Registrar Nueva Observación
                </button>
              </div>

              {playerObs.length === 0 ? (
                <div className="p-8 text-center border border-slate-800 rounded-xl bg-slate-950/40 text-slate-500">
                  No hay observaciones registradas para este futbolista aún.
                </div>
              ) : (
                playerObs.map((obs) => (
                  <div
                    key={obs.id}
                    className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2">
                      <div>
                        <span className="font-bold text-white text-sm">{obs.match}</span>
                        <p className="text-[11px] text-slate-400">
                          {obs.competition} • {obs.matchday} • {obs.stadium} ({obs.date})
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400 font-semibold">Nota Técnica:</span>
                        <span className="rounded-full bg-amber-500/20 text-amber-300 px-2 py-0.5 text-xs font-black">
                          {obs.ratingTecnica} / 10
                        </span>
                      </div>
                    </div>

                    <p className="text-slate-300 leading-relaxed italic bg-slate-900/60 p-2.5 rounded border border-slate-800">
                      "{obs.comments}"
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <span className="text-[11px] font-bold text-emerald-400 uppercase">Puntos Fuertes:</span>
                        <ul className="list-disc list-inside text-slate-300 space-y-0.5 mt-1">
                          {obs.strengths.map((s, i) => (
                            <li key={i}>{s}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <span className="text-[11px] font-bold text-amber-400 uppercase">Aspectos a Mejorar:</span>
                        <ul className="list-disc list-inside text-slate-300 space-y-0.5 mt-1">
                          {obs.improvements.map((imp, i) => (
                            <li key={i}>{imp}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
                      <span>Observador: <strong className="text-slate-200">{obs.observerName}</strong></span>
                      <span>Próxima acción: <strong className="text-amber-400">{obs.nextAction}</strong></span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
