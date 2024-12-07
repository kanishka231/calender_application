export async function isAuthenticated() {
    const res = await fetch('/api/auth/status', {
      method: 'GET',
      credentials: 'include',
    });
    const data = await res.json();
    return data.authenticated;
  }
  