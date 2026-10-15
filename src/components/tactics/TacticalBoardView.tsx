import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronRight, 
  ChevronLeft, 
  Plus, 
  Save, 
  Trash2, 
  Move, 
  ArrowRight, 
  Type, 
  Square, 
  Circle, 
  Download, 
  Maximize2,
  Users,
  Flame,
  HelpCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { 
  TacticalPlay, 
  TacticalPhase, 
  TacticalToken, 
  TacticalDrawing 
} from '../../types';

export const TacticalBoardView: React.FC = () => {
  const { tacticalPlays, saveTacticalPlay, deleteTacticalPlay } = useApp();

  const [currentPlay, setCurrentPlay] = useState<TacticalPlay>(
    tacticalPlays[0] || {
      id: 'play-custom-' + Date.now(),
      title: 'Nueva Jugada Ensayada',
      category: 'Falta lateral larga',
      description: 'Estrategia personalizada de las Selecciones Canarias',
      author: 'David Sousa',
      team: 'Selección Canaria Sub-16',
      pitchOrientation: 'horizontal',
      pitchView: 'half',
      createdAt: new Date().toISOString().split('T')[0],
      tags: ['Personalizada'],
      phases: [
        {
          id: 'phase-1',
          name: 'Fase 1: Inicial',
          description: 'Colocación de atacantes y defensores',
          durationSeconds: 3,
          tokens: [
            { id: 't1', team: 'canarias', number: 10, label: 'Lanzador', x: 25, y: 80, color: '#facc15' },
            { id: 't2', team: 'canarias', number: 8, label: 'Atacante 1', x: 45, y: 50, color: '#facc15' },
            { id: 't3', team: 'canarias', number: 9, label: 'Atacante 2', x: 55, y: 40, color: '#facc15' },
            { id: 'r1', team: 'rival', number: 1, label: 'Portero', x: 60, y: 15, color: '#ef4444' },
            { id: 'r2', team: 'rival', number: 4, label: 'Defensa', x: 50, y: 35, color: '#ef4444' },
            { id: 'ball', team: 'ball', number: 0, label: '⚽', x: 26, y: 78, color: '#ffffff' },
          ],
          drawings: [],
        },
      ],
    }
  );

  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const activePhase = currentPlay.phases[currentPhaseIndex] || currentPlay.phases[0];

  // Active Tool: 'select' | 'arrow' | 'dashed' | 'curve' | 'pass' | 'zone' | 'circle' | 'text'
  const [activeTool, setActiveTool] = useState<string>('select');
  const [selectedTokenId, setSelectedTokenId] = useState<string | null>(null);

  // Animation state
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackProgress, setPlaybackProgress] = useState(0); // 0 to 100 within current phase
  const pitchRef = useRef<HTMLDivElement>(null);

  // Dragging state
  const [draggingTokenId, setDraggingTokenId] = useState<string | null>(null);

  // Drawing state
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPoints, setCurrentPoints] = useState<{ x: number; y: number }[]>([]);

  // Animation loop
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setPlaybackProgress((prev) => {
          if (prev >= 100) {
            // Next phase or loop
            if (currentPhaseIndex < currentPlay.phases.length - 1) {
              setCurrentPhaseIndex(currentPhaseIndex + 1);
              return 0;
            } else {
              setIsPlaying(false);
              return 0;
            }
          }
          return prev + 4;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentPhaseIndex, currentPlay.phases.length]);

  // Handle Token Drag
  const handleMouseDownToken = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (activeTool === 'select') {
      setDraggingTokenId(id);
      setSelectedTokenId(id);
    }
  };

  const handleMouseMovePitch = (e: React.MouseEvent) => {
    if (!pitchRef.current) return;
    const rect = pitchRef.current.getBoundingClientRect();
    const x = Math.min(100, Math.max(0, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.min(100, Math.max(0, ((e.clientY - rect.top) / rect.height) * 100));

    if (draggingTokenId) {
      // Update token position in current phase
      const updatedTokens = activePhase.tokens.map((t) =>
        t.id === draggingTokenId ? { ...t, x: Math.round(x), y: Math.round(y) } : t
      );
      updateCurrentPhaseTokens(updatedTokens);
    } else if (isDrawing && activeTool !== 'select') {
      setCurrentPoints((prev) => [...prev, { x, y }]);
    }
  };

  const handleMouseUpPitch = () => {
    setDraggingTokenId(null);

    if (isDrawing && currentPoints.length > 1) {
      const typeMap: Record<string, TacticalDrawing['type']> = {
        arrow: 'straight-arrow',
        dashed: 'dashed-arrow',
        curve: 'curved-arrow',
        pass: 'pass-line',
        zone: 'zone-box',
        circle: 'influence-circle',
        text: 'text-note',
      };

      const newDrawing: TacticalDrawing = {
        id: 'dr-' + Date.now(),
        type: typeMap[activeTool] || 'straight-arrow',
        points: currentPoints,
        color: activeTool === 'pass' ? '#38bdf8' : activeTool === 'zone' ? 'rgba(59, 130, 246, 0.25)' : '#facc15',
        strokeWidth: activeTool === 'pass' ? 4 : 3,
        text: activeTool === 'text' ? 'Ataque 1er Palo' : undefined,
      };

      const updatedDrawings = [...activePhase.drawings, newDrawing];
      updateCurrentPhaseDrawings(updatedDrawings);
    }

    setIsDrawing(false);
    setCurrentPoints([]);
  };

  const handleMouseDownPitch = (e: React.MouseEvent) => {
    if (activeTool !== 'select') {
      if (!pitchRef.current) return;
      const rect = pitchRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setIsDrawing(true);
      setCurrentPoints([{ x, y }]);
    }
  };

  const updateCurrentPhaseTokens = (newTokens: TacticalToken[]) => {
    const updatedPhases = currentPlay.phases.map((ph, idx) =>
      idx === currentPhaseIndex ? { ...ph, tokens: newTokens } : ph
    );
    const updated = { ...currentPlay, phases: updatedPhases };
    setCurrentPlay(updated);
    saveTacticalPlay(updated);
  };

  const updateCurrentPhaseDrawings = (newDrawings: TacticalDrawing[]) => {
    const updatedPhases = currentPlay.phases.map((ph, idx) =>
      idx === currentPhaseIndex ? { ...ph, drawings: newDrawings } : ph
    );
    const updated = { ...currentPlay, phases: updatedPhases };
    setCurrentPlay(updated);
    saveTacticalPlay(updated);
  };

  // Add new token
  const addToken = (team: 'canarias' | 'rival' | 'ball') => {
    const nextNum = activePhase.tokens.filter((t) => t.team === team).length + 1;
    const newToken: TacticalToken = {
      id: 'tk-' + Date.now(),
      team,
      number: team === 'ball' ? 0 : nextNum,
      label: team === 'ball' ? '⚽' : team === 'canarias' ? `J${nextNum}` : `R${nextNum}`,
      x: 50,
      y: 50,
      color: team === 'canarias' ? '#facc15' : team === 'rival' ? '#ef4444' : '#ffffff',
    };
    updateCurrentPhaseTokens([...activePhase.tokens, newToken]);
  };

  // Add phase
  const handleAddPhase = () => {
    const nextIndex = currentPlay.phases.length + 1;
    const newPhase: TacticalPhase = {
      id: 'phase-' + Date.now(),
      name: `Fase ${nextIndex}: Continuación`,
      description: 'Secuencia de movimiento',
      durationSeconds: 3,
      tokens: JSON.parse(JSON.stringify(activePhase.tokens)), // duplicate positions
      drawings: [],
    };
    const updated = { ...currentPlay, phases: [...currentPlay.phases, newPhase] };
    setCurrentPlay(updated);
    saveTacticalPlay(updated);
    setCurrentPhaseIndex(currentPlay.phases.length);
  };

  // Clear drawings in phase
  const handleClearDrawings = () => {
    updateCurrentPhaseDrawings([]);
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Top Controls / Play Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex items-center gap-1.5 rounded-full bg-amber-500/20 px-2.5 py-0.5 text-xs font-bold text-amber-400 border border-amber-500/30">
              <Flame className="h-3.5 w-3.5" />
              Pizarra Táctica Interactiva & Jugadas Ensayadas
            </span>
            <span className="text-xs text-slate-400">Coordenadas Normalizadas (0-100%)</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span>{currentPlay.title}</span>
            <span className="text-xs font-bold text-slate-400">({currentPlay.category})</span>
          </h2>
          <p className="text-xs text-slate-300">
            {currentPlay.description}
          </p>
        </div>

        {/* Tactical Play Selector */}
        <div className="flex items-center gap-2">
          <select
            value={currentPlay.id}
            onChange={(e) => {
              const selected = tacticalPlays.find((p) => p.id === e.target.value);
              if (selected) {
                setCurrentPlay(selected);
                setCurrentPhaseIndex(0);
              }
            }}
            className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-semibold text-white"
          >
            {tacticalPlays.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title} ({p.category})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Board Container */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Left / Top Tools Palette (FC Tactix Style - Image 4 reference) */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/95 p-4 space-y-4">
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">
              Herramientas de Dibujo
            </h4>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { id: 'select', label: 'Mover Ficha', icon: Move },
                { id: 'arrow', label: 'Flecha Recta', icon: ArrowRight },
                { id: 'dashed', label: 'Desmarque', icon: ArrowRight, desc: 'Línea de puntos' },
                { id: 'curve', label: 'Trayectoria', icon: ArrowRight, desc: 'Curvada' },
                { id: 'pass', label: 'Pase Balón', icon: ArrowRight, desc: 'Azul intenso' },
                { id: 'zone', label: 'Zona / Cuadro', icon: Square },
                { id: 'circle', label: 'Círculo Influencia', icon: Circle },
                { id: 'text', label: 'Instrucción', icon: Type },
              ].map((tool) => {
                const Icon = tool.icon;
                const isCurrent = activeTool === tool.id;
                return (
                  <button
                    key={tool.id}
                    onClick={() => setActiveTool(tool.id)}
                    className={`flex items-center gap-2 p-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-amber-400 text-slate-950 font-bold shadow-md'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{tool.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Player Token Injector */}
          <div className="border-t border-slate-800 pt-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">
              Añadir Fichas al Campo
            </h4>
            <div className="space-y-2">
              <button
                onClick={() => addToken('canarias')}
                className="w-full flex items-center justify-between rounded-xl bg-amber-500/20 border border-amber-500/40 px-3 py-2 text-xs font-bold text-amber-300 hover:bg-amber-500/30 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black flex items-center justify-center">
                    C
                  </div>
                  <span>Jugador Canarias (Amarillo)</span>
                </div>
                <Plus className="h-3.5 w-3.5" />
              </button>

              <button
                onClick={() => addToken('rival')}
                className="w-full flex items-center justify-between rounded-xl bg-red-500/20 border border-red-500/40 px-3 py-2 text-xs font-bold text-red-300 hover:bg-red-500/30 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center">
                    R
                  </div>
                  <span>Rival (Rojo)</span>
                </div>
                <Plus className="h-3.5 w-3.5" />
              </button>

              <button
                onClick={() => addToken('ball')}
                className="w-full flex items-center justify-between rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-xs font-bold text-slate-200 hover:bg-slate-700 transition-colors"
              >
                <span>Añadir Balón (⚽)</span>
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Phase Management */}
          <div className="border-t border-slate-800 pt-3 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Fases de la Jugada ({currentPlay.phases.length})
              </h4>
              <button
                onClick={handleAddPhase}
                className="text-[11px] text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1"
              >
                <Plus className="h-3 w-3" />
                <span>Nueva Fase</span>
              </button>
            </div>

            <div className="space-y-1.5 max-h-40 overflow-y-auto">
              {currentPlay.phases.map((phase, idx) => (
                <button
                  key={phase.id}
                  onClick={() => {
                    setCurrentPhaseIndex(idx);
                    setIsPlaying(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer ${
                    currentPhaseIndex === idx
                      ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 font-bold'
                      : 'bg-slate-800/80 text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <span className="truncate">{phase.name}</span>
                  <span className="text-[10px] opacity-75">{phase.tokens.length} fichas</span>
                </button>
              ))}
            </div>

            <button
              onClick={handleClearDrawings}
              className="w-full rounded-lg border border-slate-700 py-1.5 text-[11px] text-slate-400 hover:text-red-400 hover:border-red-400/40 transition-colors"
            >
              Borrar trazos de esta fase
            </button>
          </div>
        </div>

        {/* Center / Right: The Interactive Scalable Pitch (Images 2 & 4 reference) */}
        <div className="lg:col-span-3 space-y-3">
          {/* Pitch Top Bar: Animation Controls & Scoreboard style */}
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5">
            {/* Match simulation clock style */}
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-slate-950 px-2.5 py-1 text-xs font-mono font-bold text-amber-400 border border-slate-800">
                FASE {currentPhaseIndex + 1} / {currentPlay.phases.length}
              </div>
              <span className="text-xs font-semibold text-white truncate">
                {activePhase.name}
              </span>
            </div>

            {/* Play / Step Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (currentPhaseIndex > 0) setCurrentPhaseIndex(currentPhaseIndex - 1);
                }}
                disabled={currentPhaseIndex === 0}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-300 disabled:opacity-30 hover:bg-slate-700 transition-colors"
                title="Fase anterior"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  isPlaying 
                    ? 'bg-amber-400 text-slate-950' 
                    : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
                }`}
              >
                {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                <span>{isPlaying ? 'Pausar' : 'Reproducir Secuencia'}</span>
              </button>

              <button
                onClick={() => {
                  if (currentPhaseIndex < currentPlay.phases.length - 1) {
                    setCurrentPhaseIndex(currentPhaseIndex + 1);
                  }
                }}
                disabled={currentPhaseIndex === currentPlay.phases.length - 1}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-300 disabled:opacity-30 hover:bg-slate-700 transition-colors"
                title="Siguiente fase"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Football Pitch Canvas Container */}
          <div
            ref={pitchRef}
            onMouseMove={handleMouseMovePitch}
            onMouseUp={handleMouseUpPitch}
            onMouseDown={handleMouseDownPitch}
            className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-2xl bg-gradient-to-b from-emerald-800 via-emerald-700 to-emerald-800 border-4 border-slate-700 shadow-2xl overflow-hidden cursor-crosshair select-none"
          >
            {/* Field Stripes Texture */}
            <div className="absolute inset-0 flex pointer-events-none opacity-20">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 h-full ${i % 2 === 0 ? 'bg-emerald-950' : 'bg-transparent'}`}
                />
              ))}
            </div>

            {/* SVG Pitch Markings (Scalable Vector Half/Full Pitch) */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              {/* Outer boundary */}
              <rect x="4" y="4" width="92" height="92" fill="none" stroke="#ffffff" strokeWidth="0.8" strokeOpacity="0.8" />
              
              {/* Midfield line (if half pitch, this is bottom/top boundary) */}
              <line x1="4" y1="50" x2="96" y2="50" stroke="#ffffff" strokeWidth="0.8" strokeOpacity="0.8" />
              <circle cx="50" cy="50" r="12" fill="none" stroke="#ffffff" strokeWidth="0.8" strokeOpacity="0.8" />
              <circle cx="50" cy="50" r="0.8" fill="#ffffff" />

              {/* Goal Area 1 (Top) */}
              <rect x="35" y="4" width="30" height="16" fill="none" stroke="#ffffff" strokeWidth="0.8" strokeOpacity="0.8" />
              <rect x="42" y="4" width="16" height="6" fill="none" stroke="#ffffff" strokeWidth="0.8" strokeOpacity="0.8" />
              <circle cx="50" cy="14" r="0.8" fill="#ffffff" />
              {/* Penalty Arc Top */}
              <path d="M 40 20 A 10 10 0 0 0 60 20" fill="none" stroke="#ffffff" strokeWidth="0.8" strokeOpacity="0.8" />

              {/* Goal Area 2 (Bottom) */}
              <rect x="35" y="80" width="30" height="16" fill="none" stroke="#ffffff" strokeWidth="0.8" strokeOpacity="0.8" />
              <rect x="42" y="90" width="16" height="6" fill="none" stroke="#ffffff" strokeWidth="0.8" strokeOpacity="0.8" />
              <circle cx="50" cy="86" r="0.8" fill="#ffffff" />
              {/* Penalty Arc Bottom */}
              <path d="M 40 80 A 10 10 0 0 1 60 80" fill="none" stroke="#ffffff" strokeWidth="0.8" strokeOpacity="0.8" />

              {/* Corner Arcs */}
              <path d="M 4 8 A 4 4 0 0 0 8 4" fill="none" stroke="#ffffff" strokeWidth="0.8" />
              <path d="M 92 4 A 4 4 0 0 0 96 8" fill="none" stroke="#ffffff" strokeWidth="0.8" />
              <path d="M 4 92 A 4 4 0 0 0 8 96" fill="none" stroke="#ffffff" strokeWidth="0.8" />
              <path d="M 96 92 A 4 4 0 0 0 92 96" fill="none" stroke="#ffffff" strokeWidth="0.8" />

              {/* Existing Drawings in Phase */}
              {activePhase.drawings.map((dr) => {
                if (dr.type === 'zone-box' && dr.points.length >= 2) {
                  const p1 = dr.points[0];
                  const p2 = dr.points[dr.points.length - 1];
                  return (
                    <g key={dr.id}>
                      <rect
                        x={Math.min(p1.x, p2.x)}
                        y={Math.min(p1.y, p2.y)}
                        width={Math.abs(p2.x - p1.x)}
                        height={Math.abs(p2.y - p1.y)}
                        fill={dr.color}
                        stroke="#38bdf8"
                        strokeWidth="0.5"
                        strokeDasharray="2,2"
                        rx="1"
                      />
                      {dr.text && (
                        <text
                          x={(p1.x + p2.x) / 2}
                          y={(p1.y + p2.y) / 2}
                          fill="#ffffff"
                          fontSize="2.5"
                          textAnchor="middle"
                          fontWeight="bold"
                        >
                          {dr.text}
                        </text>
                      )}
                    </g>
                  );
                }

                if (dr.type === 'influence-circle' && dr.points.length >= 1) {
                  const center = dr.points[0];
                  return (
                    <circle
                      key={dr.id}
                      cx={center.x}
                      cy={center.y}
                      r="8"
                      fill={dr.color}
                      stroke="#ef4444"
                      strokeWidth="0.5"
                      strokeDasharray="2,2"
                    />
                  );
                }

                // Render Arrows / Lines
                const pointsStr = dr.points.map((p) => `${p.x},${p.y}`).join(' ');
                return (
                  <g key={dr.id}>
                    <polyline
                      points={pointsStr}
                      fill="none"
                      stroke={dr.color}
                      strokeWidth={dr.strokeWidth * 0.3}
                      strokeDasharray={dr.type === 'dashed-arrow' ? '1.5,1.5' : undefined}
                      strokeLinecap="round"
                    />
                    {/* Arrow head */}
                    {dr.points.length >= 2 && (
                      <circle
                        cx={dr.points[dr.points.length - 1].x}
                        cy={dr.points[dr.points.length - 1].y}
                        r="1"
                        fill={dr.color}
                      />
                    )}
                  </g>
                );
              })}

              {/* Current Drawing in progress */}
              {isDrawing && currentPoints.length > 1 && (
                <polyline
                  points={currentPoints.map((p) => `${p.x},${p.y}`).join(' ')}
                  fill="none"
                  stroke="#facc15"
                  strokeWidth="1"
                  strokeDasharray="2,2"
                />
              )}
            </svg>

            {/* Draggable Player Tokens */}
            {activePhase.tokens.map((token) => (
              <div
                key={token.id}
                onMouseDown={(e) => handleMouseDownToken(e, token.id)}
                style={{
                  left: `${token.x}%`,
                  top: `${token.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                className={`absolute z-20 flex flex-col items-center justify-center cursor-grab active:cursor-grabbing transition-transform duration-75 hover:scale-110 ${
                  selectedTokenId === token.id ? 'ring-2 ring-white ring-offset-2 ring-offset-emerald-900' : ''
                }`}
              >
                {token.team === 'ball' ? (
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-base shadow-lg animate-bounce">
                    ⚽
                  </div>
                ) : (
                  <div
                    style={{ backgroundColor: token.color }}
                    className={`flex h-8 w-8 items-center justify-center rounded-full shadow-lg border-2 ${
                      token.team === 'canarias' 
                        ? 'border-sky-950 text-slate-950 font-black' 
                        : 'border-white text-white font-bold'
                    } text-xs`}
                  >
                    {token.number}
                  </div>
                )}
                <span className="mt-0.5 rounded bg-slate-950/80 px-1 py-0.2 text-[9px] font-bold text-white shadow pointer-events-none whitespace-nowrap">
                  {token.label}
                </span>
              </div>
            ))}
          </div>

          {/* Coaching Instructions & Description footer */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4 text-xs space-y-2">
            <h4 className="font-bold text-amber-400 uppercase tracking-wider text-[11px]">
              Directrices del Cuerpo Técnico para {activePhase.name}
            </h4>
            <p className="text-slate-300 leading-relaxed">
              {activePhase.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
