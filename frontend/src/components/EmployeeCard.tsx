import { Employee } from '@/types';

interface Props {
  employee: Employee;
}

export default function EmployeeCard({ employee }: Props) {
  const avatarUrl = employee.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${employee.firstName}`;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden group hover:-translate-y-0.5 transition-all">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="relative">
            <img
              src={avatarUrl}
              alt={`${employee.firstName} ${employee.lastName}`}
              className="w-16 h-16 rounded-full bg-slate-100 object-cover ring-2 ring-white shadow-md"
            />
            <span className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
          </div>
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
            {employee.firstName} {employee.lastName}
          </h3>
          <p className="text-sm font-medium text-slate-500">{employee.jobTitle}</p>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm text-slate-600">
            <MailIcon />
            <span className="truncate">{employee.email}</span>
          </div>
          {employee.location && (
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <PinIcon />
              <span>{employee.location}</span>
            </div>
          )}
          <div className="pt-3 flex flex-wrap gap-2">
            {employee.department && (
              <span className="px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 rounded">
                {employee.department}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="border-t border-slate-100 grid grid-cols-2">
        <button className="py-3 px-4 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-indigo-600 border-r border-slate-100 transition-all flex items-center justify-center gap-2">
          <MsgIcon /> Message
        </button>
        <button className="py-3 px-4 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-all flex items-center justify-center gap-2">
          <UserIcon /> Profile
        </button>
      </div>
    </div>
  );
}

function MailIcon() {
  return <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>;
}
function PinIcon() {
  return <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>;
}
function MsgIcon() {
  return <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;
}
function UserIcon() {
  return <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
}