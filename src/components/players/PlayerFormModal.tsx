import React, { useState, useEffect } from 'react';
import { X, UserPlus, MapPin, Shield, Check, Edit3, Image, Save } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { Island, Category, PlayerPosition, PreferredFoot, ScoutingStatus, PlayerRatings, Player } from '../../types';

interface PlayerFormModalProps {
  playerToEdit?: Player | null;
  onClose: () => void;
}

export const PlayerFormModal: React.FC<PlayerFormModalProps> = ({ playerToEdit, onClose }) => {
  const { addPlayer, updatePlayer, clubs } = useApp();

  const isEditing = Boolean(playerToEdit);

  const [firstName, setFirstName] = useState(playerToEdit?.firstName || '');
  const [lastName, setLastName] = useState(playerToEdit?.lastName || '');
  const [sportsName, setSportsName] = useState(playerToEdit?.sportsName || '');
  const [photoUrl, setPhotoUrl] = useState(playerToEdit?.photoUrl || '');
  const [birthDate, setBirthDate] = useState(playerToEdit?.birthDate || '2010-06-15');
  const [category, setCategory] = useState<Category>(playerToEdit?.category || 'Sub-16');
  const [currentClub, setCurrentClub] = useState(playerToEdit?.currentClub || clubs[0]?.name || 'UD Las Palmas');
  const [island, setIsland] = useState<Island>(playerToEdit?.island || 'Gran Canaria');
  const [municipality, setMunicipality] = useState(playerToEdit?.municipality || 'Las Palmas de GC');
  const [competition, setCompetition] = useState(playerToEdit?.competition || 'Liga Cadete Autonómica');
  const [division, setDivision] = useState(playerToEdit?.division || 'Grupo Único');
  const [dorsal, setDorsal] = useState(playerToEdit?.dorsal || 10);
  const [dominantFoot, setDominantFoot] = useState<PreferredFoot>(playerToEdit?.dominantFoot || 'Derecho');
  const [heightCm, setHeightCm] = useState(playerToEdit?.heightCm || 175);
  const [nationality, setNationality] = useState(playerToEdit?.nationality || 'Española');
  const [scoutResponsible, setScoutResponsible] = useState(playerToEdit?.scoutResponsible || 'David Sousa');
  const [primaryPosition, setPrimaryPosition] = useState<PlayerPosition>(playerToEdit?.primaryPosition || 'MCO');
  const [secondaryPositions, setSecondaryPositions] = useState<PlayerPosition[]>(playerToEdit?.secondaryPositions || ['MC', 'ED']);
  const [tacticalProfile, setTacticalProfile] = useState(playerToEdit?.tacticalProfile || 'Organizador de juego ofensivo y creativo');
  const [status, setStatus] = useState<ScoutingStatus>(playerToEdit?.status || 'En seguimiento');
  const [notes, setNotes] = useState(playerToEdit?.notes || '');
  const [videoUrl, setVideoUrl] = useState(playerToEdit?.videoUrl || '');

  // Default ratings (7.8 across the board if new, or existing ratings)
  const [ratings, setRatings] = useState<PlayerRatings>(
    playerToEdit?.ratings || {
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

  const [errorMessage, setErrorMessage] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (playerToEdit) {
      setFirstName(playerToEdit.firstName || '');
      setLastName(playerToEdit.lastName || '');
      setSportsName(playerToEdit.sportsName || '');
      setPhotoUrl(playerToEdit.photoUrl || '');
      setBirthDate(playerToEdit.birthDate || '2010-06-15');
      setCategory(playerToEdit.category || 'Sub-16');
      setCurrentClub(playerToEdit.currentClub || clubs[0]?.name || 'UD Las Palmas');
      setIsland(playerToEdit.island || 'Gran Canaria');
      setMunicipality(playerToEdit.municipality || 'Las Palmas de GC');
      setCompetition(playerToEdit.competition || 'Liga Cadete Autonómica');
      setDivision(playerToEdit.division || 'Grupo Único');
      setDorsal(playerToEdit.dorsal || 10);
      setDominantFoot(playerToEdit.dominantFoot || 'Derecho');
      setHeightCm(playerToEdit.heightCm || 175);
      setNationality(playerToEdit.nationality || 'Española');
      setScoutResponsible(playerToEdit.scoutResponsible || 'David Sousa');
      setPrimaryPosition(playerToEdit.primaryPosition || 'MCO');
      setSecondaryPositions(playerToEdit.secondaryPositions || []);
      setTacticalProfile(playerToEdit.tacticalProfile || '');
      setStatus(playerToEdit.status || 'En seguimiento');
      setNotes(playerToEdit.notes || '');
      setVideoUrl(playerToEdit.videoUrl || '');
      if (playerToEdit.ratings) {
        setRatings({ ...playerToEdit.ratings });
      }
    } else {
      setFirstName('');
      setLastName('');
      setSportsName('');
      setPhotoUrl('');
      setBirthDate('2010-06-15');
      setCategory('Sub-16');
      setCurrentClub(clubs[0]?.name || 'UD Las Palmas');
      setIsland('Gran Canaria');
      setMunicipality('Las Palmas de GC');
      setCompetition('Liga Cadete Autonómica');
      setDivision('Grupo Único');
      setDorsal(10);
      setDominantFoot('Derecho');
      setHeightCm(175);
      setNationality('Española');
      setScoutResponsible('David Sousa');
      setPrimaryPosition('MCO');
      setSecondaryPositions(['MC', 'ED']);
      setTacticalProfile('Organizador de juego ofensivo y creativo');
      setStatus('En seguimiento');
      setNotes('');
      setVideoUrl('');
    }
    setErrorMessage('');
  }, [playerToEdit, clubs]);

  const handlePositionToggle = (pos: PlayerPosition) => {
    if (pos === primaryPosition) return;
    setSecondaryPositions((prev) =>
      prev.includes(pos) ? prev.filter((p) => p !== pos) : [...prev, pos]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !sportsName.trim()) {
      setErrorMessage('Por favor, introduce el nombre, apellidos y nombre deportivo.');
      return;
    }

    const payload = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      sportsName: sportsName.trim(),
      photoUrl: photoUrl.trim() || playerToEdit?.photoUrl || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80',
      birthDate,
      category,
      currentClub: currentClub.trim(),
      island,
      municipality: municipality.trim(),
      competition: competition.trim(),
      division: division.trim(),
      dorsal: Number(dorsal) || 10,
      dominantFoot,
      heightCm: Number(heightCm) || 175,
      nationality: nationality.trim() || 'Española',
      scoutResponsible: scoutResponsible.trim() || 'David Sousa',
      primaryPosition,
      secondaryPositions,
      positionComfort: 9,
      tacticalProfile: tacticalProfile.trim(),
      status,
      ratings,
      notes: notes.trim(),
      videoUrl: videoUrl.trim(),
    };

    if (isEditing && playerToEdit) {
      updatePlayer(playerToEdit.id, payload);
    } else {
      addPlayer(payload);
    }

    setSaveSuccess(true);
    setTimeout(() => {
      onClose();
    }, 350);
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
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative flex flex-col w-full max-w-2xl max-h-[92vh] rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-5 py-3.5">
          <div className="flex items-center gap-2">
            {isEditing ? (
              <Edit3 className="h-5 w-5 text-amber-400" />
            ) : (
              <UserPlus className="h-5 w-5 text-amber-400" />
            )}
            <div>
              <h3 className="font-bold text-sm text-white">
                {isEditing ? `Actualizar Ficha de ${playerToEdit?.sportsName}` : 'Alta de Futbolista en Base de Datos'}
              </h3>
              {isEditing && (
                <span className="text-[10px] text-amber-400 font-mono">
                  {playerToEdit?.internalCode} • Modificación y guardado en Supabase
                </span>
              )}
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          {errorMessage && (
            <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-red-300 font-semibold flex items-center justify-between">
              <span>{errorMessage}</span>
              <button type="button" onClick={() => setErrorMessage('')} className="text-red-400 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {saveSuccess && (
            <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3 text-emerald-300 font-semibold flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-400" />
              <span>{isEditing ? '¡Datos actualizados con éxito en la base de datos!' : '¡Futbolista registrado con éxito!'}</span>
            </div>
          )}

          {/* Identification */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3.5 space-y-3">
            <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px] text-amber-400">
              1. Identificación y Ficha Federativa
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-slate-300 block mb-1 font-semibold">Nombre *</label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="ej. Yeray"
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-white focus:border-amber-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-slate-300 block mb-1 font-semibold">Apellidos *</label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="ej. Santana Cabrera"
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-white focus:border-amber-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-slate-300 block mb-1 font-semibold">Nombre Deportivo *</label>
                <input
                  type="text"
                  required
                  value={sportsName}
                  onChange={(e) => setSportsName(e.target.value)}
                  placeholder="ej. Yeray Santana"
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-white focus:border-amber-400 focus:outline-none"
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
                <label className="text-slate-300 block mb-1">Dorsal</label>
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

            <div>
              <label className="text-slate-300 block mb-1">URL Fotografía (o Google Drive URL)</label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  placeholder="https://... enlace de imagen del jugador"
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-white text-xs"
                />
                {photoUrl && (
                  <img src={photoUrl} alt="Preview" className="h-8 w-8 rounded-lg object-cover border border-amber-400" />
                )}
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
                <label className="text-slate-300 block mb-1 font-semibold">Club Actual *</label>
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-slate-300 block mb-1">Competición</label>
                <input
                  type="text"
                  value={competition}
                  onChange={(e) => setCompetition(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-white"
                />
              </div>
              <div>
                <label className="text-slate-300 block mb-1">Scout Asignado Responsable</label>
                <input
                  type="text"
                  value={scoutResponsible}
                  onChange={(e) => setScoutResponsible(e.target.value)}
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
                    className={`px-2 py-1 rounded text-xs font-bold transition-colors cursor-pointer ${
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
                      className={`px-2 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
                        isSec
                          ? 'bg-sky-500 text-white font-bold'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {pos}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
                <label className="text-slate-300 block mb-1">Altura (cm)</label>
                <input
                  type="number"
                  min="130"
                  max="215"
                  value={heightCm}
                  onChange={(e) => setHeightCm(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-bold text-amber-300">Estado del Seguimiento</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full rounded-lg border border-amber-500/60 bg-slate-800 px-3 py-1.5 text-amber-300 font-bold"
                >
                  <option value="Nuevo">Nuevo</option>
                  <option value="Pendiente de observar">Pendiente de observar</option>
                  <option value="En seguimiento">En seguimiento</option>
                  <option value="Prioritario">Prioritario</option>
                  <option value="Propuesto para convocatoria">Propuesto para convocatoria</option>
                  <option value="Convocado">Convocado</option>
                  <option value="En evaluación adicional">En evaluación adicional</option>
                  <option value="No prioritario">No prioritario</option>
                  <option value="Archivado">Archivado</option>
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

            <div>
              <label className="text-slate-300 block mb-1">Enlace a Vídeo de Jugadas / Scouting</label>
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://..."
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-white"
              />
            </div>

            <div>
              <label className="text-slate-300 block mb-1">Observaciones / Criterio del Scout</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Notas técnicas de evolución, perfil psicológico y seguimiento..."
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
              className="flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400 shadow-md shadow-amber-500/20 cursor-pointer"
            >
              <Save className="h-4 w-4" />
              <span>{isEditing ? 'Guardar Cambios del Jugador' : 'Crear Jugador en Supabase'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
