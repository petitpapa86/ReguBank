// Minimal IO functions for json-server API
export const ioFunctions = {
  httpGet: <T>(url: string) => async (): Promise<T> => {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Network error');
    return await response.json();
  },
  httpPost: <T>(url: string, body: unknown) => async (): Promise<T> => {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (!response.ok) throw new Error('Network error');
    return await response.json();
  },
  httpPut: <T>(url: string, body: unknown) => async (): Promise<T> => {
    const response = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (!response.ok) throw new Error('Network error');
    return await response.json();
  },
  httpDelete: (url: string) => async (): Promise<void> => {
    const response = await fetch(url, { method: 'DELETE' });
    if (!response.ok) throw new Error('Network error');
  }
};
