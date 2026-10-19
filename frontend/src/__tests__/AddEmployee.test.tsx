import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AddEmployee from '@/pages/addemployee';

const mockPush = jest.fn();
jest.mock('next/router', () => ({ useRouter: () => ({ push: mockPush }) }));

const mockPost = jest.fn();
jest.mock('@/api/client', () => ({ __esModule: true, default: { post: (...args: any[]) => mockPost(...args) } }));

describe('AddEmployee page', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('renders the form with required fields', () => {
    render(<AddEmployee />);
    expect(screen.getByText('Add New Employee')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('e.g. Sarah')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('e.g. Chen')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('e.g. sarah@crewmark.io')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('e.g. Senior Product Designer')).toBeInTheDocument();
  });

  it('shows validation error when required fields missing', async () => {
    render(<AddEmployee />);
    fireEvent.click(screen.getByText('Add Employee'));
    expect(await screen.findByText('Please fill in all required fields.')).toBeInTheDocument();
    expect(mockPost).not.toHaveBeenCalled();
  });

  it('submits form and navigates on success', async () => {
    mockPost.mockResolvedValueOnce({ data: { id: 1, firstName: 'Sarah', lastName: 'Chen', email: 'sarah@crewmark.io', jobTitle: 'Designer', createdAt: '2024-01-01' } });
    render(<AddEmployee />);
    fireEvent.change(screen.getByPlaceholderText('e.g. Sarah'), { target: { value: 'Sarah', name: 'firstName' } });
    fireEvent.change(screen.getByPlaceholderText('e.g. Chen'), { target: { value: 'Chen', name: 'lastName' } });
    fireEvent.change(screen.getByPlaceholderText('e.g. sarah@crewmark.io'), { target: { value: 'sarah@crewmark.io', name: 'email' } });
    fireEvent.change(screen.getByPlaceholderText('e.g. Senior Product Designer'), { target: { value: 'Designer', name: 'jobTitle' } });
    fireEvent.click(screen.getByText('Add Employee'));
    await waitFor(() => expect(mockPost).toHaveBeenCalledWith('/api/employees', expect.objectContaining({ firstName: 'Sarah', lastName: 'Chen', email: 'sarah@crewmark.io', jobTitle: 'Designer' })));
    await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/'));
  });

  it('shows error on API failure', async () => {
    mockPost.mockRejectedValueOnce({ response: { data: { message: 'Email taken' } } });
    render(<AddEmployee />);
    fireEvent.change(screen.getByPlaceholderText('e.g. Sarah'), { target: { value: 'A', name: 'firstName' } });
    fireEvent.change(screen.getByPlaceholderText('e.g. Chen'), { target: { value: 'B', name: 'lastName' } });
    fireEvent.change(screen.getByPlaceholderText('e.g. sarah@crewmark.io'), { target: { value: 'a@b.c', name: 'email' } });
    fireEvent.change(screen.getByPlaceholderText('e.g. Senior Product Designer'), { target: { value: 'Dev', name: 'jobTitle' } });
    fireEvent.click(screen.getByText('Add Employee'));
    expect(await screen.findByText('Email taken')).toBeInTheDocument();
  });

  it('cancel navigates back to directory', () => {
    render(<AddEmployee />);
    fireEvent.click(screen.getByText('Cancel'));
    expect(mockPush).toHaveBeenCalledWith('/');
  });
});