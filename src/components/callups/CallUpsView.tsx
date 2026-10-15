import React, { useState } from 'react';
import { 
  ClipboardList, 
  Award, 
  Calendar, 
  MapPin, 
  Plus, 
  UserPlus, 
  Printer, 
  AlertTriangle, 
  CheckCircle, 
  Download,
  Trash2,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { CallUp, Player } from '../../types';

export const CallUpsView: React.FC = () => {
  const { callUps, players, saveCallUp } = useApp();

  const [selectedCallUpId, setSelectedCallUpId] = useState(callUps[0]?.id || '');
  const activeCallUp = callUps.find((c) => c.id === selectedCallUpId) || callUps[0];

  const [isAddPlayerModalOpen, setIsAddPlayerModalOpen] = useState(false);
  const [isOfficialLetterView, setIsOfficialLetterView] = useState(false);

  // Selected & reserve player objects
  const selectedPlayers = players.filter((p) => activeCallUp?.selectedPlayerIds.includes(p.id));
  const reservePlayers = players.filter((p) => activeCallUp?.reservePlayerIds.includes(p.id));

  // Detect age warnings (e.g. Sub-16 should be born between 2010 and 2011)
  const ageWarnings = selectedPlayers.filter((p) => {
    const year = new Date(p.birthDate).getFullYear();
    if (activeCallUp?.category === 'Sub-16' && year < 2010) {
      return true; // Too old
    }
    return false;
  });

  const handleRemovePlayer = (id: string, isReserve = false) => {
    if (!activeCallUp) return;
    const updated = {
      ...activeCallUp,
      selectedPlayerIds: isReserve
        ? activeCallUp.selectedPlayerIds
        : activeCallUp.selectedPlayerIds.filter((pid) => pid !== id),
      reservePlayerIds: isReserve
        ? activeCallUp.reservePlayerIds.filter((pid) => pid !== id)
        : activeCallUp.reservePlayerIds,
    };
    saveCallUp(updated);
  };

  const handleAddPlayerToCallUp = (id: string, asReserve = false) => {
    if (!activeCallUp) return;
    if (activeCallUp.selectedPlayerIds.includes(id) || activeCallUp.reservePlayerIds.includes(id)) {
      alert('El jugador ya se encuentra en esta lista.');
      return;
    }

    const updated: CallUp = {
      ...activeCallUp,
      selectedPlayerIds: asReserve ? activeCallUp.selectedPlayerIds : [...activeCallUp.selectedPlayerIds, id],
      reservePlayerIds: asReserve ? [...activeCallUp.reservePlayerIds, id] : activeCallUp.reservePlayerIds,
    };
    saveCallUp(updated);
    setIsAddPlayerModalOpen(false);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-bold text-emerald-400 border border-emerald-500/30">
              <Award className="h-3.5 w-3.5" />
              Gestión de Convocatorias Federativas
            </span>
            <span className="text-xs text-slate-400">RFEF / FIFLP</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
            {activeCallUp?.title || 'Convocatoria Oficial'}
          </h2>
          <p className="text-xs text-slate-300">
            {activeCallUp?.selectionName} • {activeCallUp?.tournament}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Callup dropdown selector */}
          <select
            value={selectedCallUpId}
            onChange={(e) => setSelectedCallUpId(e.target.value)}
            className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-semibold text-white"
          >
            {callUps.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title} ({c.category})
              </option>
            ))}
          </select>

          <button
            onClick={() => setIsOfficialLetterView(!isOfficialLetterView)}
            className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-all cursor-pointer"
          >
            <Printer className="h-3.5 w-3.5 text-sky-400" />
            <span>{isOfficialLetterView ? 'Ver Modo Lista' : 'Carta Oficial PDF'}</span>
          </button>

          <button
            onClick={() => setIsAddPlayerModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-3.5 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400 shadow-md shadow-amber-500/20 transition-all cursor-pointer"
          >
            <UserPlus className="h-4 w-4" />
            <span>Añadir Futbolista</span>
          </button>
        </div>
      </div>

      {/* Incompatibility Alerts if any */}
      {ageWarnings.length > 0 && (
        <div className="flex items-center gap-3 rounded-xl border border-amber-500/40 bg-amber-500/10 p-3 text-xs text-amber-300">
          <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0" />
          <div>
            <span className="font-bold">Advertencia de Categoría de Edad:</span> Se detectaron futbolistas que superan el rango de nacimiento de la categoría {activeCallUp.category}: {ageWarnings.map(w => w.sportsName).join(', ')}.
          </div>
        </div>
      )}

      {/* Official Communication Letter Format (Printable) */}
      {isOfficialLetterView ? (
        <div className="rounded-2xl border border-slate-700 bg-white p-8 text-slate-900 shadow-2xl space-y-6">
          {/* Header of Letter */}
          <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4">
            <div>
              <h3 className="text-xl font-black uppercase tracking-wider text-slate-950">
                Federación Canaria de Fútbol
              </h3>
              <p className="text-xs font-semibold text-slate-600">
                Federación Interinsular de Fútbol de Las Palmas (FIFLP)
              </p>
              <p className="text-xs text-slate-500">
                Dirección Deportiva y Área de Selecciones Autonómicas
              </p>
            </div>
            <div className="text-right text-xs">
              <span className="font-bold text-slate-900">{activeCallUp.season}</span>
              <p className="text-slate-500">Fecha: {activeCallUp.date}</p>
            </div>
          </div>

          <div>
            <h4 className="text-base font-bold text-slate-950 uppercase text-center mb-1">
              COMUNICACIÓN OFICIAL DE CONVOCATORIA
            </h4>
            <p className="text-xs text-center text-slate-600 max-w-lg mx-auto">
              A la atención de los clubes afiliados de la Federación Canaria de Fútbol.
              Se cita a los siguientes jugadores para formar parte de la expedición oficial.
            </p>
          </div>

          {/* Roster Table */}
          <div className="space-y-4">
            <h5 className="text-xs font-bold text-slate-950 uppercase border-b border-slate-300 pb-1">
              Lista Principal de Seleccionados ({selectedPlayers.length} Jugadores)
            </h5>
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 font-bold border-b">
                <tr>
                  <th className="py-2 px-3">Dorsal</th>
                  <th className="py-2 px-3">Nombre y Apellidos</th>
                  <th className="py-2 px-3">Posición</th>
                  <th className="py-2 px-3">Club de Procedencia</th>
                  <th className="py-2 px-3">Isla</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {selectedPlayers.map((p, idx) => (
                  <tr key={p.id}>
                    <td className="py-2 px-3 font-bold">{p.dorsal}</td>
                    <td className="py-2 px-3 font-semibold">{p.firstName} {p.lastName} ({p.sportsName})</td>
                    <td className="py-2 px-3">{p.primaryPosition}</td>
                    <td className="py-2 px-3">{p.currentClub}</td>
                    <td className="py-2 px-3">{p.island}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {reservePlayers.length > 0 && (
              <div className="mt-4">
                <h5 className="text-xs font-bold text-slate-700 uppercase border-b border-slate-300 pb-1 mb-2">
                  Jugadores en Reserva ({reservePlayers.length})
                </h5>
                <p className="text-xs text-slate-600">
                  {reservePlayers.map(r => `${r.sportsName} (${r.currentClub})`).join(' • ')}
                </p>
              </div>
            )}
          </div>

          <div className="border-t border-slate-300 pt-4 flex justify-between text-xs text-slate-600">
            <div>
              <p className="font-bold text-slate-900">Cuerpo Técnico Oficial:</p>
              <p>{activeCallUp.coachingStaff.join(', ')}</p>
            </div>
            <div className="text-right">
              <p className="italic">Firmado digitalmente</p>
              <p className="font-bold text-slate-900">David Sousa — Coordinador de Selecciones</p>
            </div>
          </div>

          <div className="text-center pt-2">
            <button
              onClick={handlePrint}
              className="rounded-xl bg-slate-900 text-white font-bold px-6 py-2 text-xs shadow hover:bg-slate-800"
            >
              Imprimir Comunicación Oficial
            </button>
          </div>
        </div>
      ) : (
        /* Regular Management View */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Selected Players (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-white text-sm">
                    Jugadores Seleccionados Titulares
                  </h3>
                  <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs font-bold text-emerald-400">
                    {selectedPlayers.length} convocados
                  </span>
                </div>
                <span className="text-xs text-slate-400">Cupo sugerido: 18</span>
              </div>

              <div className="space-y-2">
                {selectedPlayers.length === 0 ? (
                  <p className="py-8 text-center text-xs text-slate-500">
                    Aún no hay futbolistas añadidos a esta convocatoria.
                  </p>
                ) : (
                  selectedPlayers.map((player) => (
                    <div
                      key={player.id}
                      className="flex items-center justify-between p-3 rounded-xl border border-slate-800 bg-slate-800/40 hover:bg-slate-800 transition-colors text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={player.photoUrl}
                          alt={player.sportsName}
                          className="h-10 w-10 rounded-full object-cover border border-slate-700"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-sm">{player.sportsName}</span>
                            <span className="rounded bg-amber-400 text-slate-950 font-black px-1.5 py-0.5 text-[10px]">
                              {player.primaryPosition}
                            </span>
                            <span className="font-mono text-slate-500 text-[10px]">#{player.dorsal}</span>
                          </div>
                          <p className="text-[11px] text-slate-400">
                            {player.currentClub} • {player.island}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleRemovePlayer(player.id, false)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 transition-colors"
                          title="Quitar de convocatoria"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Reserves & Details Sidebar */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h3 className="font-bold text-white text-sm">Lista de Reservas</h3>
                <span className="rounded-full bg-slate-800 px-2 py-0.5 text-xs text-slate-400">
                  {reservePlayers.length}
                </span>
              </div>

              <div className="space-y-2">
                {reservePlayers.length === 0 ? (
                  <p className="py-4 text-center text-xs text-slate-500">Sin reservas asignados</p>
                ) : (
                  reservePlayers.map((player) => (
                    <div
                      key={player.id}
                      className="flex items-center justify-between p-2 rounded-xl border border-slate-800 bg-slate-800/40 text-xs"
                    >
                      <div>
                        <span className="font-bold text-white">{player.sportsName}</span>
                        <p className="text-[10px] text-slate-400">{player.currentClub} ({player.primaryPosition})</p>
                      </div>
                      <button
                        onClick={() => handleRemovePlayer(player.id, true)}
                        className="p-1 text-slate-500 hover:text-red-400"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Event details */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg text-xs space-y-2">
              <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px] text-sky-400">
                Detalles del Torneo / Concentración
              </h4>
              <p><strong>Ubicación:</strong> {activeCallUp.location}</p>
              <p><strong>Fechas:</strong> {activeCallUp.date} {activeCallUp.endDate ? `al ${activeCallUp.endDate}` : ''}</p>
              <p><strong>Cuerpo Técnico:</strong> {activeCallUp.coachingStaff.join(', ')}</p>
              <p className="text-slate-400 italic mt-2 bg-slate-950/60 p-2.5 rounded border border-slate-800">
                "{activeCallUp.notes}"
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Add Player to Callup Modal */}
      {isAddPlayerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-900 p-5 shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="font-bold text-white text-sm">Seleccionar Jugador para Convocatoria</h3>
              <button onClick={() => setIsAddPlayerModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {players
                .filter(p => !activeCallUp.selectedPlayerIds.includes(p.id) && !activeCallUp.reservePlayerIds.includes(p.id))
                .map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between p-2.5 rounded-xl border border-slate-800 bg-slate-800/40 text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <img src={p.photoUrl} alt={p.sportsName} className="h-8 w-8 rounded-full object-cover" />
                      <div>
                        <span className="font-bold text-white">{p.sportsName}</span>
                        <p className="text-[10px] text-slate-400">{p.primaryPosition} • {p.currentClub} • {p.island}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleAddPlayerToCallUp(p.id, false)}
                        className="rounded-lg bg-emerald-500 px-2 py-1 text-[11px] font-bold text-slate-950 hover:bg-emerald-400"
                      >
                        Titular
                      </button>
                      <button
                        onClick={() => handleAddPlayerToCallUp(p.id, true)}
                        className="rounded-lg bg-slate-700 px-2 py-1 text-[11px] font-bold text-slate-200 hover:bg-slate-600"
                      >
                        Reserva
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
