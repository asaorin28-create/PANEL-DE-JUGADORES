import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Plus, 
  Filter, 
  CheckCircle2, 
  X, 
  Users, 
  Sparkles,
  Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { ScoutingEvent, Island } from '../../types';

export const AgendaView: React.FC = () => {
  const { events, addEvent, updateEventStatus, players } = useApp();

  const [selectedIsland, setSelectedIsland] = useState<string>('ALL');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [isNewEventModalOpen, setIsNewEventModalOpen] = useState(false);

  // New Event Form State
  const [title, setTitle] = useState('');
  const [type, setType] = useState<ScoutingEvent['type']>('Partido');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('11:00');
  const [location, setLocation] = useState('');
  const [island, setIsland] = useState<Island>('Gran Canaria');
  const [responsible, setResponsible] = useState('David Sousa');
  const [involvedTeams, setInvolvedTeams] = useState('');
  const [notes, setNotes] = useState('');

  const filteredEvents = events.filter((e) => {
    if (selectedIsland !== 'ALL' && e.island !== selectedIsland) return false;
    if (selectedType !== 'ALL' && e.type !== selectedType) return false;
    return true;
  });

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !location) return;

    addEvent({
      title,
      type,
      date,
      time,
      location,
      island,
      responsible,
      relatedPlayerIds: [],
      involvedTeams,
      status: 'Pendiente',
      notes,
    });

    setIsNewEventModalOpen(false);
    setTitle('');
    setLocation('');
  };

  const islands: Island[] = [
    'Gran Canaria', 'Tenerife', 'Lanzarote', 'Fuerteventura', 'La Palma', 'La Gomera', 'El Hierro'
  ];

  return (
    <div className="space-y-4 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span>Agenda de Scouting & Seguimiento</span>
            <span className="rounded-full bg-purple-500/20 px-2.5 py-0.5 text-xs font-bold text-purple-300 border border-purple-500/30">
              {filteredEvents.length} eventos
            </span>
          </h2>
          <p className="text-xs text-slate-400">
            Planificación de partidos presenciales, entrenamientos de tecnificación y concentraciones de selecciones
          </p>
        </div>

        <button
          onClick={() => setIsNewEventModalOpen(true)}
          className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-3.5 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400 shadow-md shadow-amber-500/20 transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Programar Evento</span>
        </button>
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center gap-2.5 rounded-2xl border border-slate-800 bg-slate-900/90 p-3 shadow-lg">
        <Filter className="h-4 w-4 text-slate-400 ml-1" />
        <span className="text-xs font-semibold text-slate-300">Filtrar por Isla:</span>
        <select
          value={selectedIsland}
          onChange={(e) => setSelectedIsland(e.target.value)}
          className="rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs text-white"
        >
          <option value="ALL">Todas las Islas</option>
          {islands.map((i) => (
            <option key={i} value={i}>{i}</option>
          ))}
        </select>

        <span className="text-xs font-semibold text-slate-300 ml-2">Tipo de Actividad:</span>
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs text-white"
        >
          <option value="ALL">Todos los tipos</option>
          <option value="Partido">Observación de Partidos</option>
          <option value="Seguimiento individual">Seguimiento individual</option>
          <option value="Entrenamiento">Entrenamientos</option>
          <option value="Concentración">Concentraciones</option>
          <option value="Torneo">Torneos</option>
        </select>
      </div>

      {/* Events List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredEvents.map((event) => (
          <div
            key={event.id}
            className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 shadow-lg hover:border-slate-700 transition-all space-y-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider mb-1 ${
                  event.type === 'Partido' ? 'bg-sky-500/20 text-sky-300' :
                  event.type === 'Entrenamiento' ? 'bg-emerald-500/20 text-emerald-300' :
                  'bg-purple-500/20 text-purple-300'
                }`}>
                  {event.type}
                </span>
                <h3 className="font-bold text-white text-sm">{event.title}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{event.involvedTeams}</p>
              </div>

              <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                event.status === 'Completado' 
                  ? 'bg-emerald-500/20 text-emerald-400' 
                  : 'bg-amber-500/20 text-amber-300'
              }`}>
                {event.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 border-t border-slate-800/80 pt-2.5">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-amber-400" />
                <span>{event.date} a las {event.time}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-sky-400" />
                <span className="truncate">{event.location} ({event.island})</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80 italic">
              "{event.notes}"
            </p>

            <div className="flex items-center justify-between border-t border-slate-800 pt-2 text-[11px] text-slate-400">
              <span>Responsable: <strong className="text-slate-200">{event.responsible}</strong></span>
              {event.status === 'Pendiente' ? (
                <button
                  onClick={() => updateEventStatus(event.id, 'Completado')}
                  className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-bold"
                >
                  <Check className="h-3.5 w-3.5" />
                  <span>Marcar Realizado</span>
                </button>
              ) : (
                <button
                  onClick={() => updateEventStatus(event.id, 'Pendiente')}
                  className="text-slate-500 hover:text-slate-400"
                >
                  Reabrir
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Create Event Modal */}
      {isNewEventModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-900 p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="font-bold text-white text-sm">Programar Nuevo Evento de Scouting</h3>
              <button onClick={() => setIsNewEventModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 block mb-1">Título del Evento</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="ej. Observación: Derbi Cadete Las Palmas - Tenerife"
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1">Tipo</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-white"
                  >
                    <option value="Partido">Observación Partido</option>
                    <option value="Seguimiento individual">Seguimiento individual</option>
                    <option value="Entrenamiento">Entrenamiento</option>
                    <option value="Concentración">Concentración</option>
                    <option value="Torneo">Torneo</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-300 block mb-1">Isla</label>
                  <select
                    value={island}
                    onChange={(e) => setIsland(e.target.value as any)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-white"
                  >
                    {islands.map((i) => (
                      <option key={i} value={i}>{i}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1">Fecha</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1">Hora</label>
                  <input
                    type="time"
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Instalación / Estadio</label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="ej. Estadio Antonio Afonso Tonono (Arucas)"
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Equipos Implicados</label>
                <input
                  type="text"
                  value={involvedTeams}
                  onChange={(e) => setInvolvedTeams(e.target.value)}
                  placeholder="ej. Arucas CF vs Orientación Marítima"
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Notas de Coordinación</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Objetivos específicos de seguimiento..."
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewEventModalOpen(false)}
                  className="rounded-lg border border-slate-700 px-3 py-1.5 text-slate-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-amber-500 px-4 py-1.5 font-bold text-slate-950 hover:bg-amber-400"
                >
                  Programar en Agenda
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
