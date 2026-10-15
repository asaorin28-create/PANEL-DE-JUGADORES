import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { DashboardView } from './components/dashboard/DashboardView';
import { PlayerListView } from './components/players/PlayerListView';
import { PlayerDetailModal } from './components/players/PlayerDetailModal';
import { PlayerFormModal } from './components/players/PlayerFormModal';
import { AddObservationModal } from './components/players/AddObservationModal';
import { AgendaView } from './components/agenda/AgendaView';
import { CallUpsView } from './components/callups/CallUpsView';
import { LineupBuilderView } from './components/lineup/LineupBuilderView';
import { TacticalBoardView } from './components/tactics/TacticalBoardView';
import { ReportsAndComparisonView } from './components/reports/ReportsAndComparisonView';
import { GoogleSheetsSyncView } from './components/sheets/GoogleSheetsSyncView';
import { RolesAuditView } from './components/admin/RolesAuditView';
import { ProjectZipExportModal } from './components/github/ProjectZipExportModal';
import { NotificationToast } from './components/notifications/NotificationToast';

const MainLayout: React.FC = () => {
  const { 
    activeTab, 
    selectedPlayerId, 
    setSelectedPlayerId, 
    editingPlayer,
    setEditingPlayer,
    isAddPlayerOpen, 
    setIsAddPlayerOpen, 
    isAddObservationOpen, 
    setIsAddObservationOpen 
  } = useApp();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isZipModalOpen, setIsZipModalOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 antialiased selection:bg-amber-500 selection:text-slate-950 font-sans">
      {/* Sidebar */}
      <Sidebar 
        collapsed={sidebarCollapsed} 
        setCollapsed={setSidebarCollapsed} 
        onOpenZipModal={() => setIsZipModalOpen(true)}
      />

      {/* Main View Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header onOpenZipModal={() => setIsZipModalOpen(true)} />

        <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6 bg-slate-950">
          {activeTab === 'dashboard' && <DashboardView />}
          {activeTab === 'players' && <PlayerListView />}
          {activeTab === 'agenda' && <AgendaView />}
          {activeTab === 'callups' && <CallUpsView />}
          {activeTab === 'lineups' && <LineupBuilderView />}
          {activeTab === 'tactics' && <TacticalBoardView />}
          {activeTab === 'reports' && <ReportsAndComparisonView />}
          {activeTab === 'sheets' && <GoogleSheetsSyncView />}
          {activeTab === 'admin' && <RolesAuditView />}
        </main>
      </div>

      {/* Modals */}
      {selectedPlayerId && (
        <PlayerDetailModal
          playerId={selectedPlayerId}
          onClose={() => setSelectedPlayerId(null)}
          onAddObservation={() => setIsAddObservationOpen(true)}
        />
      )}

      {/* Add New Player Modal */}
      {isAddPlayerOpen && (
        <PlayerFormModal onClose={() => setIsAddPlayerOpen(false)} />
      )}

      {/* Edit Existing Player Modal */}
      {editingPlayer && (
        <PlayerFormModal
          playerToEdit={editingPlayer}
          onClose={() => setEditingPlayer(null)}
        />
      )}

      {isAddObservationOpen && (
        <AddObservationModal
          onClose={() => setIsAddObservationOpen(false)}
          defaultPlayerId={selectedPlayerId}
        />
      )}

      {isZipModalOpen && (
        <ProjectZipExportModal onClose={() => setIsZipModalOpen(false)} />
      )}

      {/* Real-time Push Notifications Toast Overlay */}
      <NotificationToast />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
