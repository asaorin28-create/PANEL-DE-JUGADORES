import React, { useState } from 'react';
import { 
  LayoutGrid, 
  Download, 
  RotateCcw, 
  Shield, 
  Users, 
  AlertTriangle, 
  Check, 
  Printer, 
  Award,
  Sparkles,
  UserCheck,
  X,
  Search
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { Player, PlayerPosition } from '../../types';

interface PitchSlot {
  id: string;
  slotPosition: PlayerPosition;
  defaultX: number; // 0-100
  defaultY: number; // 0-100
  player?: Player;
  isCaptain?: boolean;
}

export const LineupBuilderView: React.FC = () => {
  const { players, callUps } = useApp();

  const [formation, setFormation] = useState<'4-3-3' | '4-2-3-1' | '4-4-2' | '3-5-2'>('4-3-3');
  const [teamTitle, setTeamTitle] = useState('Selección Canaria Sub-16 Masculina');
  const [matchContext, setMatchContext] = useState('Campeonato de España de Selecciones Autonómicas (Fase 1)');

  // Player selector modal for a specific slot
  const [selectingSlotIdx, setSelectingSlotIdx] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Formations definitions with normalized pitch coordinates
  const FORMATIONS_MAP: Record<string, { role: PlayerPosition; x: number; y: number }[]> = {
    '4-3-3': [
      { role: 'POR', x: 50, y: 88 },
      { role: 'LD', x: 84, y: 70 },
      { role: 'DFC', x: 62, y: 72 },
      { role: 'DFC', x: 38, y: 72 },
      { role: 'LI', x: 16, y: 70 },
      { role: 'MCD', x: 50, y: 55 },
      { role: 'MC', x: 65, y: 44 },
      { role: 'MCO', x: 35, y: 44 },
      { role: 'ED', x: 82, y: 25 },
      { role: 'DC', x: 50, y: 20 },
      { role: 'EI', x: 18, y: 25 },
    ],
    '4-2-3-1': [
      { role: 'POR', x: 50, y: 88 },
      { role: 'LD', x: 84, y: 72 },
      { role: 'DFC', x: 62, y: 74 },
      { role: 'DFC', x: 38, y: 74 },
      { role: 'LI', x: 16, y: 72 },
      { role: 'MCD', x: 60, y: 56 },
      { role: 'MCD', x: 40, y: 56 },
      { role: 'ED', x: 80, y: 38 },
      { role: 'MCO', x: 50, y: 38 },
      { role: 'EI', x: 20, y: 38 },
      { role: 'DC', x: 50, y: 20 },
    ],
    '4-4-2': [
      { role: 'POR', x: 50, y: 88 },
      { role: 'LD', x: 84, y: 72 },
      { role: 'DFC', x: 62, y: 74 },
      { role: 'DFC', x: 38, y: 74 },
      { role: 'LI', x: 16, y: 72 },
      { role: 'ED', x: 82, y: 50 },
      { role: 'MC', x: 60, y: 50 },
      { role: 'MC', x: 40, y: 50 },
      { role: 'EI', x: 18, y: 50 },
      { role: 'DC', x: 60, y: 22 },
      { role: 'DC', x: 40, y: 22 },
    ],
    '3-5-2': [
      { role: 'POR', x: 50, y: 88 },
      { role: 'DFC', x: 70, y: 74 },
      { role: 'DFC', x: 50, y: 76 },
      { role: 'DFC', x: 30, y: 74 },
      { role: 'CAD', x: 86, y: 50 },
      { role: 'MCD', x: 50, y: 58 },
      { role: 'MC', x: 65, y: 46 },
      { role: 'MC', x: 35, y: 46 },
      { role: 'CAI', x: 14, y: 50 },
      { role: 'DC', x: 60, y: 22 },
      { role: 'DC', x: 40, y: 22 },
    ],
  };

  // Build current starters slots
  const [starterSlots, setStarterSlots] = useState<PitchSlot[]>(() => {
    const coords = FORMATIONS_MAP['4-3-3'];
    return coords.map((c, i) => {
      const candidate = players.find(p => p.primaryPosition === c.role);
      return {
        id: `slot-${i}`,
        slotPosition: c.role,
        defaultX: c.x,
        defaultY: c.y,
        player: candidate || players[i % players.length],
        isCaptain: i === 2,
      };
    });
  });

  // Change formation
  const handleFormationChange = (newFmt: '4-3-3' | '4-2-3-1' | '4-4-2' | '3-5-2') => {
    setFormation(newFmt);
    const coords = FORMATIONS_MAP[newFmt];
    setStarterSlots((prev) =>
      coords.map((c, i) => ({
        id: `slot-${i}`,
        slotPosition: c.role,
        defaultX: c.x,
        defaultY: c.y,
        player: prev[i]?.player || players[i % players.length],
        isCaptain: prev[i]?.isCaptain,
      }))
    );
  };

  const handleAssignPlayerToSlot = (slotIndex: number, player: Player) => {
    setStarterSlots((prev) =>
      prev.map((s, idx) => (idx === slotIndex ? { ...s, player } : s))
    );
    setSelectingSlotIdx(null);
  };

  const toggleCaptain = (slotIndex: number) => {
    setStarterSlots((prev) =>
      prev.map((s, idx) => ({ ...s, isCaptain: idx === slotIndex }))
    );
  };

  // Synchronize player data in slots with the latest players from context
  React.useEffect(() => {
    setStarterSlots((prev) =>
      prev.map((s) => {
        if (!s.player) return s;
        const fresh = players.find((p) => p.id === s.player!.id);
        return fresh ? { ...s, player: fresh } : s;
      })
    );
  }, [players]);

  const handlePrint = () => {
    window.print();
  };

  const activeSlot = selectingSlotIdx !== null ? starterSlots[selectingSlotIdx] : null;

  return (
    <div className="space-y-4 pb-12">
      {/* Top Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex items-center gap-1.5 rounded-full bg-amber-500/20 px-2.5 py-0.5 text-xs font-bold text-amber-400 border border-amber-500/30">
              <LayoutGrid className="h-3.5 w-3.5" />
              Alineación Oficial de la Selección
            </span>
            <span className="text-xs text-slate-400">Haz clic en cualquier posición del campo para cambiar de jugador</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
            Constructor Visual de Once Inicial
          </h2>
          <p className="text-xs text-slate-400">
            {teamTitle} • {matchContext}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Formation Presets */}
          <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700">
            {(['4-3-3', '4-2-3-1', '4-4-2', '3-5-2'] as const).map((fmt) => (
              <button
                key={fmt}
                onClick={() => handleFormationChange(fmt)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  formation === fmt
                    ? 'bg-amber-400 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {fmt}
              </button>
            ))}
          </div>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-all cursor-pointer"
          >
            <Printer className="h-3.5 w-3.5 text-sky-400" />
            <span>Imprimir Ficha Oficial</span>
          </button>
        </div>
      </div>

      {/* Main Pitch & Squad Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: The Visual Pitch */}
        <div className="lg:col-span-2 space-y-3">
          <div className="relative w-full aspect-[4/3] rounded-2xl bg-gradient-to-b from-emerald-800 via-emerald-700 to-emerald-800 border-4 border-slate-700 shadow-2xl overflow-hidden p-4 select-none">
            {/* Field Stripes */}
            <div className="absolute inset-0 flex pointer-events-none opacity-20">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-full h-full ${i % 2 === 0 ? 'bg-emerald-950' : 'bg-transparent'}`}
                />
              ))}
            </div>

            {/* SVG Markings */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <rect x="4" y="4" width="92" height="92" fill="none" stroke="#ffffff" strokeWidth="0.8" strokeOpacity="0.8" />
              <line x1="4" y1="50" x2="96" y2="50" stroke="#ffffff" strokeWidth="0.8" strokeOpacity="0.8" />
              <circle cx="50" cy="50" r="12" fill="none" stroke="#ffffff" strokeWidth="0.8" strokeOpacity="0.8" />
              {/* Areas */}
              <rect x="30" y="4" width="40" height="16" fill="none" stroke="#ffffff" strokeWidth="0.8" strokeOpacity="0.8" />
              <rect x="30" y="80" width="40" height="16" fill="none" stroke="#ffffff" strokeWidth="0.8" strokeOpacity="0.8" />
            </svg>

            {/* Starting 11 Tokens on pitch */}
            {starterSlots.map((slot, index) => {
              const p = slot.player;
              const isMatchPosition = p && (p.primaryPosition === slot.slotPosition || p.secondaryPositions.includes(slot.slotPosition));

              return (
                <div
                  key={slot.id}
                  onClick={() => setSelectingSlotIdx(index)}
                  style={{
                    left: `${slot.defaultX}%`,
                    top: `${slot.defaultY}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  className="absolute z-20 flex flex-col items-center group cursor-pointer"
                  title="Haz clic para cambiar este jugador"
                >
                  {/* Token circle */}
                  <div className="relative">
                    <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-xl border-2 border-sky-950 group-hover:scale-110 group-hover:ring-4 group-hover:ring-amber-300/40 transition-all">
                      {p?.dorsal || index + 1}
                    </div>

                    {/* Captain Badge */}
                    {slot.isCaptain && (
                      <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[9px] font-black text-white shadow ring-1 ring-white">
                        C
                      </span>
                    )}

                    {/* Warning if out of position */}
                    {!isMatchPosition && p && (
                      <span 
                        title={`Posición no natural (${p.primaryPosition} jugando de ${slot.slotPosition})`}
                        className="absolute -bottom-1 -left-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-600 text-[9px] font-bold text-white shadow ring-1 ring-white"
                      >
                        !
                      </span>
                    )}
                  </div>

                  {/* Name Tag */}
                  <div className="mt-1 flex flex-col items-center">
                    <span className="rounded bg-slate-950/90 px-1.5 py-0.5 text-[10px] font-bold text-white shadow whitespace-nowrap group-hover:text-amber-300">
                      {p?.sportsName || `Posición ${slot.slotPosition}`}
                    </span>
                    <span className="text-[9px] font-bold text-amber-300 uppercase tracking-wider">
                      {slot.slotPosition}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1 Col: Starter Roster Checklist & Substitutes */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 shadow-lg space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Users className="h-4 w-4 text-amber-400" />
                <span>Titulares ({starterSlots.length})</span>
              </h3>
              <span className="text-xs font-mono font-bold text-sky-400">{formation}</span>
            </div>

            <div className="space-y-1.5 max-h-80 overflow-y-auto pr-1">
              {starterSlots.map((slot, idx) => (
                <div
                  key={slot.id}
                  className="flex items-center justify-between p-2 rounded-xl border border-slate-800 bg-slate-800/40 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-amber-400 text-slate-950 font-black px-1.5 py-0.5 text-[10px]">
                      {slot.slotPosition}
                    </span>
                    <div>
                      <p className="font-bold text-white">{slot.player?.sportsName}</p>
                      <p className="text-[10px] text-slate-400">{slot.player?.currentClub}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setSelectingSlotIdx(idx)}
                      className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-700 text-slate-300 hover:text-white hover:bg-slate-600 transition-colors cursor-pointer"
                    >
                      Cambiar
                    </button>
                    <button
                      onClick={() => toggleCaptain(idx)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors cursor-pointer ${
                        slot.isCaptain
                          ? 'bg-red-500 text-white'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                      title="Asignar brazalete de capitán"
                    >
                      {slot.isCaptain ? 'Capitán ©' : 'Hacer C'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Substitutes Bench */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 shadow-lg space-y-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Users className="h-4 w-4 text-sky-400" />
              <span>Banquillo de Suplentes Disponibles</span>
            </h3>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {players.slice(4).map((sub) => (
                <span
                  key={sub.id}
                  className="rounded-lg bg-slate-800/90 border border-slate-700 px-2 py-1 text-[11px] text-slate-300 font-medium"
                >
                  #{sub.dorsal} {sub.sportsName} ({sub.primaryPosition})
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Select Player Modal for Slot */}
      {selectingSlotIdx !== null && activeSlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-900 p-5 shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div>
                <h3 className="font-bold text-white text-sm">
                  Asignar Jugador a la Posición {activeSlot.slotPosition}
                </h3>
                <p className="text-[11px] text-slate-400">
                  Selecciona de la base de datos de Canarias
                </p>
              </div>
              <button onClick={() => setSelectingSlotIdx(null)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nombre o club..."
                className="w-full rounded-xl border border-slate-700 bg-slate-800 pl-9 pr-3 py-1.5 text-xs text-white"
              />
            </div>

            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
              {players
                .filter(p => !searchTerm || p.sportsName.toLowerCase().includes(searchTerm.toLowerCase()) || p.currentClub.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((p) => {
                  const isCurrent = activeSlot.player?.id === p.id;
                  const isCompatible = p.primaryPosition === activeSlot.slotPosition || p.secondaryPositions.includes(activeSlot.slotPosition);

                  return (
                    <div
                      key={p.id}
                      onClick={() => handleAssignPlayerToSlot(selectingSlotIdx, p)}
                      className={`flex items-center justify-between p-2.5 rounded-xl border text-xs cursor-pointer transition-colors ${
                        isCurrent 
                          ? 'bg-amber-500/20 border-amber-500/50 text-white' 
                          : 'bg-slate-800/60 border-slate-800 hover:bg-slate-800 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <img src={p.photoUrl} alt={p.sportsName} className="h-8 w-8 rounded-full object-cover border border-slate-700" />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-white">{p.sportsName}</span>
                            <span className="text-slate-500 font-mono text-[10px]">#{p.dorsal}</span>
                            {isCompatible && (
                              <span className="rounded bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 text-[9px] font-bold">
                                Compatible
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-400">{p.primaryPosition} • {p.currentClub} • {p.island}</p>
                        </div>
                      </div>

                      {isCurrent ? (
                        <span className="text-amber-400 text-xs font-bold">En el campo</span>
                      ) : (
                        <button className="rounded-lg bg-amber-500 px-2.5 py-1 text-[11px] font-bold text-slate-950 hover:bg-amber-400">
                          Seleccionar
                        </button>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
