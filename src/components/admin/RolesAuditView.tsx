import React from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Eye, 
  Check, 
  X, 
  Clock, 
  AlertTriangle,
  UserCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { UserRole } from '../../types';

export const RolesAuditView: React.FC = () => {
  const { auditLogs, currentUser, setCurrentUserRole } = useApp();

  const rolesMatrix: {
    role: UserRole;
    description: string;
    permissions: Record<string, boolean>;
  }[] = [
    {
      role: 'Administrador',
      description: 'Acceso total al sistema, gestión de usuarios, auditoría, configuración de Supabase y RGPD.',
      permissions: {
        'Alta / Edición Jugadores': true,
        'Registrar Observaciones': true,
        'Crear Convocatorias': true,
        'Pizarra Táctica y Onces': true,
        'Acceso Datos de Contacto Menores': true,
        'Sincronizar Google Sheets': true,
        'Gestión de Usuarios': true,
      },
    },
    {
      role: 'Coordinador de Selecciones',
      description: 'Supervisa el scouting de las 7 islas, aprueba convocatorias y planifica torneos.',
      permissions: {
        'Alta / Edición Jugadores': true,
        'Registrar Observaciones': true,
        'Crear Convocatorias': true,
        'Pizarra Táctica y Onces': true,
        'Acceso Datos de Contacto Menores': true,
        'Sincronizar Google Sheets': true,
        'Gestión de Usuarios': false,
      },
    },
    {
      role: 'Seleccionador',
      description: 'Responsable de una categoría específica (Sub-14, Sub-16, etc.), convocatorias y alineaciones.',
      permissions: {
        'Alta / Edición Jugadores': true,
        'Registrar Observaciones': true,
        'Crear Convocatorias': true,
        'Pizarra Táctica y Onces': true,
        'Acceso Datos de Contacto Menores': false,
        'Sincronizar Google Sheets': false,
        'Gestión de Usuarios': false,
      },
    },
    {
      role: 'Observador / Scout',
      description: 'Realiza el trabajo de campo en partidos locales e insulares, emite informes técnicos.',
      permissions: {
        'Alta / Edición Jugadores': true,
        'Registrar Observaciones': true,
        'Crear Convocatorias': false,
        'Pizarra Táctica y Onces': false,
        'Acceso Datos de Contacto Menores': false,
        'Sincronizar Google Sheets': false,
        'Gestión de Usuarios': false,
      },
    },
    {
      role: 'Entrenador',
      description: 'Manejo de pizarra táctica, jugadas a balón parado y diseño de onces iniciales.',
      permissions: {
        'Alta / Edición Jugadores': false,
        'Registrar Observaciones': false,
        'Crear Convocatorias': false,
        'Pizarra Táctica y Onces': true,
        'Acceso Datos de Contacto Menores': false,
        'Sincronizar Google Sheets': false,
        'Gestión de Usuarios': false,
      },
    },
    {
      role: 'Usuario de Consulta',
      description: 'Acceso de solo lectura para directivos y miembros de comités autorizados.',
      permissions: {
        'Alta / Edición Jugadores': false,
        'Registrar Observaciones': false,
        'Crear Convocatorias': false,
        'Pizarra Táctica y Onces': false,
        'Acceso Datos de Contacto Menores': false,
        'Sincronizar Google Sheets': false,
        'Gestión de Usuarios': false,
      },
    },
  ];

  const permissionKeys = Object.keys(rolesMatrix[0].permissions);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
          <ShieldCheck className="h-4 w-4" />
          <span>Control de Acceso por Roles (RBAC) & Privacidad RGPD</span>
        </div>
        <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
          Matriz de Permisos & Registro de Auditoría
        </h2>
        <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
          Cumplimiento estricto del RGPD y de la normativa de protección de datos de futbolistas menores de edad. Los datos de contacto personales permanecen restringidos y encriptados en Supabase.
        </p>
      </div>

      {/* Permissions Matrix Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center">
          <h3 className="font-bold text-white text-sm">Matriz de Roles y Permisos en Servidor</h3>
          <span className="text-xs text-slate-400">Rol activo actual: <strong className="text-amber-400">{currentUser.role}</strong></span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Rol en la Organización</th>
                {permissionKeys.map((k) => (
                  <th key={k} className="py-3 px-3 text-center">{k}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {rolesMatrix.map((item) => (
                <tr 
                  key={item.role}
                  className={`hover:bg-slate-800/40 transition-colors ${
                    currentUser.role === item.role ? 'bg-amber-500/10' : ''
                  }`}
                >
                  <td className="py-3 px-4">
                    <div className="font-bold text-white flex items-center gap-2">
                      <span>{item.role}</span>
                      {currentUser.role === item.role && (
                        <span className="rounded bg-amber-400 text-slate-950 px-1.5 py-0.2 text-[9px] font-black">
                          ACTIVO
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">{item.description}</p>
                  </td>

                  {permissionKeys.map((k) => {
                    const isGranted = item.permissions[k];
                    return (
                      <td key={k} className="py-3 px-3 text-center">
                        {isGranted ? (
                          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                            <Check className="h-3 w-3 stroke-[3]" />
                          </span>
                        ) : (
                          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-800 text-slate-600">
                            <X className="h-3 w-3" />
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <Clock className="h-4 w-4 text-sky-400" />
            <span>Registro de Auditoría y Trazabilidad (Audit Logs)</span>
          </h3>
          <span className="text-xs text-slate-400">Actividades registradas en tiempo real</span>
        </div>

        <div className="space-y-2">
          {auditLogs.map((log) => (
            <div
              key={log.id}
              className="flex items-center justify-between p-3 rounded-xl border border-slate-800 bg-slate-800/40 text-xs"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="rounded bg-sky-950 px-2 py-0.5 text-[10px] font-bold text-sky-400 border border-sky-800/60 font-mono">
                    {log.action}
                  </span>
                  <span className="font-bold text-white">{log.userName}</span>
                </div>
                <p className="text-slate-300">{log.details}</p>
              </div>

              <span className="text-[11px] text-slate-500 font-mono whitespace-nowrap ml-4">
                {log.timestamp}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
