import { useState, useEffect, useMemo } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Employee } from '@/types';
import apiClient from '@/api/client';
import SearchBar from '@/components/SearchBar';
import EmployeeGrid from '@/components/EmployeeGrid';

export default function Directory() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All Employees');

  useEffect(() => {
    apiClient.get('/api/employees')
      .then(res => setEmployees(res.data))
      .catch(() => setError('Failed to load employees'))
      .finally(() => setLoading(false));
  }, []);

  const departments = useMemo(() => {
    const deps = new Set(employees.map(e => e.department).filter(Boolean));
    return ['All Employees', ...Array.from(deps)] as string[];
  }, [employees]);

  const filtered = useMemo(() => {
    let list = employees;
    if (departmentFilter !== 'All Employees') {
      list = list.filter(e => e.department === departmentFilter);
    }
    if (search.trim()) {
      const t = search.toLowerCase();
      list = list.filter(e =>
        `${e.firstName} ${e.lastName}`.toLowerCase().includes(t) ||
        e.jobTitle.toLowerCase().includes(t) ||
        (e.department || '').toLowerCase().includes(t) ||
        e.email.toLowerCase().includes(t)
      );
    }
    return list;
  }, [employees, search, departmentFilter]);

  return (
    <>
      <Head><title>Directory | Crewmark</title></Head>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard label="Total Team" value={employees.length} icon="👥" bg="bg-indigo-50" text="text-indigo-600" />
        <StatCard label="Departments" value={departments.length - 1} icon="🏢" bg="bg-amber-50" text="text-amber-600" />
        <StatCard label="With Location" value={employees.filter(e => e.location).length} icon="📍" bg="bg-emerald-50" text="text-emerald-600" />
        <StatCard label="Directory" value={filtered.length} icon="📋" bg="bg-sky-50" text="text-sky-600" subtitle="Showing" />
      </div>

      {/* Search + Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-slate-200 shadow-sm overflow-x-auto">
          {departments.map(dep => (
            <button
              key={dep}
              onClick={() => setDepartmentFilter(dep)}
              className={`px-4 py-1.5 text-sm font-medium rounded-md whitespace-nowrap ${
                departmentFilter === dep
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {dep}
            </button>
          ))}
        </div>
        <SearchBar value={search} onChange={setSearch} />
      </div>

      {/* Content */}
      {loading && <p className="text-slate-500 text-sm">Loading employees…</p>}
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {!loading && !error && (
        <>
          <EmployeeGrid employees={filtered} />
          <div className="mt-12 flex items-center justify-between text-sm text-slate-500 border-t border-slate-200 pt-8 pb-4">
            <p>Showing <span className="font-semibold text-slate-900">{filtered.length}</span> of <span className="font-semibold text-slate-900">{employees.length}</span> employees</p>
          </div>
        </>
      )}
    </>
  );
}

function StatCard({ label, value, icon, bg, text, subtitle }: {
  label: string; value: number; icon: string; bg: string; text: string; subtitle?: string;
}) {
  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</span>
        <div className={`p-1.5 ${bg} rounded-lg ${text} text-base`}>{icon}</div>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold text-slate-900">{value}</span>
        {subtitle && <span className="text-xs font-medium text-slate-400">{subtitle}</span>}
      </div>
    </div>
  );
}