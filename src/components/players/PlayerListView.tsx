import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Pin, 
  PinOff, 
  Eye, 
  SlidersHorizontal, 
  ArrowUpDown, 
  FileSpreadsheet, 
  Check, 
  X, 
  ChevronRight,
  Shield,
  Star,
  Download
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { Player, Island, Category, PlayerPosition, PreferredFoot, ScoutingStatus } from '../../types';

export const PlayerListView: React.FC = () => {
  const { 
    players, 
    togglePinPlayer, 
    setSelectedPlayerId, 
    setIsAddPlayerOpen, 
    setIsAddObservationOpen,
    setActiveTab
  } = useApp();

  // Search & Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIslands, setSelectedIslands] = useState<Island[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [selectedPositions, setSelectedPositions] = useState<PlayerPosition[]>([]);
  const [selectedFoot, setSelectedFoot] = useState<PreferredFoot | 'ALL'>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<ScoutingStatus | 'ALL'>('ALL');
  const [minRating, setMinRating] = useState<number>(0);
  const [onlyPinned, setOnlyPinned] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Sorting
  const [sortField, setSortField] = useState<'sportsName' | 'rating' | 'category' | 'island' | 'callUpsCount'>('rating');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Multi-selection
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<string[]>([]);

  // Calculate age helper
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

  const calculateOverallRating = (p: Player): number => {
    const r = p.ratings;
    return Number(((r.controlOrientado + r.visionJuego + r.tomaDecisiones + r.paseCorto + r.comprensionJuego) / 5).toFixed(1));
  };

  // Preset quick views
  const applyPresetView = (preset: string) => {
    resetFilters();
    if (preset === 'centrales-zurdos') {
      setSelectedPositions(['DFC']);
      setSelectedFoot('Izquierdo');
    } else if (preset === 'extremos-prioritarios') {
      setSelectedPositions(['ED', 'EI']);
      setSelectedStatus('Prioritario');
    } else if (preset === 'cadetes-destacados') {
      setSelectedCategories(['Sub-16']);
      setMinRating(8);
    } else if (preset === 'porteros') {
      setSelectedPositions(['POR']);
    }
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedIslands([]);
    setSelectedCategories([]);
    setSelectedPositions([]);
    setSelectedFoot('ALL');
    setSelectedStatus('ALL');
    setMinRating(0);
    setOnlyPinned(false);
  };

  // Filtered & sorted players
  const filteredPlayers = useMemo(() => {
    return players.filter((player) => {
      // Search text
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const matchesName = 
          player.sportsName.toLowerCase().includes(term) ||
          player.firstName.toLowerCase().includes(term) ||
          player.lastName.toLowerCase().includes(term) ||
          player.currentClub.toLowerCase().includes(term) ||
          player.internalCode.toLowerCase().includes(term);
        if (!matchesName) return false;
      }

      // Island
      if (selectedIslands.length > 0 && !selectedIslands.includes(player.island)) {
        return false;
      }

      // Category
      if (selectedCategories.length > 0 && !selectedCategories.includes(player.category)) {
        return false;
      }

      // Position (check primary and secondary positions)
      if (selectedPositions.length > 0) {
        const matchesPos = 
          selectedPositions.includes(player.primaryPosition) ||
          player.secondaryPositions.some((sp) => selectedPositions.includes(sp));
        if (!matchesPos) return false;
      }

      // Foot
      if (selectedFoot !== 'ALL' && player.dominantFoot !== selectedFoot) {
        return false;
      }

      // Status
      if (selectedStatus !== 'ALL' && player.status !== selectedStatus) {
        return false;
      }

      // Min Rating
      if (minRating > 0 && calculateOverallRating(player) < minRating) {
        return false;
      }

      // Only pinned
      if (onlyPinned && !player.isPinned) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      let comparison = 0;
      if (sortField === 'sportsName') {
        comparison = a.sportsName.localeCompare(b.sportsName);
      } else if (sortField === 'rating') {
        comparison = calculateOverallRating(a) - calculateOverallRating(b);
      } else if (sortField === 'category') {
        comparison = a.category.localeCompare(b.category);
      } else if (sortField === 'island') {
        comparison = a.island.localeCompare(b.island);
      } else if (sortField === 'callUpsCount') {
        comparison = a.callUpsCount - b.callUpsCount;
      }
      return sortOrder === 'desc' ? -comparison : comparison;
    });
  }, [
    players, 
    searchTerm, 
    selectedIslands, 
    selectedCategories, 
    selectedPositions, 
    selectedFoot, 
    selectedStatus, 
    minRating, 
    onlyPinned,
    sortField,
    sortOrder
  ]);

  const toggleSelectAll = () => {
    if (selectedPlayerIds.length === filteredPlayers.length) {
      setSelectedPlayerIds([]);
    } else {
      setSelectedPlayerIds(filteredPlayers.map((p) => p.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedPlayerIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['Código', 'Nombre Deportivo', 'Nombre Completo', 'Posición', 'Posiciones Secundarias', 'Club', 'Isla', 'Edad', 'Pie', 'Estado', 'Nota Media'];
    const rows = filteredPlayers.map((p) => [
      p.internalCode,
      p.sportsName,
      `${p.firstName} ${p.lastName}`,
      p.primaryPosition,
      p.secondaryPositions.join('; '),
      p.currentClub,
      p.island,
      getAge(p.birthDate),
      p.dominantFoot,
      p.status,
      calculateOverallRating(p),
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + 
      [headers.join(','), ...rows.map(e => e.map(val => `"${val}"`).join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Canarias_Scout_Jugadores_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const allPositions: PlayerPosition[] = [
    'POR', 'DFC', 'LD', 'LI', 'CAD', 'CAI', 'MCD', 'MC', 'INT_D', 'INT_I', 'MCO', 'ED', 'EI', 'DC', 'SD'
  ];

  const allIslands: Island[] = [
    'Gran Canaria', 'Tenerife', 'Lanzarote', 'Fuerteventura', 'La Palma', 'La Gomera', 'El Hierro'
  ];

  const allCategories: Category[] = [
    'Sub-12', 'Sub-14', 'Sub-16', 'Sub-18', 'Sub-23', 'Absoluta'
  ];

  return (
    <div className="space-y-4 pb-12">
      {/* Top Header & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span>Base de Datos de Futbolistas</span>
            <span className="rounded-full bg-amber-500/20 px-2.5 py-0.5 text-xs font-bold text-amber-400 border border-amber-500/30">
              {filteredPlayers.length} encontrados
            </span>
          </h2>
          <p className="text-xs text-slate-400">
            Seguimiento técnico individual, categorización federativa y filtros combinados estilo Wyscout
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={exportToCSV}
            className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-all cursor-pointer"
            title="Exportar listado actual a Excel CSV"
          >
            <Download className="h-3.5 w-3.5 text-emerald-400" />
            <span>Exportar CSV</span>
          </button>

          <button
            onClick={() => setIsAddPlayerOpen(true)}
            className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-3.5 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400 shadow-md shadow-amber-500/20 transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Nuevo Jugador</span>
          </button>
        </div>
      </div>

      {/* Main Search & Preset Filter Bar */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 shadow-lg space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-2.5">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nombre, club, posición o identificador (ej: Yeray, Las Palmas, CAN-2026)..."
              className="w-full rounded-xl border border-slate-700 bg-slate-800/80 pl-10 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:border-amber-400 focus:outline-none"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Toggle Advanced Filters Button */}
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all cursor-pointer ${
              showAdvancedFilters || selectedIslands.length > 0 || selectedPositions.length > 0 || minRating > 0
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Filter className="h-3.5 w-3.5" />
            <span>Filtros Avanzados</span>
            {(selectedIslands.length > 0 || selectedPositions.length > 0 || minRating > 0) && (
              <span className="flex h-2 w-2 rounded-full bg-amber-400" />
            )}
          </button>

          {/* Pinned toggle */}
          <button
            onClick={() => setOnlyPinned(!onlyPinned)}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition-all cursor-pointer ${
              onlyPinned 
                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40' 
                : 'border border-slate-700 bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
            title="Mostrar solo jugadores fijados con chincheta"
          >
            <Pin className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Fijados</span>
          </button>
        </div>

        {/* Quick Preset Filter Badges */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-800/60">
          <span className="text-[11px] font-semibold text-slate-400">Vistas guardadas:</span>
          <button
            onClick={() => applyPresetView('centrales-zurdos')}
            className="rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700/60 px-2.5 py-1 text-[11px] text-slate-300 transition-colors"
          >
            Centrales zurdos
          </button>
          <button
            onClick={() => applyPresetView('extremos-prioritarios')}
            className="rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700/60 px-2.5 py-1 text-[11px] text-slate-300 transition-colors"
          >
            Extremos de seguimiento prioritario
          </button>
          <button
            onClick={() => applyPresetView('cadetes-destacados')}
            className="rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700/60 px-2.5 py-1 text-[11px] text-slate-300 transition-colors"
          >
            Sub-16 con Nota &gt;= 8.0
          </button>
          <button
            onClick={() => applyPresetView('porteros')}
            className="rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700/60 px-2.5 py-1 text-[11px] text-slate-300 transition-colors"
          >
            Porteros
          </button>
          {(selectedIslands.length > 0 || selectedPositions.length > 0 || selectedCategories.length > 0 || minRating > 0 || selectedFoot !== 'ALL') && (
            <button
              onClick={resetFilters}
              className="text-[11px] text-red-400 hover:text-red-300 ml-auto font-medium"
            >
              Limpiar todos los filtros
            </button>
          )}
        </div>

        {/* Expandable Advanced Filters Drawer */}
        {showAdvancedFilters && (
          <div className="pt-3 border-t border-slate-800 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-in fade-in duration-150">
            {/* Filter by Island */}
            <div>
              <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5 block">
                Islas Canarias
              </label>
              <div className="flex flex-wrap gap-1.5">
                {allIslands.map((island) => {
                  const isSelected = selectedIslands.includes(island);
                  return (
                    <button
                      key={island}
                      onClick={() => {
                        setSelectedIslands((prev) =>
                          isSelected ? prev.filter((i) => i !== island) : [...prev, island]
                        );
                      }}
                      className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors ${
                        isSelected
                          ? 'bg-amber-400 text-slate-950 font-bold'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {island}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Filter by Position */}
            <div>
              <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5 block">
                Posiciones (Ppal. o Sec.)
              </label>
              <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                {allPositions.map((pos) => {
                  const isSelected = selectedPositions.includes(pos);
                  return (
                    <button
                      key={pos}
                      onClick={() => {
                        setSelectedPositions((prev) =>
                          isSelected ? prev.filter((p) => p !== pos) : [...prev, pos]
                        );
                      }}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors ${
                        isSelected
                          ? 'bg-sky-400 text-slate-950'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {pos}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Filter by Category & Foot */}
            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1 block">
                  Categoría
                </label>
                <div className="flex flex-wrap gap-1">
                  {allCategories.map((cat) => {
                    const isSelected = selectedCategories.includes(cat);
                    return (
                      <button
                        key={cat}
                        onClick={() => {
                          setSelectedCategories((prev) =>
                            isSelected ? prev.filter((c) => c !== cat) : [...prev, cat]
                          );
                        }}
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors ${
                          isSelected ? 'bg-emerald-400 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1 block">
                  Pie Dominante
                </label>
                <select
                  value={selectedFoot}
                  onChange={(e) => setSelectedFoot(e.target.value as any)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-2 py-1 text-xs text-white"
                >
                  <option value="ALL">Cualquiera</option>
                  <option value="Derecho">Diestro</option>
                  <option value="Izquierdo">Zurdo</option>
                  <option value="Ambidiestro">Ambidiestro</option>
                </select>
              </div>
            </div>

            {/* Min Rating Slider */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                  Nota Mínima
                </label>
                <span className="text-xs font-bold text-amber-400">
                  {minRating > 0 ? `${minRating}.0 / 10` : 'Todas'}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="9"
                step="0.5"
                value={minRating}
                onChange={(e) => setMinRating(parseFloat(e.target.value))}
                className="w-full accent-amber-400"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>0</span>
                <span>5.0</span>
                <span>7.0</span>
                <span>9.0+</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Wyscout Style Table (Image 1 reference) */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 px-3 w-8">
                  <input
                    type="checkbox"
                    checked={selectedPlayerIds.length === filteredPlayers.length && filteredPlayers.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-slate-700 text-amber-500 focus:ring-0"
                  />
                </th>
                <th className="py-3 px-2 w-8 text-center">Pin</th>
                <th 
                  onClick={() => {
                    setSortField('sportsName');
                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                  }}
                  className="py-3 px-3 font-bold text-white cursor-pointer hover:text-amber-400 transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Futbolista</span>
                    <ArrowUpDown className="h-3 w-3 text-slate-500" />
                  </div>
                </th>
                <th className="py-3 px-3">Equipo & Isla</th>
                <th className="py-3 px-3">Posición</th>
                <th className="py-3 px-2 text-center">Edad</th>
                <th className="py-3 px-2 text-center">Pie</th>
                <th 
                  onClick={() => {
                    setSortField('rating');
                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                  }}
                  className="py-3 px-3 text-center font-bold text-amber-400 cursor-pointer hover:underline"
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>Valoración</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="py-3 px-3">Estado Scouting</th>
                <th className="py-3 px-3 text-center">Convocatorias</th>
                <th className="py-3 px-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredPlayers.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-slate-500 text-sm">
                    No se encontraron futbolistas con los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                filteredPlayers.map((player) => {
                  const rating = calculateOverallRating(player);
                  const isSelected = selectedPlayerIds.includes(player.id);
                  const age = getAge(player.birthDate);

                  return (
                    <tr
                      key={player.id}
                      className={`hover:bg-slate-800/60 transition-colors ${
                        isSelected ? 'bg-amber-500/10' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-3 px-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectOne(player.id)}
                          className="rounded border-slate-700 text-amber-500 focus:ring-0"
                        />
                      </td>

                      {/* Pin button */}
                      <td className="py-3 px-2 text-center">
                        <button
                          onClick={() => togglePinPlayer(player.id)}
                          className={`p-1 rounded hover:bg-slate-800 transition-colors ${
                            player.isPinned ? 'text-amber-400' : 'text-slate-600 hover:text-slate-400'
                          }`}
                          title={player.isPinned ? 'Quitar de fijados' : 'Fijar jugador'}
                        >
                          <Pin className="h-3.5 w-3.5" />
                        </button>
                      </td>

                      {/* Player Name and Avatar */}
                      <td 
                        onClick={() => setSelectedPlayerId(player.id)}
                        className="py-3 px-3 cursor-pointer group"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={player.photoUrl}
                            alt={player.sportsName}
                            className="h-10 w-10 rounded-full object-cover border border-slate-700 group-hover:border-amber-400 transition-colors"
                          />
                          <div>
                            <div className="font-bold text-white group-hover:text-amber-300 transition-colors flex items-center gap-1.5">
                              <span>{player.sportsName}</span>
                              <span className="text-[10px] text-slate-500 font-mono">#{player.dorsal}</span>
                            </div>
                            <p className="text-[11px] text-slate-400">
                              {player.firstName} {player.lastName}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Club and Island */}
                      <td className="py-3 px-3">
                        <p className="font-medium text-slate-200">{player.currentClub}</p>
                        <p className="text-[11px] text-slate-400">{player.island} • {player.municipality}</p>
                      </td>

                      {/* Positions */}
                      <td className="py-3 px-3">
                        <div className="flex flex-wrap items-center gap-1">
                          <span className="rounded bg-amber-400 text-slate-950 font-black px-1.5 py-0.5 text-[10px]">
                            {player.primaryPosition}
                          </span>
                          {player.secondaryPositions.map((sp) => (
                            <span 
                              key={sp} 
                              className="rounded bg-slate-800 text-slate-400 border border-slate-700 px-1 py-0.5 text-[9px]"
                            >
                              {sp}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Age */}
                      <td className="py-3 px-2 text-center font-semibold text-slate-200">
                        {age} <span className="text-[10px] text-slate-500 font-normal">años</span>
                      </td>

                      {/* Foot */}
                      <td className="py-3 px-2 text-center text-[11px] text-slate-300">
                        {player.dominantFoot}
                      </td>

                      {/* Rating */}
                      <td className="py-3 px-3 text-center">
                        <span className={`inline-block font-black text-xs px-2 py-0.5 rounded-full ${
                          rating >= 8.5 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                          rating >= 7.5 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                          'bg-slate-800 text-slate-300'
                        }`}>
                          {rating}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          player.status === 'Prioritario' ? 'bg-amber-500/20 text-amber-300' :
                          player.status === 'Convocado' ? 'bg-emerald-500/20 text-emerald-300' :
                          player.status === 'Propuesto para convocatoria' ? 'bg-sky-500/20 text-sky-300' :
                          'bg-slate-800 text-slate-400'
                        }`}>
                          <span className="h-1.5 w-1.5 rounded-full bg-current" />
                          {player.status}
                        </span>
                      </td>

                      {/* Callups Count */}
                      <td className="py-3 px-3 text-center font-bold text-slate-300">
                        {player.callUpsCount > 0 ? (
                          <span className="rounded-full bg-sky-950 px-2 py-0.5 text-[11px] text-sky-400 border border-sky-800/60">
                            {player.callUpsCount}
                          </span>
                        ) : (
                          <span className="text-slate-600">-</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedPlayerId(player.id)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-400 hover:text-sky-300 transition-colors"
                            title="Ver ficha completa"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedPlayerId(player.id);
                              setIsAddObservationOpen(true);
                            }}
                            className="p-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 transition-colors"
                            title="Añadir observación de scouting"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
