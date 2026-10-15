import React, { useState } from 'react';
import { X, Eye, Star, Plus, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { PlayerPosition } from '../../types';

interface AddObservationModalProps {
  onClose: () => void;
  defaultPlayerId?: string | null;
}

export const AddObservationModal: React.FC<AddObservationModalProps> = ({ 
  onClose,
  defaultPlayerId 
}) => {
  const { players, addObservation, currentUser } = useApp();

  const [playerId, setPlayerId] = useState(defaultPlayerId || players[0]?.id || '');
  const [match, setMatch] = useState('UD Las Palmas vs CD Tenerife (Derbi Autonómico)');
  const [rival, setRival] = useState('CD Tenerife');
  const [competition, setCompetition] = useState('Liga Cadete Autonómica');
  const [matchday, setMatchday] = useState('Jornada 7');
  const [stadium, setStadium] = useState('Anexo Gran Canaria');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [positionPlayed, setPositionPlayed] = useState<PlayerPosition>('MCO');
  const [minutesPlayed, setMinutesPlayed] = useState(80);
  const [matchContext, setMatchContext] = useState('Partido de alta intensidad competitiva. Césped sintético.');
  
  // Ratings
  const [ratingTecnica, setRatingTecnica] = useState(8.5);
  const [ratingTactica, setRatingTactica] = useState(8.0);
  const [ratingFisica, setRatingFisica] = useState(8.0);
  const [ratingMental, setRatingMental] = useState(8.5);

  // Notes
  const [strengthsText, setStrengthsText] = useState('Visión de juego periférica; Pase vertical filtrado; Capacidad de liderazgo');
  const [improvementsText, setImprovementsText] = useState('Repliegue tras pérdida; Intensidad en balones divididos');
  const [comments, setComments] = useState('Excelente lectura táctica del partido. Dominó el tempo en mediocampo y dio la asistencia decisiva.');
  const [recommendations, setRecommendations] = useState('Proponer para la convocatoria de la Fase 1 del Campeonato de España.');
  const [nextAction, setNextAction] = useState('Observación presencial en campo rival');
  const [videoUrl, setVideoUrl] = useState('');

  const selectedPlayer = players.find((p) => p.id === playerId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerId) return;

    addObservation({
      playerId,
      date,
      match,
      rival,
      competition,
      matchday,
      stadium,
      observerName: currentUser.name,
      observerId: currentUser.id,
      positionPlayed,
      minutesPlayed: Number(minutesPlayed),
      matchContext,
      ratingTecnica: Number(ratingTecnica),
      ratingTactica: Number(ratingTactica),
      ratingFisica: Number(ratingFisica),
      ratingMental: Number(ratingMental),
      strengths: strengthsText.split(';').map((s) => s.trim()).filter(Boolean),
      improvements: improvementsText.split(';').map((s) => s.trim()).filter(Boolean),
      comments,
      recommendations,
      videoUrl,
      nextAction,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative flex flex-col w-full max-w-2xl max-h-[92vh] rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-5 py-3.5">
          <div className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-sky-400" />
            <h3 className="font-bold text-sm text-white">Registrar Informe de Observación Presencial</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          {/* Player Selection */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3.5 space-y-2">
            <label className="text-slate-300 block font-bold">Futbolista Observado</label>
            <select
              value={playerId}
              onChange={(e) => setPlayerId(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white font-semibold"
            >
              {players.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.sportsName} ({p.primaryPosition} • {p.currentClub} • {p.island})
                </option>
              ))}
            </select>
          </div>

          {/* Match Context */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3.5 space-y-3">
            <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px] text-amber-400">
              Datos del Partido / Evento
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-slate-300 block mb-1">Partido</label>
                <input
                  type="text"
                  required
                  value={match}
                  onChange={(e) => setMatch(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-white"
                />
              </div>
              <div>
                <label className="text-slate-300 block mb-1">Equipo Rival</label>
                <input
                  type="text"
                  value={rival}
                  onChange={(e) => setRival(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
                <label className="text-slate-300 block mb-1">Estadio / Instalación</label>
                <input
                  type="text"
                  value={stadium}
                  onChange={(e) => setStadium(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-white"
                />
              </div>
              <div>
                <label className="text-slate-300 block mb-1">Fecha</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-white"
                />
              </div>
            </div>
          </div>

          {/* Ratings Sliders (1 to 10) */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3.5 space-y-3">
            <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px] text-sky-400">
              Valoraciones del Observador (Escala 1 al 10)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-300">Valoración Técnica</span>
                  <span className="font-bold text-amber-400">{ratingTecnica} / 10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="0.1"
                  value={ratingTecnica}
                  onChange={(e) => setRatingTecnica(parseFloat(e.target.value))}
                  className="w-full accent-amber-400"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-300">Valoración Táctica</span>
                  <span className="font-bold text-sky-400">{ratingTactica} / 10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="0.1"
                  value={ratingTactica}
                  onChange={(e) => setRatingTactica(parseFloat(e.target.value))}
                  className="w-full accent-sky-400"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-300">Valoración Física</span>
                  <span className="font-bold text-emerald-400">{ratingFisica} / 10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="0.1"
                  value={ratingFisica}
                  onChange={(e) => setRatingFisica(parseFloat(e.target.value))}
                  className="w-full accent-emerald-400"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-300">Valoración Mental / Competitiva</span>
                  <span className="font-bold text-purple-400">{ratingMental} / 10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="0.1"
                  value={ratingMental}
                  onChange={(e) => setRatingMental(parseFloat(e.target.value))}
                  className="w-full accent-purple-400"
                />
              </div>
            </div>
          </div>

          {/* Qualitative Notes */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3.5 space-y-3">
            <div>
              <label className="text-slate-300 block mb-1">Puntos Fuertes (separar con punto y coma ';')</label>
              <input
                type="text"
                value={strengthsText}
                onChange={(e) => setStrengthsText(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-white"
              />
            </div>

            <div>
              <label className="text-slate-300 block mb-1">Aspectos a Mejorar (separar con ';')</label>
              <input
                type="text"
                value={improvementsText}
                onChange={(e) => setImprovementsText(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-white"
              />
            </div>

            <div>
              <label className="text-slate-300 block mb-1">Comentarios Detallados</label>
              <textarea
                rows={2}
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-slate-300 block mb-1">Recomendación Final</label>
                <input
                  type="text"
                  value={recommendations}
                  onChange={(e) => setRecommendations(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-white"
                />
              </div>
              <div>
                <label className="text-slate-300 block mb-1">Próxima Acción Sugerida</label>
                <input
                  type="text"
                  value={nextAction}
                  onChange={(e) => setNextAction(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-white"
                />
              </div>
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
              Guardar Observación & Notificar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
