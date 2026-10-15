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
  X,
  Search
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { CallUp, Player, Category } from '../../types';

export const CallUpsView: React.FC = () => {
  const { callUps, players, saveCallUp, deleteCallUp } = useApp();

  const [selectedCallUpId, setSelectedCallUpId] = useState(callUps[0]?.id || '');
  const activeCallUp = callUps.find((c) => c.id === selectedCallUpId) || callUps[0];

  const [isAddPlayerModalOpen, setIsAddPlayerModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isOfficialLetterView, setIsOfficialLetterView] = useState(false);
  const [searchPlayerTerm, setSearchPlayerTerm] = useState('');

  // New Call-up form fields
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<Category>('Sub-16');
  const [newSeason, setNewSeason] = useState('2025/2026');
  const [newSelectionName, setNewSelectionName] = useState('Selección Canaria Sub-16 Masculina');
  const [newTournament, setNewTournament] = useState('Campeonato de España de Selecciones Autonómicas (RFEF)');
  const [newDate, setNewDate] = useState('2026-11-15');
  const [newLocation, setNewLocation] = useState('Estadio Gran Canaria / Las Palmas');
  const [newStaff, setNewStaff] = useState('David Sousa (Seleccionador), Alexis Trujillo (2º Entrenador)');
  const [newNotes, setNewNotes] = useState('');

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

  const [addPlayerError, setAddPlayerError] = useState('');

  const handleAddPlayerToCallUp = (id: string, asReserve = false) => {
    if (!activeCallUp) return;
    if (activeCallUp.selectedPlayerIds.includes(id) || activeCallUp.reservePlayerIds.includes(id)) {
      setAddPlayerError('El jugador ya se encuentra en esta lista.');
      return;
    }

    const updated: CallUp = {
      ...activeCallUp,
      selectedPlayerIds: asReserve ? activeCallUp.selectedPlayerIds : [...activeCallUp.selectedPlayerIds, id],
      reservePlayerIds: asReserve ? [...activeCallUp.reservePlayerIds, id] : activeCallUp.reservePlayerIds,
    };
    saveCallUp(updated);
    setAddPlayerError('');
    setIsAddPlayerModalOpen(false);
  };

  const handleCreateCallUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newCallUp: CallUp = {
      id: 'call-' + Date.now(),
      title: newTitle.trim(),
      category: newCategory,
      season: newSeason,
      selectionName: newSelectionName,
      tournament: newTournament,
      date: newDate,
      location: newLocation,
      coachingStaff: newStaff.split(',').map(s => s.trim()).filter(Boolean),
      selectedPlayerIds: [],
      reservePlayerIds: [],
      pendingConfirmationIds: [],
      notes: newNotes,
      isOfficialPublished: true,
      createdAt: new Date().toISOString(),
    };

    saveCallUp(newCallUp);
    setSelectedCallUpId(newCallUp.id);
    setIsCreateModalOpen(false);
    setNewTitle('');
  };

  const handleDeleteCallUp = () => {
    if (!activeCallUp) return;
    if (confirm(`¿Estás seguro de que deseas eliminar la convocatoria "${activeCallUp.title}"?`)) {
      deleteCallUp(activeCallUp.id);
      const remaining = callUps.filter(c => c.id !== activeCallUp.id);
      if (remaining.length > 0) setSelectedCallUpId(remaining[0].id);
    }
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
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-3 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400 shadow-sm cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Nueva Convocatoria</span>
          </button>

          <button
            onClick={() => setIsOfficialLetterView(!isOfficialLetterView)}
            className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-all cursor-pointer"
          >
            <Printer className="h-3.5 w-3.5 text-sky-400" />
            <span>{isOfficialLetterView ? 'Ver Modo Lista' : 'Carta Oficial PDF'}</span>
          </button>

          <button
            onClick={() => setIsAddPlayerModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl bg-emerald-500 px-3.5 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-400 shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
          >
            <UserPlus className="h-4 w-4" />
            <span>Añadir Futbolista</span>
          </button>

          {activeCallUp && (
            <button
              onClick={handleDeleteCallUp}
              className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-400 hover:text-red-400 transition-colors"
              title="Eliminar convocatoria"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Incompatibility Alerts if any */}
      {ageWarnings.length > 0 && (
        <div className="flex items-center gap-3 rounded-xl border border-amber-500/40 bg-amber-500/10 p-3 text-xs text-amber-300">
          <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0" />
          <div>
            <span className="font-bold">Advertencia de Categoría de Edad:</span> Se detectaron futbolistas que superan el rango de nacimiento de la categoría {activeCallUp?.category}: {ageWarnings.map(w => w.sportsName).join(', ')}.
          </div>
        </div>
      )}

      {/* Official Communication Letter Format */}
      {isOfficialLetterView ? (
        <div className="rounded-2xl border border-slate-700 bg-white p-8 text-slate-900 shadow-2xl space-y-6">
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
              <span className="font-bold text-slate-900">{activeCallUp?.season}</span>
              <p className="text-slate-500">Fecha: {activeCallUp?.date}</p>
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
                {selectedPlayers.map((p) => (
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
              <p>{activeCallUp?.coachingStaff?.join(', ')}</p>
            </div>
            <div className="text-right">
              <p className="italic">Firmado digitalmente</p>
              <p className="font-bold text-slate-900">David Sousa — Coordinador de Selecciones</p>
            </div>
          </div>

          <div className="text-center pt-2">
            <button
              onClick={handlePrint}
              className="rounded-xl bg-slate-900 text-white font-bold px-6 py-2 text-xs shadow hover:bg-slate-800 cursor-pointer"
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
                    Aún no hay futbolistas añadidos a esta convocatoria. Pulsa "Añadir Futbolista".
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
                          className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 transition-colors cursor-pointer"
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
                        className="p-1 text-slate-500 hover:text-red-400 cursor-pointer"
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
              <p><strong>Ubicación:</strong> {activeCallUp?.location}</p>
              <p><strong>Fechas:</strong> {activeCallUp?.date} {activeCallUp?.endDate ? `al ${activeCallUp?.endDate}` : ''}</p>
              <p><strong>Cuerpo Técnico:</strong> {activeCallUp?.coachingStaff?.join(', ')}</p>
              <p className="text-slate-400 italic mt-2 bg-slate-950/60 p-2.5 rounded border border-slate-800">
                "{activeCallUp?.notes || 'Convocatoria oficial validada por la dirección deportiva.'}"
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Create New Convocatoria */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-900 p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="font-bold text-white text-sm">Crear Nueva Convocatoria Oficial</h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCallUp} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 block mb-1 font-semibold">Título de la Convocatoria *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="ej. Campeonato de España Sub-16 — Fase Final"
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1">Categoría</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as Category)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-white"
                  >
                    <option value="Sub-12">Sub-12</option>
                    <option value="Sub-14">Sub-14</option>
                    <option value="Sub-16">Sub-16</option>
                    <option value="Sub-18">Sub-18</option>
                    <option value="Sub-23">Sub-23</option>
                    <option value="Absoluta">Absoluta</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-300 block mb-1">Temporada</label>
                  <input
                    type="text"
                    value={newSeason}
                    onChange={(e) => setNewSeason(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1">Fecha</label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1">Ubicación / Estadio</label>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Torneo / Motivo</label>
                <input
                  type="text"
                  value={newTournament}
                  onChange={(e) => setNewTournament(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Cuerpo Técnico (separado por comas)</label>
                <input
                  type="text"
                  value={newStaff}
                  onChange={(e) => setNewStaff(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="rounded-lg border border-slate-700 px-3 py-1.5 text-slate-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-emerald-500 px-4 py-1.5 font-bold text-slate-950 hover:bg-emerald-400 cursor-pointer"
                >
                  Crear Convocatoria
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Player to Callup Modal */}
      {isAddPlayerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-900 p-5 shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div>
                <h3 className="font-bold text-white text-sm">Añadir Jugador a la Convocatoria</h3>
                <p className="text-[11px] text-slate-400">{activeCallUp?.title}</p>
              </div>
              <button onClick={() => setIsAddPlayerModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Filter / Search input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={searchPlayerTerm}
                onChange={(e) => setSearchPlayerTerm(e.target.value)}
                placeholder="Filtrar por nombre, club o isla..."
                className="w-full rounded-xl border border-slate-700 bg-slate-800 pl-9 pr-3 py-1.5 text-xs text-white"
              />
            </div>

            {addPlayerError && (
              <div className="rounded-lg bg-red-500/20 border border-red-500/40 p-2 text-xs text-red-300 font-semibold flex items-center justify-between">
                <span>{addPlayerError}</span>
                <button onClick={() => setAddPlayerError('')} className="text-red-400 hover:text-white">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )}

            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {players
                .filter(p => !activeCallUp?.selectedPlayerIds.includes(p.id) && !activeCallUp?.reservePlayerIds.includes(p.id))
                .filter(p => !searchPlayerTerm || p.sportsName.toLowerCase().includes(searchPlayerTerm.toLowerCase()) || p.currentClub.toLowerCase().includes(searchPlayerTerm.toLowerCase()) || p.island.toLowerCase().includes(searchPlayerTerm.toLowerCase()))
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
                        className="rounded-lg bg-emerald-500 px-2.5 py-1 text-[11px] font-bold text-slate-950 hover:bg-emerald-400 cursor-pointer"
                      >
                        Titular
                      </button>
                      <button
                        onClick={() => handleAddPlayerToCallUp(p.id, true)}
                        className="rounded-lg bg-slate-700 px-2.5 py-1 text-[11px] font-bold text-slate-200 hover:bg-slate-600 cursor-pointer"
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
