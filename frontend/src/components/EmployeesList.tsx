import { Employee } from '@/types';
import Link from 'next/link';

interface Props {
  employees: Employee[];
}

export default function EmployeesList({ employees }: Props) {
  if (employees.length === 0) {
    return <p className="text-center py-12 text-slate-400">No employees found.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {employees.map(emp => (
        <div key={emp.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden group hover:-translate-y-0.5 transition-all">
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="relative">
                <img
                  src={emp.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${emp.firstName}`}
                  alt={`${emp.firstName} ${emp.lastName}`}
                  className="w-16 h-16 rounded-full bg-slate-100 object-cover ring-2 ring-white shadow-md"
                />
                <span className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
              </div>
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{emp.firstName} {emp.lastName}</h3>
              <p className="text-sm font-medium text-slate-500">{emp.jobTitle}</p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                <span className="truncate">{emp.email}</span>
              </div>
              {emp.location && (
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                  <span>{emp.location}</span>
                </div>
              )}
              <div className="pt-3 flex flex-wrap gap-2">
                {emp.department && (
                  <span className="px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 rounded">{emp.department}</span>
                )}
              </div>
            </div>
          </div>
          <div className="border-t border-slate-100 grid grid-cols-2">
            <Link href={`/employees`} className="py-3 px-4 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-indigo-600 border-r border-slate-100 transition-all flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
              Message
            </Link>
            <Link href={`/employees`} className="py-3 px-4 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-all flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
              Profile
            </Link>
          </div>
        </div>
      ))}

      <Link href="/addemployee" className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl p-6 hover:border-indigo-400 hover:bg-indigo-50/30 transition-all group min-h-[340px]">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-4 group-hover:bg-indigo-100 group-hover:scale-110 transition-all">
          <svg className="w-6 h-6 text-slate-400 group-hover:text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
        </div>
        <span className="text-sm font-bold text-slate-500 group-hover:text-indigo-600">Add New Member</span>
        <p className="text-xs text-slate-400 mt-1 text-center">Expand your team and invite them to the directory</p>
      </Link>
    </div>
  );
}