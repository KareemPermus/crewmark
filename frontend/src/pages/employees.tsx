import { useEffect, useState, useMemo } from 'react';
import apiClient from '@/api/client';
import { Employee } from '@/types';
import EmployeesList from '@/components/EmployeesList';

export default function Employees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('All');

  useEffect(() => {
    apiClient.get('/api/employees')
      .then(res => setEmployees(res.data))
      .catch(() => setError('Failed to load employees'))
      .finally(() => setLoading(false));
  }, []);

  const departments = useMemo(() => {
    const set = new Set<string>();
    employees.forEach(e => { if (e.department) set.add(e.department); });
    return ['All', ...Array.from(set).sort()];
  }, [employees]);

  const filtered = useMemo(() => {
    let list = employees;
    if (department !== 'All') list = list.filter(e => e.department === department);
    if (search.trim()) {
      const t = search.toLowerCase();
      list = list.filter(e =>
        `${e.firstName} ${e.lastName}`.toLowerCase().includes(t) ||
        e.jobTitle.toLowerCase().includes(t) ||
        (e.email && e.email.toLowerCase().includes(t)) ||
        (e.department && e.department.toLowerCase().includes(t))
      );
    }
    return list;
  }, [employees, search, department]);

  if (loading) return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" /></div>;
  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;

  return (
    <div>
      {/* Search */}
      <div className="mb-6">
        <div className="relative w-full max-w-md">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="11" cy="11" r="8" strokeWidth="2"/><path strokeLinecap="round" strokeWidth="2" d="m21 21-4.35-4.35"/></svg>
          <input
            type="text"
            placeholder="Search employees by name, role, or department..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Department filter tabs */}
      <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-slate-200 shadow-sm overflow-x-auto mb-6">
        {departments.map(d => (
          <button
            key={d}
            onClick={() => setDepartment(d)}
            className={`px-4 py-1.5 text-sm font-medium rounded-md whitespace-nowrap ${department === d ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            {d === 'All' ? 'All Employees' : d}
          </button>
        ))}
      </div>

      <EmployeesList employees={filtered} />

      {/* Footer */}
      <div className="mt-8 text-sm text-slate-500 border-t border-slate-200 pt-6 pb-4">
        Showing <span className="font-semibold text-slate-900">{filtered.length}</span> of <span className="font-semibold text-slate-900">{employees.length}</span> employees
      </div>
    </div>
  );
}