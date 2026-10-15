import React, { useState } from 'react';
import { X, UserPlus, MapPin, Shield, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { Island, Category, PlayerPosition, PreferredFoot, ScoutingStatus, PlayerRatings } from '../../types';

interface PlayerFormModalProps {
  onClose: () => void;
}

export const PlayerFormModal: React.FC<PlayerFormModalProps> = ({ onClose }) => {
  const { addPlayer, clubs } = useApp();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [sportsName, setSportsName] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [birthDate, setBirthDate] = useState('2010-06-15');
  const [category, setCategory] = useState<Category>('Sub-16');
  const [currentClub, setCurrentClub] = useState(clubs[0]?.name || 'UD Las Palmas');
  const [island, setIsland] = useState<Island>('Gran Canaria');
  const [municipality, setMunicipality] = useState('Las Palmas de GC');
  const [competition, setCompetition] = useState('Liga Cadete Autonómica');
  const [division, setDivision] = useState('Grupo Único');
  const [dorsal, setDorsal] = useState(10);
  const [dominantFoot, setDominantFoot] = useState<PreferredFoot>('Derecho');
  const [heightCm, setHeightCm] = useState(175);
  const [nationality, setNationality] = useState('Española');
  const [scoutResponsible, setScoutResponsible] = useState('David Sousa');
  const [primaryPosition, setPrimaryPosition] = useState<PlayerPosition>('MCO');
  const [secondaryPositions, setSecondaryPositions] = useState<PlayerPosition[]>(['MC', 'ED']);
  const [tacticalProfile, setTacticalProfile] = useState('Organizador de juego ofensivo y creativo');
  const [status, setStatus] = useState<ScoutingStatus>('En seguimiento');
  const [notes, setNotes] = useState('');

  // Default ratings (7.5 across the board)
  const defaultRatings: PlayerRatings = {
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
  };

  const handlePositionToggle = (pos: PlayerPosition) => {
    if (pos === primaryPosition) return;
    setSecondaryPositions((prev) =>
      prev.includes(pos) ? prev.filter((p) => p !== pos) : [...prev, pos]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !sportsName) {
      alert('Por favor, introduce el nombre, apellidos y nombre deportivo.');
      return;
    }

    addPlayer({
      firstName,
      lastName,
      sportsName,
      photoUrl: photoUrl || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80',
      birthDate,
      category,
      currentClub,
      island,
      municipality,
      competition,
      division,
      dorsal: Number(dorsal),
      dominantFoot,
      heightCm: Number(heightCm),
      nationality,
      scoutResponsible,
      primaryPosition,
      secondaryPositions,
      positionComfort: 9,
      tacticalProfile,
      status,
      ratings: defaultRatings,
      notes,
    });

    onClose();
  };

  const positionsList: PlayerPosition[] = [
    'POR', 'DFC', 'LD', 'LI', 'CAD', 'CAI', 'MCD', 'MC', 'INT_D', 'INT_I', 'MCO', 'ED', 'EI', 'DC', 'SD'
  ];

  const islandsList: Island[] = [
    'Gran Canaria', 'Tenerife', 'Lanzarote', 'Fuerteventura', 'La Palma', 'La Gomera', 'El Hierro'
  ];

  const categoriesList: Category[] = [
    'Sub-12', 'Sub-14', 'Sub-16', 'Sub-18', 'Sub-23', 'Absoluta'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative flex flex-col w-full max-w-2xl max-h-[92vh] rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-5 py-3.5">
          <div className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-amber-400" />
            <h3 className="font-bold text-sm text-white">Alta de Futbolista en Base de Datos</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          {/* Identification */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3.5 space-y-3">
            <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px] text-amber-400">
              1. Identificación y Ficha Federativa
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-slate-300 block mb-1">Nombre</label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="ej. Yeray"
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-white"
                />
              </div>
              <div>
                <label className="text-slate-300 block mb-1">Apellidos</label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="ej. Santana Cabrera"
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-white"
                />
              </div>
              <div>
                <label className="text-slate-300 block mb-1">Nombre Deportivo</label>
                <input
                  type="text"
                  required
                  value={sportsName}
                  onChange={(e) => setSportsName(e.target.value)}
                  placeholder="ej. Yeray Santana"
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-slate-300 block mb-1">Fecha Nacimiento</label>
                <input
                  type="date"
                  required
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-white"
                />
              </div>
              <div>
                <label className="text-slate-300 block mb-1">Categoría</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-white"
                >
                  {categoriesList.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-slate-300 block mb-1">Dorsal Habitual</label>
                <input
                  type="number"
                  min="1"
                  max="99"
                  value={dorsal}
                  onChange={(e) => setDorsal(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-white"
                />
              </div>
            </div>
          </div>

          {/* Club & Geographic */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3.5 space-y-3">
            <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px] text-sky-400">
              2. Ubicación y Club Actual
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-slate-300 block mb-1">Club Actual</label>
                <input
                  type="text"
                  required
                  value={currentClub}
                  onChange={(e) => setCurrentClub(e.target.value)}
                  placeholder="ej. UD Las Palmas"
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-white"
                />
              </div>
              <div>
                <label className="text-slate-300 block mb-1">Isla</label>
                <select
                  value={island}
                  onChange={(e) => setIsland(e.target.value as any)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-white"
                >
                  {islandsList.map((isl) => (
                    <option key={isl} value={isl}>{isl}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-slate-300 block mb-1">Municipio</label>
                <input
                  type="text"
                  value={municipality}
                  onChange={(e) => setMunicipality(e.target.value)}
                  placeholder="ej. Arucas"
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-white"
                />
              </div>
            </div>
          </div>

          {/* Tactical & Positions */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3.5 space-y-3">
            <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px] text-emerald-400">
              3. Posiciones y Flexibilidad Táctica
            </h4>
            <div>
              <label className="text-slate-300 block mb-1.5 font-bold">Posición Principal</label>
              <div className="flex flex-wrap gap-1.5">
                {positionsList.map((pos) => (
                  <button
                    type="button"
                    key={pos}
                    onClick={() => setPrimaryPosition(pos)}
                    className={`px-2 py-1 rounded text-xs font-bold transition-colors ${
                      primaryPosition === pos
                        ? 'bg-amber-400 text-slate-950'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {pos}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-slate-300 block mb-1.5 font-bold">Posiciones Secundarias Compatibles</label>
              <div className="flex flex-wrap gap-1.5">
                {positionsList.filter(p => p !== primaryPosition).map((pos) => {
                  const isSec = secondaryPositions.includes(pos);
                  return (
                    <button
                      type="button"
                      key={pos}
                      onClick={() => handlePositionToggle(pos)}
                      className={`px-2 py-1 rounded text-xs font-semibold transition-colors ${
                        isSec
                          ? 'bg-sky-500 text-white'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {pos}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-slate-300 block mb-1">Pie Dominante</label>
                <select
                  value={dominantFoot}
                  onChange={(e) => setDominantFoot(e.target.value as any)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-white"
                >
                  <option value="Derecho">Derecho</option>
                  <option value="Izquierdo">Izquierdo</option>
                  <option value="Ambidiestro">Ambidiestro</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Estado del Seguimiento</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-white"
                >
                  <option value="Nuevo">Nuevo</option>
                  <option value="Pendiente de observar">Pendiente de observar</option>
                  <option value="En seguimiento">En seguimiento</option>
                  <option value="Prioritario">Prioritario</option>
                  <option value="Propuesto para convocatoria">Propuesto para convocatoria</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-slate-300 block mb-1">Perfil Táctico / Rasgos Destacados</label>
              <input
                type="text"
                value={tacticalProfile}
                onChange={(e) => setTacticalProfile(e.target.value)}
                placeholder="ej. Extremo vertical con desborde en 1vs1"
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-white"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-xl bg-amber-500 px-5 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400 shadow-md shadow-amber-500/20"
            >
              Guardar en Supabase
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
