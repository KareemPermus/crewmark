import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Employees from '@/pages/employees';
import apiClient from '@/api/client';

jest.mock('@/api/client', () => ({ __esModule: true, default: { get: jest.fn() } }));
jest.mock('next/link', () => ({ __esModule: true, default: ({ children, href }: any) => <a href={href}>{children}</a> }));

const mockEmployees = [
  { id: 1, firstName: 'Sarah', lastName: 'Chen', email: 'sarah@test.com', jobTitle: 'Designer', department: 'Design', location: 'SF', phone: null, avatarUrl: null, createdAt: '2024-01-01T00:00:00.000Z' },
  { id: 2, firstName: 'Marcus', lastName: 'T', email: 'marcus@test.com', jobTitle: 'Engineer', department: 'Engineering', location: 'London', phone: null, avatarUrl: null, createdAt: '2024-01-01T00:00:00.000Z' },
];

describe('Employees page', () => {
  beforeEach(() => jest.clearAllMocks());

  it('renders employee cards after loading', async () => {
    (apiClient.get as jest.Mock).mockResolvedValue({ data: mockEmployees });
    render(<Employees />);
    await waitFor(() => expect(screen.getByText('Sarah Chen')).toBeInTheDocument());
    expect(screen.getByText('Marcus T')).toBeInTheDocument();
    expect(screen.getByText('Showing 2 of 2 employees')).toBeInTheDocument();
  });

  it('filters by search input', async () => {
    (apiClient.get as jest.Mock).mockResolvedValue({ data: mockEmployees });
    render(<Employees />);
    await waitFor(() => expect(screen.getByText('Sarah Chen')).toBeInTheDocument());
    fireEvent.change(screen.getByPlaceholderText(/Search employees/), { target: { value: 'marcus' } });
    expect(screen.queryByText('Sarah Chen')).not.toBeInTheDocument();
    expect(screen.getByText('Marcus T')).toBeInTheDocument();
  });

  it('shows error on API failure', async () => {
    (apiClient.get as jest.Mock).mockRejectedValue(new Error('fail'));
    render(<Employees />);
    await waitFor(() => expect(screen.getByText('Failed to load employees')).toBeInTheDocument());
  });

  it('filters by department tab', async () => {
    (apiClient.get as jest.Mock).mockResolvedValue({ data: mockEmployees });
    render(<Employees />);
    await waitFor(() => expect(screen.getByText('Sarah Chen')).toBeInTheDocument());
    fireEvent.click(screen.getByText('Design'));
    expect(screen.getByText('Sarah Chen')).toBeInTheDocument();
    expect(screen.queryByText('Marcus T')).not.toBeInTheDocument();
  });
});