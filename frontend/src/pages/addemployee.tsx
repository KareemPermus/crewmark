import React, { useState } from 'react';
import { useRouter } from 'next/router';
import apiClient from '@/api/client';
import type { Employee } from '@/types';
import styles from '@/components/AddEmployeeForm.module.css';

export default function AddEmployee() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    jobTitle: '',
    department: '',
    location: '',
    avatarUrl: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.firstName || !form.lastName || !form.email || !form.jobTitle) {
      setError('Please fill in all required fields.');
      return;
    }
    setLoading(true);
    try {
      const body: Record<string, string | undefined> = {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        jobTitle: form.jobTitle,
      };
      if (form.phone) body.phone = form.phone;
      if (form.department) body.department = form.department;
      if (form.location) body.location = form.location;
      if (form.avatarUrl) body.avatarUrl = form.avatarUrl;

      await apiClient.post('/api/employees', body);
      router.push('/');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to create employee.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Add New Employee</h1>
        <p className={styles.subtitle}>Fill in the details to add a new team member to the directory.</p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.grid}>
          <div className={styles.field}>
            <label className={styles.label}>First Name *</label>
            <input name="firstName" value={form.firstName} onChange={handleChange} className={styles.input} placeholder="e.g. Sarah" />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Last Name *</label>
            <input name="lastName" value={form.lastName} onChange={handleChange} className={styles.input} placeholder="e.g. Chen" />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Email *</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} className={styles.input} placeholder="e.g. sarah@crewmark.io" />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Phone</label>
            <input name="phone" value={form.phone} onChange={handleChange} className={styles.input} placeholder="e.g. +1 555-0123" />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Job Title *</label>
            <input name="jobTitle" value={form.jobTitle} onChange={handleChange} className={styles.input} placeholder="e.g. Senior Product Designer" />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Department</label>
            <input name="department" value={form.department} onChange={handleChange} className={styles.input} placeholder="e.g. Design" />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Location</label>
            <input name="location" value={form.location} onChange={handleChange} className={styles.input} placeholder="e.g. San Francisco, US" />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Avatar URL</label>
            <input name="avatarUrl" value={form.avatarUrl} onChange={handleChange} className={styles.input} placeholder="https://..." />
          </div>
        </div>

        <div className={styles.actions}>
          <button type="button" onClick={() => router.push('/')} className={styles.cancelBtn} disabled={loading}>
            Cancel
          </button>
          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Adding...' : 'Add Employee'}
          </button>
        </div>
      </form>
    </div>
  );
}