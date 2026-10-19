import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Directory from '@/pages/index';
import apiClient from '@/api/client';

jest.mock('@/api/client', () => ({
  __esModule: true,
  default: { get: jest.fn() },
}));

jest.mock('next/head', () => ({ __esModule: true, default: ({ children }: any) => <>{children}</> }));
jest.mock('next/link', () => ({ __esModule: true, default: ({ children, href, ...rest }: any) => <a href={href} {...rest}>{children}</a> }));

const mockEmployees = [
  { id: 1, firstName: 'Sarah', lastName: 'Chen', email: 'sarah@test.com', jobTitle: 'Designer', department: 'Design', location: 'SF', phone: null, avatarUrl: null, createdAt: '2024-01-01T00:00:00.000Z' },
  { id: 2, firstName: 'Marcus', lastName: 'T', email: 'marcus@test.com', jobTitle: 'Engineer', department: 'Engineering', location: 'London', phone: null, avatarUrl: null, createdAt: '2024-01-01T00:00:00.000Z' },
];

describe('Directory page', () => {
  beforeEach(() => jest.clearAllMocks());

  it('renders employees after loading', async () => {
    (apiClient.get as jest.Mock).mockResolvedValue({ data: mockEmployees });
    render(<Directory />);
    await waitFor(() => expect(screen.getByText('Sarah Chen')).toBeInTheDocument());
    expect(screen.getByText('Marcus T')).toBeInTheDocument();
  });

  it('filters by search input', async () => {
    (apiClient.get as jest.Mock).mockResolvedValue({ data: mockEmployees });
    render(<Directory />);
    await waitFor(() => expect(screen.getByText('Sarah Chen')).toBeInTheDocument());
    const input = screen.getByPlaceholderText(/Search employees/);
    fireEvent.change(input, { target: { value: 'marcus' } });
    expect(screen.queryByText('Sarah Chen')).not.toBeInTheDocument();
    expect(screen.getByText('Marcus T')).toBeInTheDocument();
  });

  it('shows error on API failure', async () => {
    (apiClient.get as jest.Mock).mockRejectedValue(new Error('fail'));
    render(<Directory />);
    await waitFor(() => expect(screen.getByText('Failed to load employees')).toBeInTheDocument());
  });

  it('filters by department tab', async () => {
    (apiClient.get as jest.Mock).mockResolvedValue({ data: mockEmployees });
    render(<Directory />);
    await waitFor(() => expect(screen.getByText('Sarah Chen')).toBeInTheDocument());
    fireEvent.click(screen.getByText('Design'));
    expect(screen.getByText('Sarah Chen')).toBeInTheDocument();
    expect(screen.queryByText('Marcus T')).not.toBeInTheDocument();
  });
});