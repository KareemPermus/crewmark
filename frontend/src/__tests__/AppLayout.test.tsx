import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

jest.mock('next/router', () => ({
  useRouter: () => ({ pathname: '/' }),
}));

jest.mock('next/link', () => {
  return ({ children, href, ...rest }: any) => <a href={href} {...rest}>{children}</a>;
});

import AppLayout from '@/components/layout/AppLayout';

describe('AppLayout', () => {
  it('renders brand name and nav links', () => {
    render(<AppLayout><div>page</div></AppLayout>);
    expect(screen.getByText('Crewmark')).toBeInTheDocument();
    expect(screen.getByText('Directory')).toBeInTheDocument();
    expect(screen.getByText('Add Employee')).toBeInTheDocument();
    expect(screen.getByText('page')).toBeInTheDocument();
  });

  it('renders nav links with correct hrefs', () => {
    render(<AppLayout><div>test</div></AppLayout>);
    const dirLink = screen.getByText('Directory').closest('a');
    expect(dirLink).toHaveAttribute('href', '/');
    const addLink = screen.getByText('Add Employee').closest('a');
    expect(addLink).toHaveAttribute('href', '/addemployee');
  });
});