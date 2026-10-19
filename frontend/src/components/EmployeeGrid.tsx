import Link from 'next/link';
import { Employee } from '@/types';
import EmployeeCard from './EmployeeCard';

interface Props {
  employees: Employee[];
}

export default function EmployeeGrid({ employees }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {employees.map(emp => (
        <EmployeeCard key={emp.id} employee={emp} />
      ))}
      <Link href="/addemployee" className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl p-6 hover:border-indigo-400 hover:bg-indigo-50/30 transition-all group min-h-[340px]">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-4 group-hover:bg-indigo-100 group-hover:scale-110 transition-all">
          <span className="text-2xl text-slate-400 group-hover:text-indigo-600">+</span>
        </div>
        <span className="text-sm font-bold text-slate-500 group-hover:text-indigo-600">Add New Member</span>
        <p className="text-xs text-slate-400 mt-1 text-center">Expand your team and invite them to the directory</p>
      </Link>
    </div>
  );
}