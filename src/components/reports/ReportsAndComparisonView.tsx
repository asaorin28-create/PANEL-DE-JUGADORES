import React, { useState } from 'react';
import { 
  FileText, 
  Users, 
  Printer, 
  ArrowRight, 
  Star, 
  Download, 
  TrendingUp, 
  Check, 
  X,
  Shield,
  MapPin
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { Player } from '../../types';

export const ReportsAndComparisonView: React.FC = () => {
  const { players, observations } = useApp();

  const [mode, setMode] = useState<'comparador' | 'informeIndividual'>('comparador');

  // Comparison: Select between 2 and 4 players
  const [selectedIds, setSelectedIds] = useState<string[]>([
    players[0]?.id || '',
    players[1]?.id || '',
  ].filter(Boolean));

  // Single player report
  const [reportPlayerId, setReportPlayerId] = useState<string>(players[0]?.id || '');
  const reportPlayer = players.find((p) => p.id === reportPlayerId);
  const playerObs = observations.filter((o) => o.playerId === reportPlayerId);

  const [limitWarning, setLimitWarning] = useState(false);

  const comparedPlayers = players.filter((p) => selectedIds.includes(p.id));

  const toggleComparePlayer = (id: string) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length > 1) {
        setSelectedIds(selectedIds.filter((item) => item !== id));
      }
    } else {
      if (selectedIds.length < 4) {
        setSelectedIds([...selectedIds, id]);
        setLimitWarning(false);
      } else {
        setLimitWarning(true);
        setTimeout(() => setLimitWarning(false), 3000);
      }
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Radar polygon generator for comparison
  const radarMetrics = [
    { label: 'Técnica', key: 'controlOrientado' },
    { label: 'Visión', key: 'visionJuego' },
    { label: 'Velocidad', key: 'velocidad' },
    { label: 'Fuerza', key: 'fuerza' },
    { label: 'Táctica', key: 'comprensionJuego' },
    { label: 'Mental', key: 'liderazgo' },
  ];

  const colors = ['#f59e0b', '#38bdf8', '#10b981', '#ec4899'];

  return (
    <div className="space-y-4 pb-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span>Informes Técnicos & Comparativa de Jugadores</span>
          </h2>
          <p className="text-xs text-slate-400">
            Generador de dossiers técnicos oficiales de la FIFLP y análisis comparativo multidimensional
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Mode toggle */}
          <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700">
            <button
              onClick={() => setMode('comparador')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                mode === 'comparador' ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              Comparador (2 - 4 Jugadores)
            </button>
            <button
              onClick={() => setMode('informeIndividual')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                mode === 'informeIndividual' ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              Informe Individual PDF
            </button>
          </div>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-all cursor-pointer"
          >
            <Printer className="h-3.5 w-3.5 text-sky-400" />
            <span>Imprimir</span>
          </button>
        </div>
      </div>

      {mode === 'comparador' ? (
        <div className="space-y-6">
          {/* Player Selector Bar */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 shadow-lg space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Selecciona futbolistas para comparar (Máximo 4)
              </span>
              <div className="flex items-center gap-2">
                {limitWarning && (
                  <span className="text-xs text-red-400 font-semibold animate-pulse">
                    Máximo 4 futbolistas permitidos
                  </span>
                )}
                <span className="text-xs text-amber-400 font-bold">{selectedIds.length} / 4 seleccionados</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {players.map((p) => {
                const isSelected = selectedIds.includes(p.id);
                const colorIdx = selectedIds.indexOf(p.id);
                return (
                  <button
                    key={p.id}
                    onClick={() => toggleComparePlayer(p.id)}
                    style={{
                      borderColor: isSelected ? colors[colorIdx] : undefined,
                    }}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-slate-800 text-white shadow-md'
                        : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: isSelected ? colors[colorIdx] : '#64748b' }}
                    />
                    <span>{p.sportsName}</span>
                    <span className="text-[10px] text-slate-500">({p.primaryPosition})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Comparison Cards & Metrics Table */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg space-y-6">
            {/* Headers row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {comparedPlayers.map((player, idx) => (
                <div
                  key={player.id}
                  style={{ borderColor: colors[idx] }}
                  className="rounded-xl border-2 bg-slate-950/60 p-4 text-center space-y-2"
                >
                  <img
                    src={player.photoUrl}
                    alt={player.sportsName}
                    className="h-16 w-16 mx-auto rounded-full object-cover border-2"
                    style={{ borderColor: colors[idx] }}
                  />
                  <div>
                    <h4 className="font-black text-white text-base">{player.sportsName}</h4>
                    <p className="text-xs text-slate-400">{player.currentClub}</p>
                    <div className="flex items-center justify-center gap-1.5 mt-1">
                      <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-bold text-amber-400">
                        {player.primaryPosition}
                      </span>
                      <span className="text-[10px] text-slate-400">{player.island}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Direct Attribute Comparison Table */}
            <div className="overflow-x-auto border-t border-slate-800 pt-4">
              <table className="w-full text-xs text-left text-slate-300">
                <thead className="bg-slate-950 text-[11px] uppercase tracking-wider text-slate-400">
                  <tr>
                    <th className="py-2.5 px-4">Atributo Técnico / Físico</th>
                    {comparedPlayers.map((p, idx) => (
                      <th key={p.id} className="py-2.5 px-4 text-center" style={{ color: colors[idx] }}>
                        {p.sportsName}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {[
                    ['Control Orientado', (p: Player) => p.ratings.controlOrientado],
                    ['Visión de Juego', (p: Player) => p.ratings.visionJuego],
                    ['Pase Corto & Filtrado', (p: Player) => p.ratings.paseCorto],
                    ['Regate / 1vs1', (p: Player) => p.ratings.regate],
                    ['Velocidad Punta', (p: Player) => p.ratings.velocidad],
                    ['Resistencia Aeróbica', (p: Player) => p.ratings.resistencia],
                    ['Duelos Físicos / Fuerza', (p: Player) => p.ratings.fuerza],
                    ['Disciplina Táctica', (p: Player) => p.ratings.disciplinaTactica],
                    ['Liderazgo y Carácter', (p: Player) => p.ratings.liderazgo],
                  ].map(([label, accessor]: any) => (
                    <tr key={label} className="hover:bg-slate-800/40">
                      <td className="py-2.5 px-4 font-semibold text-slate-300">{label}</td>
                      {comparedPlayers.map((p) => {
                        const val = accessor(p);
                        return (
                          <td key={p.id} className="py-2.5 px-4 text-center font-bold text-white">
                            <span className="inline-block px-2 py-0.5 rounded bg-slate-800">
                              {val.toFixed(1)} / 10
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Individual Player Technical Report (Printable) */
        <div className="rounded-2xl border border-slate-700 bg-white p-8 text-slate-900 shadow-2xl space-y-6">
          {/* Selector */}
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase">Seleccionar Jugador para Informe:</span>
              <select
                value={reportPlayerId}
                onChange={(e) => setReportPlayerId(e.target.value)}
                className="ml-2 rounded-lg border border-slate-300 bg-slate-100 px-3 py-1 text-xs font-bold text-slate-900"
              >
                {players.map((p) => (
                  <option key={p.id} value={p.id}>{p.sportsName} ({p.currentClub})</option>
                ))}
              </select>
            </div>
            <div className="text-right text-xs text-slate-500">
              Federación Canaria de Fútbol • Documento Oficial de Scouting
            </div>
          </div>

          {reportPlayer && (
            <div className="space-y-6">
              {/* Report Header */}
              <div className="flex items-center gap-5 border-b pb-6">
                <img
                  src={reportPlayer.photoUrl}
                  alt={reportPlayer.sportsName}
                  className="h-24 w-24 rounded-2xl object-cover border-2 border-slate-900 shadow"
                />
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
                    Informe Técnico Individualizado
                  </span>
                  <h3 className="text-2xl font-black text-slate-950">
                    {reportPlayer.sportsName} (#{reportPlayer.dorsal})
                  </h3>
                  <p className="text-sm text-slate-600">
                    {reportPlayer.firstName} {reportPlayer.lastName} • {reportPlayer.primaryPosition}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Club: <strong>{reportPlayer.currentClub}</strong> • Isla: <strong>{reportPlayer.island}</strong> • Estado: <strong>{reportPlayer.status}</strong>
                  </p>
                </div>
              </div>

              {/* Technical Ratings Grid */}
              <div>
                <h4 className="text-xs font-bold text-slate-950 uppercase border-b pb-1 mb-3">
                  Evaluación de Cualidades Técnicas y Físicas
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-lg border">
                    <p className="text-slate-500">Control Orientado</p>
                    <p className="text-lg font-black text-slate-900">{reportPlayer.ratings.controlOrientado}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border">
                    <p className="text-slate-500">Pase Corto</p>
                    <p className="text-lg font-black text-slate-900">{reportPlayer.ratings.paseCorto}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border">
                    <p className="text-slate-500">Visión de Juego</p>
                    <p className="text-lg font-black text-slate-900">{reportPlayer.ratings.visionJuego}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border">
                    <p className="text-slate-500">Velocidad</p>
                    <p className="text-lg font-black text-slate-900">{reportPlayer.ratings.velocidad}</p>
                  </div>
                </div>
              </div>

              {/* Observer Comments and Historical Tracking */}
              <div>
                <h4 className="text-xs font-bold text-slate-950 uppercase border-b pb-1 mb-3">
                  Histórico de Observaciones de Selección ({playerObs.length})
                </h4>
                {playerObs.map((obs) => (
                  <div key={obs.id} className="p-4 bg-slate-50 rounded-xl border text-xs space-y-2 mb-2">
                    <div className="flex justify-between font-bold text-slate-900">
                      <span>{obs.match} ({obs.date})</span>
                      <span className="text-amber-600">Nota: {obs.ratingTecnica} / 10</span>
                    </div>
                    <p className="italic text-slate-700">"{obs.comments}"</p>
                    <p className="text-slate-500 text-[11px]">
                      Observador: <strong>{obs.observerName}</strong> • Recomendación: <strong>{obs.recommendations}</strong>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
