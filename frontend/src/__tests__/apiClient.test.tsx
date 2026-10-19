import apiClient from '@/api/client';

describe('apiClient', () => {
  it('has correct default baseURL', () => {
    expect(apiClient.defaults.baseURL).toBe('');
  });

  it('has JSON content-type header', () => {
    expect(apiClient.defaults.headers['Content-Type']).toBe('application/json');
  });
});